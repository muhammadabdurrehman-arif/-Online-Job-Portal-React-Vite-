import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationService } from '../services/applicationService';

export const fetchApplications = createAsyncThunk('applications/fetchApplications', async () => {
  return await applicationService.list();
});

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async ({ jobId, seekerData, resumeData }, { rejectWithValue }) => {
    try {
      return await applicationService.apply(jobId, seekerData, resumeData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ appId, status, notes, dateTime }) => {
    return await applicationService.updateStatus(appId, status, notes, dateTime);
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      });
  }
});

export default applicationSlice.reducer;
