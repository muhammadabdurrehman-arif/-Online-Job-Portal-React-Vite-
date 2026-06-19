import { mockApi } from '../utils/mockDb';

const USE_MOCK = true;

export const jobService = {
  list: async () => {
    if (USE_MOCK) {
      return await mockApi.jobs.list();
    } else {
      const res = await fetch('/api/jobs');
      return await res.json();
    }
  },

  create: async (jobData) => {
    if (USE_MOCK) {
      return await mockApi.jobs.create(jobData);
    } else {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      return await res.json();
    }
  },

  update: async (jobId, updatedData) => {
    if (USE_MOCK) {
      return await mockApi.jobs.update(jobId, updatedData);
    } else {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      return await res.json();
    }
  },

  delete: async (jobId) => {
    if (USE_MOCK) {
      return await mockApi.jobs.delete(jobId);
    } else {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      return await res.json();
    }
  }
};
