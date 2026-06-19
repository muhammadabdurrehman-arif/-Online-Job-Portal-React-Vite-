import { createSlice } from '@reduxjs/toolkit';

const initialResumeState = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    github: '',
    linkedin: ''
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  activeTemplate: 'Professional' // 'Professional' | 'Modern' | 'ATS-Friendly' | 'Executive'
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState: initialResumeState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateSummary: (state, action) => {
      state.summary = action.payload;
    },
    // Generic List Add
    addListItem: (state, action) => {
      const { section, item } = action.payload;
      state[section].push(item);
    },
    // Generic List Remove
    removeListItem: (state, action) => {
      const { section, index } = action.payload;
      state[section].splice(index, 1);
    },
    // Generic List Update
    updateListItem: (state, action) => {
      const { section, index, item } = action.payload;
      state[section][index] = { ...state[section][index], ...item };
    },
    // Reorder List (Drag & Drop replacement helper)
    reorderListItems: (state, action) => {
      const { section, fromIndex, toIndex } = action.payload;
      const [removed] = state[section].splice(fromIndex, 1);
      state[section].splice(toIndex, 0, removed);
    },
    // Set Active Layout Template
    setTemplate: (state, action) => {
      state.activeTemplate = action.payload;
    },
    // Load existing resume data
    loadResume: (state, action) => {
      return { ...state, ...action.payload };
    },
    // Reset to empty
    clearResume: () => {
      return initialResumeState;
    }
  }
});

export const {
  updatePersonalInfo,
  updateSummary,
  addListItem,
  removeListItem,
  updateListItem,
  reorderListItems,
  setTemplate,
  loadResume,
  clearResume
} = resumeSlice.actions;

export default resumeSlice.reducer;
