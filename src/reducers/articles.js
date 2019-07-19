import { SET_ALL_ARTICLES, SET_LOADER } from '@actions/types';

const initialState = {
  articles: [],
  isLoading: false
};

const articlesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_ARTICLES:
      return {
        ...state,
        articles: action.payload,
        isLoading: false
      };
    case SET_LOADER:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default articlesReducer;
