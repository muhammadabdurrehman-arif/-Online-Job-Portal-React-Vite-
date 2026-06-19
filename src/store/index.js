import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './jobSlice';
import applicationReducer from './applicationSlice';
import resumeReducer from './resumeSlice';
import quizReducer from './quizSlice';
import interviewReducer from './interviewSlice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    applications: applicationReducer,
    resume: resumeReducer,
    quiz: quizReducer,
    interview: interviewReducer
  }
});
export default store;
