import { createStore } from '../../core/store.js';

const initialState = {
    screen: 'start',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    genreScores: {},
    highScore: 0,
    selectedAnswer: null,
    feedback: null,
    error: null
};

const store = createStore(initialState);

export const subscribe = store.subscribe;
export const getState = store.getState;
export const setState = store.setState;