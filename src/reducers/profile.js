import {
  PROFILE_LOADING,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  FETCH_USER_ARTICLES_SUCCESS,
  FETCH_USER_ARTICLES_FAILURE,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from '../actions/types';

const initialState = {
  profile: {},
  articles: [],
  loading: false,
  errors: {}
};

export default (state = initialState, action) => {
  const removeArticle = (payload) => state.articles.filter(article => article.id !== payload.id);
  switch(action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        articles: removeArticle(action.payload)
      }
    case FETCH_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        errors: action.payload,
        loading: false
      }
    case FETCH_USER_ARTICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        articles: action.payload
      };
    case FETCH_USER_ARTICLES_FAILURE:
    case DELETE_ARTICLE_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload
      }
    default:
      return state;
  }
};
