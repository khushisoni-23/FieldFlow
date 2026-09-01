const paymentRepository = require('../repositories/paymentRepository');
const jobRepository = require('../repositories/jobRepository');

const paymentService = {
  getAll: async () => {
    return await paymentRepository.getAll();
  },

  create: async (paymentData) => {
    // Dedup: remove any existing payment record for the same jobId before inserting
    const existing = await paymentRepository.findByJobId(paymentData.jobId);
    if (existing) {
      await paymentRepository.deleteByJobId(paymentData.jobId);
    }
    
    return await paymentRepository.create(paymentData);
  },

  updateStatus: async (jobId, status, method) => {
    // Find payment record by jobId
    let payment = await paymentRepository.findByJobId(jobId);
    if (!payment) {
      // If payment record not found, try to auto-create from job details
      const job = await jobRepository.findById(jobId);
      if (!job) {
        const err = new Error(`Job with ID ${jobId} not found`);
        err.status = 404;
        throw err;
      }
      payment = await paymentRepository.create({
        jobId,
        customerName: job.customerName,
        amount: job.totalAmount,
        paymentMethod: method || job.paymentMethod || 'UPI',
        status
      });
    } else {
      const updates = { status };
      if (method) updates.paymentMethod = method;
      payment = await paymentRepository.update(payment.id, updates);
    }

    // Sync status to job
    if (status === 'Paid') {
      await jobRepository.update(jobId, {
        paymentStatus: 'Paid',
        paymentMethod: method || payment.paymentMethod || 'UPI'
      });
    } else {
      await jobRepository.update(jobId, {
        paymentStatus: status
      });
    }

    return payment;
  }
};

module.exports = paymentService;
