const jobRepository = require('../repositories/jobRepository');
const customerRepository = require('../repositories/customerRepository');
const technicianRepository = require('../repositories/technicianRepository');
const inventoryRepository = require('../repositories/inventoryRepository');
const paymentRepository = require('../repositories/paymentRepository');
const notificationRepository = require('../repositories/notificationRepository');

// Helper to validate status transitions
const isValidTransition = (current, target) => {
  if (current === target) return true;
  if (target === 'Delayed') return true; // Can delay anytime

  const order = {
    'Pending': 0,
    'Assigned': 1,
    'On The Way': 2,
    'Arrived': 3,
    'In Progress': 4,
    'Completed': 5,
    'Paid': 6
  };

  const currentIdx = order[current] !== undefined ? order[current] : -1;
  const targetIdx = order[target] !== undefined ? order[target] : -1;

  // Cannot transition backward from Completed or Paid
  if (currentIdx >= 5 && targetIdx < currentIdx) {
    return false;
  }

  // Cannot jump straight from Pending to Completed or Paid
  if (current === 'Pending' && (target === 'Completed' || target === 'Paid' || target === 'In Progress')) {
    return false;
  }

  // Allow going back from Assigned to Pending (unassign)
  if (current === 'Assigned' && target === 'Pending') {
    return true;
  }

  return true;
};

