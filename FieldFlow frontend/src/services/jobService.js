import api from './api';
import { USE_API } from './config';
import { mockJobs } from '../data/mockData';

const STORAGE_KEY = 'ff_mock_jobs';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockJobs));
}

const getMockJobs = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const saveMockJobs = (jobs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));

export const jobService = {
  getJobs: async () => {
    if (USE_API) {
      const response = await api.get('/jobs');
      return response.data;
    } else {
      return Promise.resolve(getMockJobs());
    }
  },

  getJobById: async (id) => {
    if (USE_API) {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } else {
      const jobs = getMockJobs();
      const job = jobs.find(j => j.id === id);
      return Promise.resolve(job || null);
    }
  },

  createJob: async (jobData, selectedCustomer, selectedTech) => {
    if (USE_API) {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } else {
      const jobs = getMockJobs();
      const newJob = {
        id: `F-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: jobData.customerId,
        customerName: selectedCustomer ? selectedCustomer.name : 'Unknown',
        customerPhone: selectedCustomer ? selectedCustomer.phone : 'N/A',
        serviceType: jobData.serviceType,
        problemDescription: jobData.problemDescription,
        priority: jobData.priority,
        address: jobData.address || (selectedCustomer ? selectedCustomer.address : ''),
        scheduledDate: jobData.scheduledDate,
        scheduledTime: jobData.scheduledTime,
        technicianId: jobData.technicianId || null,
        technicianName: selectedTech ? selectedTech.name : 'Unassigned',
        status: jobData.technicianId ? 'Assigned' : 'Pending',
        notes: jobData.notes || '',
        partsUsed: [],
        serviceCharge: 0,
        partsCost: 0,
        totalAmount: 0,
        paymentStatus: 'Pending',
        paymentMethod: 'UPI',
        beforePhoto: null,
        afterPhoto: null,
        timeline: [
          { status: 'Pending', time: new Date().toISOString(), note: 'Customer request registered' }
        ]
      };

      if (jobData.technicianId && selectedTech) {
        newJob.timeline.push({
          status: 'Assigned',
          time: new Date().toISOString(),
          note: `Job assigned to ${selectedTech.name}`
        });
      }

      jobs.unshift(newJob);
      saveMockJobs(jobs);
      return Promise.resolve(newJob);
    }
  },

  updateJobStatus: async (jobId, newStatus, noteText = '', technicianName = '') => {
    if (USE_API) {
      const response = await api.patch(`/jobs/${jobId}/status`, { status: newStatus, noteText });
      return response.data;
    } else {
      const jobs = getMockJobs();
      let updatedJob = null;
      const updated = jobs.map(job => {
        if (job.id === jobId) {
          const tName = technicianName || job.technicianName || 'Technician';
          const defaultNotes = {
            'Assigned': `Job assigned to ${tName}`,
            'On The Way': `${tName} is travelling to customer location.`,
            'Arrived': `${tName} arrived at customer location.`,
            'In Progress': `Service work started.`,
            'Completed': `Service work completed by ${tName}.`,
            'Paid': `Payment of ₹${job.totalAmount} marked as completed.`
          };

          const timelineEntry = {
            status: newStatus,
            time: new Date().toISOString(),
            note: noteText || defaultNotes[newStatus] || `Status updated to ${newStatus}`
          };

          const updatedTimeline = [...job.timeline, timelineEntry];

          updatedJob = {
            ...job,
            status: newStatus,
            timeline: updatedTimeline,
            paymentStatus: newStatus === 'Paid' ? 'Paid' : job.paymentStatus
          };
          return updatedJob;
        }
        return job;
      });

      saveMockJobs(updated);
      return Promise.resolve(updatedJob);
    }
  },

  completeJobDetails: async (jobId, completionData) => {
    if (USE_API) {
      const response = await api.post(`/jobs/${jobId}/complete`, completionData);
      return response.data;
    } else {
      const jobs = getMockJobs();
      let updatedJob = null;
      
      const updated = jobs.map(job => {
        if (job.id === jobId) {
          const partsCost = completionData.partsUsed.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
          const total = Number(completionData.serviceCharge) + partsCost;

          const timelineEntry = {
            status: 'Completed',
            time: new Date().toISOString(),
            note: completionData.notes || 'Service details added. Job completed.'
          };

          updatedJob = {
            ...job,
            status: 'Completed',
            notes: completionData.notes || job.notes,
            partsUsed: completionData.partsUsed,
            serviceCharge: Number(completionData.serviceCharge),
            partsCost,
            totalAmount: total,
            paymentStatus: completionData.paymentStatus || 'Pending',
            paymentMethod: completionData.paymentMethod || 'UPI',
            beforePhoto: completionData.beforePhoto || job.beforePhoto,
            afterPhoto: completionData.afterPhoto || job.afterPhoto,
            timeline: [...job.timeline, timelineEntry]
          };
          return updatedJob;
        }
        return job;
      });

      saveMockJobs(updated);
      return Promise.resolve(updatedJob);
    }
  },

  collectPayment: async (jobId, method = 'UPI', amount = 0) => {
    if (USE_API) {
      const response = await api.post(`/jobs/${jobId}/payment`, { method, amount });
      return response.data;
    } else {
      const jobs = getMockJobs();
      let updatedJob = null;
      const updated = jobs.map(job => {
        if (job.id === jobId) {
          const timelineEntry = {
            status: job.status,
            time: new Date().toISOString(),
            note: `Payment of ₹${amount || job.totalAmount} collected via ${method}.`
          };
          updatedJob = {
            ...job,
            paymentStatus: 'Paid',
            paymentMethod: method,
            timeline: [...job.timeline, timelineEntry]
          };
          return updatedJob;
        }
        return job;
      });

      saveMockJobs(updated);
      return Promise.resolve(updatedJob);
    }
  }
};
