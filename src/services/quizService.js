import { mockApi } from '../utils/mockDb';

const USE_MOCK = true;

export const quizService = {
  list: async () => {
    if (USE_MOCK) {
      return await mockApi.quizzes.list();
    } else {
      const res = await fetch('/api/quizzes');
      return await res.json();
    }
  },

  saveScore: async (seekerName, skill, score) => {
    if (USE_MOCK) {
      return await mockApi.quizzes.saveScore(seekerName, skill, score);
    } else {
      const res = await fetch('/api/quizzes/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: seekerName, skill, score })
      });
      return await res.json();
    }
  },

  getLeaderboard: async () => {
    if (USE_MOCK) {
      return await mockApi.quizzes.getLeaderboard();
    } else {
      const res = await fetch('/api/quizzes/leaderboard');
      return await res.json();
    }
  }
};
