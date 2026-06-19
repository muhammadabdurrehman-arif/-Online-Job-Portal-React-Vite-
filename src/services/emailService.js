import { mockApi } from '../utils/mockDb';

const USE_MOCK = true;

export const emailService = {
  getTemplates: async () => {
    if (USE_MOCK) {
      return await mockApi.emails.getTemplates();
    } else {
      const res = await fetch('/api/emails/templates');
      return await res.json();
    }
  },

  listSent: async () => {
    if (USE_MOCK) {
      return await mockApi.emails.listSent();
    } else {
      const res = await fetch('/api/emails/sent');
      return await res.json();
    }
  },

  sendSimulated: async (templateType, vars) => {
    if (USE_MOCK) {
      return await mockApi.emails.send(templateType, vars);
    } else {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType, vars })
      });
      return await res.json();
    }
  }
};
