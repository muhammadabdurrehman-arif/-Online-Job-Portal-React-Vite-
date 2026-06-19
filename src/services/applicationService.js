import { mockApi } from '../utils/mockDb';

const USE_MOCK = true;

export const applicationService = {
  list: async () => {
    if (USE_MOCK) {
      return await mockApi.applications.list();
    } else {
      const res = await fetch('/api/applications');
      return await res.json();
    }
  },

  apply: async (jobId, seekerData, resumeData = null) => {
    if (USE_MOCK) {
      return await mockApi.applications.apply(jobId, seekerData, resumeData);
    } else {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, seekerId: seekerData.id, resumeData })
      });
      return await res.json();
    }
  },

  updateStatus: async (appId, status, notes = '', dateTime = '') => {
    if (USE_MOCK) {
      return await mockApi.applications.updateStatus(appId, status, notes, dateTime);
    } else {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, dateTime })
      });
      return await res.json();
    }
  }
};
