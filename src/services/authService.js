import { mockApi } from '../utils/mockDb';

// Toggle to switch between Mock DB and Firebase/NodeJS REST API
const USE_MOCK = true; 

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      return await mockApi.auth.login(email, password);
    } else {
      // Future API Call example:
      // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      // return await res.json();
      throw new Error('REST API Mode is not configured yet');
    }
  },

  signup: async (name, email, password, role) => {
    if (USE_MOCK) {
      return await mockApi.auth.signup(name, email, password, role);
    } else {
      // Future API Call:
      // const res = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
      // return await res.json();
      throw new Error('REST API Mode is not configured yet');
    }
  },

  updateProfile: async (userId, updatedProfile) => {
    if (USE_MOCK) {
      return await mockApi.auth.updateProfile(userId, updatedProfile);
    } else {
      // Future API Call:
      // const res = await fetch(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify(updatedProfile) });
      // return await res.json();
      throw new Error('REST API Mode is not configured yet');
    }
  },

  updateCompanyProfile: async (userId, updatedCompany) => {
    if (USE_MOCK) {
      return await mockApi.auth.updateCompanyProfile(userId, updatedCompany);
    } else {
      // Future API Call:
      // const res = await fetch(`/api/users/${userId}/company`, { method: 'PUT', body: JSON.stringify(updatedCompany) });
      // return await res.json();
      throw new Error('REST API Mode is not configured yet');
    }
  },

  logout: async () => {
    // Session cleaning
    return true;
  }
};
