import {
  GET_COMMENTS, POST_COMMENT, DELETE_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT, LIKE_COMMENT_ERROR, UNLIKE_COMMENT_ERROR
} from '../actions/types';

const initialState = {
  comments: [],
  likedComment: {},
  unlikedComment: {},
  errors: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload.reverse(),
      };

    case POST_COMMENT:
      return {
        ...state,
        comments: action.payload.reverse()
      };

    case DELETE_COMMENT:
      return {
        ...state,
        comments: action.payload.reverse()
      };

    case LIKE_COMMENT:
      return {
        ...state,
        likedComment: action.payload
      };

    case LIKE_COMMENT_ERROR:
      return {
        ...state,
        errors: action.payload
      };

    case UNLIKE_COMMENT:
      return {
        ...state,
        unlikedComment: action.payload
      };

    case UNLIKE_COMMENT_ERROR:
      return {
        ...state,
        errors: action.payload
      };

    default: return state;
  }
}
