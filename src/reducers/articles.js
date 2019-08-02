import {
  IS_LOADING,
  ADD_ARTICLE_SUCCESS,
  ADD_ARTICLE_FAILURE,
  EDIT_ARTICLE_SUCCESS,
  EDIT_ARTICLE_FAILURE,
  GET_ARTICLES_SUCCESS,
  GET_ARTICLES_FAILURE,
  GET_ARTICLE_FAILURE,
  GET_ARTICLE_SUCCESS,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILURE,
  USER_ARTICLE_SUCCESS,
  USER_ARTICLE_FAILURE,
  CLEAR_SINGLE_ARTICLE,
  IS_LOADING_MORE,
  GET_MORE_ARTICLES_SUCCESS,
  GET_MORE_ARTICLES_FAILURE,
  SET_NEXT_PAGE,
  UPDATE_ARTICLE_RATING
} from '@actions/types';

const initialState = {
  loading: false,
  errors: {},
  tags: [],
  articles: [],
  userArticles: [],
  article: {},
  ratings: 0,
  loadingMore: false,
  nextPage: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        loading: true
      };
    case UPDATE_ARTICLE_RATING:
      return {
        ...state,
        ratings: action.payload
      };
    case GET_ARTICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        articles: action.payload,
        errors: {}
      };
    case ADD_ARTICLE_SUCCESS:
    case EDIT_ARTICLE_SUCCESS:
    case GET_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        article: action.payload,
        errors: {}
      };
    case USER_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        userArticles: action.payload
      }
    case CLEAR_SINGLE_ARTICLE:
      return {
        ...state,
        article: {}
      };
    case ADD_ARTICLE_FAILURE:
    case GET_ARTICLES_FAILURE:
    case GET_ARTICLE_FAILURE:
    case EDIT_ARTICLE_FAILURE:
    case USER_ARTICLE_FAILURE:
    case GET_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case GET_TAGS_SUCCESS:
      return {
        ...state,
        tags: action.payload,
        loading: false,
        errors: {}
      };
    case IS_LOADING_MORE:
      return {
        ...state,
        loadingMore: true,
        errors: {}
      };
    case GET_MORE_ARTICLES_SUCCESS:
      return {
        ...state,
        loadingMore: false,
        articles: state.articles.concat(action.payload),
        errors: {}
      };
    case GET_MORE_ARTICLES_FAILURE:
      return {
        ...state,
        loadingMore: false,
        errors: action.payload
      };
    case SET_NEXT_PAGE:
      return {
        ...state,
        nextPage: action.payload
      };
    default:
      return state;
  }
};
