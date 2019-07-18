import {
  GET_COMMENTS, POST_COMMENT, DELETE_COMMENT
} from '../actions/types';

const initialState = {
  comments: [],
  comment: {},
  likes: null
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
        comments: state.comments.filter(comment => comment.id !== action.payload)
      };

    default: return state;
  }
}
