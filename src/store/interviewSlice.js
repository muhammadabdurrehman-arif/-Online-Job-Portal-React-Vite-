import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCategory: 'Frontend Developer',
  selectedLevel: 'Beginner', // 'Beginner' | 'Intermediate' | 'Advanced'
  completedQuestions: {}, // structure: { [category_questionKey]: boolean }
  notes: {}, // structure: { [category_questionKey]: text }
  practiceHistory: [], // records of mock sessions
  activeMockSession: null // running mock session configuration
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    toggleQuestionCompleted: (state, action) => {
      const { category, questionKey } = action.payload;
      const key = `${category}_${questionKey}`;
      state.completedQuestions[key] = !state.completedQuestions[key];
    },
    saveNote: (state, action) => {
      const { category, questionKey, note } = action.payload;
      const key = `${category}_${questionKey}`;
      state.notes[key] = note;
    },
    startMockSession: (state, action) => {
      const { category, level, questions } = action.payload;
      state.activeMockSession = {
        category,
        level,
        questions,
        currentIdx: 0,
        timer: 180, // 3 minutes per interview question
        answers: {}, // { [questionIdx]: text }
        isCompleted: false
      };
    },
    tickMockTimer: (state) => {
      if (state.activeMockSession && state.activeMockSession.timer > 0) {
        state.activeMockSession.timer -= 1;
      }
    },
    saveMockAnswer: (state, action) => {
      const { questionIdx, answer } = action.payload;
      if (state.activeMockSession) {
        state.activeMockSession.answers[questionIdx] = answer;
      }
    },
    nextMockQuestion: (state) => {
      if (state.activeMockSession) {
        if (state.activeMockSession.currentIdx < state.activeMockSession.questions.length - 1) {
          state.activeMockSession.currentIdx += 1;
          state.activeMockSession.timer = 180; // Reset question timer
        } else {
          state.activeMockSession.isCompleted = true;
          state.practiceHistory.unshift({
            id: `session_${Date.now()}`,
            category: state.activeMockSession.category,
            level: state.activeMockSession.level,
            date: new Date().toISOString().split('T')[0],
            answers: state.activeMockSession.answers
          });
        }
      }
    },
    endMockSession: (state) => {
      state.activeMockSession = null;
    }
  }
});

export const {
  setCategory,
  setLevel,
  toggleQuestionCompleted,
  saveNote,
  startMockSession,
  tickMockTimer,
  saveMockAnswer,
  nextMockQuestion,
  endMockSession
} = interviewSlice.actions;

export default interviewSlice.reducer;