const jobService = {
  getAll: async () => {
    return await jobRepository.getAll();
  },

  getById: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    return job;
  },

  create: async (jobData) => {
    const customer = await customerRepository.findById(jobData.customerId);
    if (!customer) {
      const err = new Error(`Customer with ID ${jobData.customerId} not found`);
      err.status = 400;
      throw err;
    }

    let technicianName = 'Unassigned';
    let status = 'Pending';
    let timeline = [
      { status: 'Pending', time: new Date().toISOString(), note: 'Customer request registered' }
    ];

    if (jobData.technicianId) {
      const tech = await technicianRepository.findById(jobData.technicianId);
      if (tech) {
        technicianName = tech.name;
        status = 'Assigned';
        timeline.push({
          status: 'Assigned',
          time: new Date().toISOString(),
          note: `Technician ${tech.name} Assigned`
        });

        // Set technician status toward On Job / Busy, and update workload
        await technicianRepository.update(tech.id, {
          status: 'On Job',
          assignedJobsCount: tech.assignedJobsCount + 1,
          workload: Math.min(100, tech.workload + 30)
        });
      }
    }

    const job = await jobRepository.create({
      ...jobData,
      customerName: customer.name,
      customerPhone: customer.phone,
      technicianName,
      status,
      timeline
    });

    // Send a notification
    await notificationRepository.create({
      title: 'New Job Created',
      message: `New job ${job.id} (${job.serviceType}) created for ${customer.name}.`
    });

    return job;
  },

  updateStatus: async (id, status, noteText) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    if (!isValidTransition(job.status, status)) {
      const err = new Error(`Invalid status transition from '${job.status}' to '${status}'`);
      err.status = 400;
      throw err;
    }

    // Default notes per status if noteText is not given
    const defaultNotes = {
      'Pending': 'Customer request registered',
      'Assigned': `Technician ${job.technicianName} Assigned`,
      'On The Way': 'Technician is on the way to the location.',
      'Arrived': 'Technician has arrived at the location.',
      'In Progress': 'Service/diagnostic started.',
      'Completed': 'Job completed.',
      'Delayed': 'Job schedule delayed.',
      'Paid': 'Payment processed successfully.'
    };

    const finalNote = noteText || defaultNotes[status] || `Status updated to ${status}`;

    const updatedTimeline = [
      ...job.timeline,
      { status, time: new Date().toISOString(), note: finalNote }
    ];

    const updates = {
      status,
      timeline: updatedTimeline
    };

    // If assigned or on job status changed, sync technician status
    if (job.technicianId) {
      const tech = await technicianRepository.findById(job.technicianId);
      if (tech) {
        if (status === 'On The Way' || status === 'Arrived' || status === 'In Progress') {
          await technicianRepository.update(tech.id, { status: 'On Job' });
        } else if (status === 'Completed' || status === 'Paid') {
          // If no other active jobs, mark Available
          const allJobs = await jobRepository.getAll();
          const activeJobs = allJobs.filter(
            j => j.technicianId === tech.id && j.id !== job.id && j.status !== 'Completed' && j.status !== 'Paid'
          );
          await technicianRepository.update(tech.id, {
            status: activeJobs.length > 0 ? 'On Job' : 'Available',
            assignedJobsCount: Math.max(0, tech.assignedJobsCount - 1),
            completedJobsCount: tech.completedJobsCount + 1,
            workload: Math.max(0, tech.workload - 30)
          });
        }
      }
    }

    const updatedJob = await jobRepository.update(id, updates);

    // If marked Paid, also update linked payment record if exists
    if (status === 'Paid') {
      const payment = await paymentRepository.findByJobId(id);
      if (payment) {
        await paymentRepository.update(payment.id, { status: 'Paid' });
      }
    }

    return updatedJob;
  },

  complete: async (id, completeData) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    // Prevent double deduction & processing
    const isAlreadyCompleted = job.status === 'Completed' || job.status === 'Paid';

    const partsUsed = completeData.partsUsed || [];
    const serviceCharge = Number(completeData.serviceCharge || 0);

    let partsCost = 0;

    // Validate stock and count parts cost
    const validatedParts = [];
    for (const partInput of partsUsed) {
      const partId = partInput.partId || partInput.id;
      const part = await inventoryRepository.findById(partId);
      if (!part) {
        const err = new Error(`Inventory item with ID ${partId} not found`);
        err.status = 400;
        throw err;
      }

      const qty = Number(partInput.quantity);
      
      // Stock validation (only if not already completed/deducted)
      if (!isAlreadyCompleted && part.stock < qty) {
        const err = new Error(`Insufficient stock for part: ${part.partName}. Available: ${part.stock}, Requested: ${qty}`);
        err.status = 400;
        throw err;
      }

      partsCost += part.price * qty;
      validatedParts.push({
        partId: part.id,
        partName: part.partName,
        quantity: qty,
        price: part.price
      });
    }

    const totalAmount = serviceCharge + partsCost;

    // Deduct stock if not already completed
    if (!isAlreadyCompleted) {
      for (const p of validatedParts) {
        const part = await inventoryRepository.findById(p.partId);
        const newStock = Math.max(0, part.stock - p.quantity);
        await inventoryRepository.update(p.partId, { stock: newStock });

        // Trigger notification if low/critical
        let newStatus = 'In Stock';
        if (newStock === 0) newStatus = 'Critical';
        else if (newStock <= part.minStock) newStatus = 'Low Stock';

        if (newStatus === 'Critical' || newStatus === 'Low Stock') {
          await notificationRepository.create({
            title: newStatus === 'Critical' ? 'Out of Stock Warning' : 'Low Stock Warning',
            message: `${part.partName} is ${newStatus.toLowerCase()} (${newStock} remaining).`
          });
        }
      }
    }

    // Set timeline
    const updatedTimeline = [...job.timeline];
    if (job.status !== 'Completed') {
      updatedTimeline.push({
        status: 'Completed',
        time: new Date().toISOString(),
        note: completeData.notes || 'Service completed successfully'
      });
    }

    // Update job
    const updatedJob = await jobRepository.update(id, {
      status: 'Completed',
      partsUsed: validatedParts,
      serviceCharge,
      partsCost,
      totalAmount,
      beforePhoto: completeData.beforePhoto || job.beforePhoto,
      afterPhoto: completeData.afterPhoto || job.afterPhoto,
      notes: completeData.notes || job.notes,
      timeline: updatedTimeline
    });

    // Update Technician metrics
    if (job.technicianId && !isAlreadyCompleted) {
      const tech = await technicianRepository.findById(job.technicianId);
      if (tech) {
        const allJobs = await jobRepository.getAll();
        const activeJobs = allJobs.filter(
          j => j.technicianId === tech.id && j.id !== job.id && j.status !== 'Completed' && j.status !== 'Paid'
        );

        await technicianRepository.update(tech.id, {
          status: activeJobs.length > 0 ? 'On Job' : 'Available',
          assignedJobsCount: Math.max(0, tech.assignedJobsCount - 1),
          completedJobsCount: tech.completedJobsCount + 1,
          workload: Math.max(0, tech.workload - 30)
        });
      }
    }

    // Update Customer serviceCount and lastService
    const cust = await customerRepository.findById(job.customerId);
    if (cust && !isAlreadyCompleted) {
      await customerRepository.update(cust.id, {
        serviceCount: cust.serviceCount + 1,
        lastService: new Date().toISOString().split('T')[0]
      });
    }

    // Invoice generation / payment record logic
    const paymentStatus = completeData.paymentStatus || 'Pending';
    const paymentMethod = completeData.paymentMethod || 'UPI';

    // Check if payment already exists for this jobId (deduplication)
    let payment = await paymentRepository.findByJobId(id);
    if (payment) {
      await paymentRepository.update(payment.id, {
        amount: totalAmount,
        status: paymentStatus,
        paymentMethod
      });
    } else {
      payment = await paymentRepository.create({
        jobId: id,
        customerName: job.customerName,
        amount: totalAmount,
        paymentMethod,
        status: paymentStatus
      });
    }

    // Synchronize status to Paid if payment is marked Paid
    if (paymentStatus === 'Paid') {
      await jobRepository.update(id, {
        paymentStatus: 'Paid',
        paymentMethod
      });
    }

    await notificationRepository.create({
      title: 'Job Completed',
      message: `Job ${job.id} marked COMPLETED. Pending payment generated.`
    });

    return updatedJob;
  },

  payment: async (id, paymentData) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    const method = paymentData.paymentMethod || paymentData.method || 'UPI';
    const amount = Number(paymentData.amount || 0);

    // Update job payment states
    const updatedTimeline = [
      ...job.timeline,
      {
        status: 'Paid',
        time: new Date().toISOString(),
        note: `Payment of ₹${amount} collected via ${method}.`
      }
    ];

    const updatedJob = await jobRepository.update(id, {
      paymentStatus: 'Paid',
      paymentMethod: method,
      status: job.status === 'Completed' ? 'Completed' : job.status, // keep completed status
      timeline: updatedTimeline
    });

    // Update payment record
    const payment = await paymentRepository.findByJobId(id);
    if (payment) {
      await paymentRepository.update(payment.id, {
        status: 'Paid',
        paymentMethod: method
      });
    } else {
      await paymentRepository.create({
        jobId: id,
        customerName: job.customerName,
        amount: amount,
        paymentMethod: method,
        status: 'Paid'
      });
    }

    // Notification
    await notificationRepository.create({
      title: 'Payment Received',
      message: `Payment of ₹${amount} received for ${job.id} from ${job.customerName}.`
    });

    return updatedJob;
  },

  assign: async (id, technicianId) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    const tech = await technicianRepository.findById(technicianId);
    if (!tech) {
      const err = new Error(`Technician with ID ${technicianId} not found`);
      err.status = 400;
      throw err;
    }

    // Unassign old tech workload if applicable
    if (job.technicianId) {
      const oldTech = await technicianRepository.findById(job.technicianId);
      if (oldTech) {
        await technicianRepository.update(oldTech.id, {
          assignedJobsCount: Math.max(0, oldTech.assignedJobsCount - 1),
          workload: Math.max(0, oldTech.workload - 30)
        });
      }
    }

    // Update tech workload
    await technicianRepository.update(tech.id, {
      status: 'On Job',
      assignedJobsCount: tech.assignedJobsCount + 1,
      workload: Math.min(100, tech.workload + 30)
    });

    const updatedTimeline = [
      ...job.timeline,
      {
        status: 'Assigned',
        time: new Date().toISOString(),
        note: `Technician ${tech.name} Assigned`
      }
    ];

    const updatedJob = await jobRepository.update(id, {
      technicianId,
      technicianName: tech.name,
      status: job.status === 'Pending' ? 'Assigned' : job.status,
      timeline: updatedTimeline
    });

    await notificationRepository.create({
      title: 'Job Assigned',
      message: `Job ${job.id} assigned to technician ${tech.name}.`
    });

    return updatedJob;
  },

  addPart: async (id, partData) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    const partId = partData.id || partData.partId;
    const part = await inventoryRepository.findById(partId);
    if (!part) {
      const err = new Error(`Part with ID ${partId} not found`);
      err.status = 400;
      throw err;
    }

    const qty = Number(partData.quantity || 1);
    if (part.stock < qty) {
      const err = new Error(`Insufficient stock for ${part.partName}. Only ${part.stock} left.`);
      err.status = 400;
      throw err;
    }

    // Deduct stock
    await inventoryRepository.update(partId, { stock: part.stock - qty });

    // Update job partsUsed
    const partsUsed = [...job.partsUsed];
    const existingIdx = partsUsed.findIndex(p => p.partId === partId);
    if (existingIdx > -1) {
      partsUsed[existingIdx].quantity += qty;
    } else {
      partsUsed.push({
        partId: part.id,
        partName: part.partName,
        quantity: qty,
        price: part.price
      });
    }

    const partsCost = job.partsCost + (part.price * qty);
    const totalAmount = job.serviceCharge + partsCost;

    const updatedTimeline = [
      ...job.timeline,
      {
        status: job.status,
        time: new Date().toISOString(),
        note: `Added part ${part.partName} (Qty: ${qty})`
      }
    ];

    const updatedJob = await jobRepository.update(id, {
      partsUsed,
      partsCost,
      totalAmount,
      timeline: updatedTimeline
    });

    return updatedJob;
  },

  uploadPhotos: async (id, beforePhoto, afterPhoto) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }

    const updates = {};
    const notes = [];

    if (beforePhoto) {
      updates.beforePhoto = beforePhoto;
      notes.push('Uploaded before service photo');
    }
    if (afterPhoto) {
      updates.afterPhoto = afterPhoto;
      notes.push('Uploaded after service photo');
    }

    const updatedTimeline = [...job.timeline];
    for (const note of notes) {
      updatedTimeline.push({
        status: job.status,
        time: new Date().toISOString(),
        note
      });
    }

    updates.timeline = updatedTimeline;

    return await jobRepository.update(id, updates);
  },

  delete: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      const err = new Error(`Job with ID ${id} not found`);
      err.status = 404;
      throw err;
    }
    await jobRepository.delete(id);
    return { success: true, message: `Job ${id} deleted` };
  }
};

module.exports = jobService;
