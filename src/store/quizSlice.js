import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeQuiz: null, // { title, questions: [{q, options, correct}] }
  activeSkill: '', // e.g. 'React JS'
  currentQuestionIdx: 0,
  selectedAnswers: {}, // index mapping { [questionIndex]: selectedOptionIndex }
  score: 0,
  timeLeft: 60, // seconds
  isQuizActive: false,
  isFinished: false,
  leaderboard: []
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {
      const { quizData, skillName } = action.payload;
      state.activeQuiz = quizData;
      state.activeSkill = skillName;
      state.currentQuestionIdx = 0;
      state.selectedAnswers = {};
      state.score = 0;
      state.timeLeft = quizData.questions.length * 30; // 30 seconds per question
      state.isQuizActive = true;
      state.isFinished = false;
    },
    selectAnswer: (state, action) => {
      const { questionIdx, optionIdx } = action.payload;
      state.selectedAnswers[questionIdx] = optionIdx;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIdx < state.activeQuiz.questions.length - 1) {
        state.currentQuestionIdx += 1;
      } else {
        state.isQuizActive = false;
        state.isFinished = true;
        
        // Calculate Score
        let correctCount = 0;
        state.activeQuiz.questions.forEach((q, idx) => {
          if (state.selectedAnswers[idx] === q.correct) {
            correctCount++;
          }
        });
        state.score = Math.round((correctCount / state.activeQuiz.questions.length) * 100);
      }
    },
    tickTimer: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      } else {
        // Auto complete when timer hits 0
        state.isQuizActive = false;
        state.isFinished = true;
        let correctCount = 0;
        state.activeQuiz.questions.forEach((q, idx) => {
          if (state.selectedAnswers[idx] === q.correct) {
            correctCount++;
          }
        });
        state.score = Math.round((correctCount / state.activeQuiz.questions.length) * 100);
      }
    },
    resetQuiz: (state) => {
      return { ...initialState, leaderboard: state.leaderboard };
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    }
  }
});

export const { startQuiz, selectAnswer, nextQuestion, tickTimer, resetQuiz, setLeaderboard } = quizSlice.actions;

export default quizSlice.reducer;
