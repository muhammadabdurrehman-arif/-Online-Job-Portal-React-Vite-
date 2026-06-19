import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '../services/jobService';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  return await jobService.list();
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData) => {
  return await jobService.create(jobData);
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, data }) => {
  return await jobService.update(id, data);
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id) => {
  await jobService.delete(id);
  return id;
});

const initialState = {
  items: [],
  filters: {
    search: '',
    location: '',
    type: '',
    experience: '',
    skills: ''
  },
  selectedJob: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Job
      .addCase(addJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex(j => j.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedJob?.id === action.payload.id) {
          state.selectedJob = action.payload;
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter(j => j.id !== action.payload);
        if (state.selectedJob?.id === action.payload) {
          state.selectedJob = null;
        }
      });
  }
});

export const { setFilters, resetFilters, setSelectedJob } = jobSlice.actions;

// Select filtered jobs helper
export const selectFilteredJobs = (state) => {
  const { items, filters } = state.jobs;
  return items.filter(job => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(filters.search.toLowerCase());
      
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
      
    const matchesType = !filters.type || 
      job.type.toLowerCase() === filters.type.toLowerCase();
      
    const matchesExperience = !filters.experience || 
      job.experience.toLowerCase().includes(filters.experience.toLowerCase());
      
    const matchesSkills = !filters.skills || 
      job.skills.some(s => s.toLowerCase().includes(filters.skills.toLowerCase()));
      
    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesSkills;
  });
};

export default jobSlice.reducer;
