import { GET_COMMENTS_ERROR, POST_COMMENT_ERROR, DELETE_COMMENT_ERROR } from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COMMENTS_ERROR:
      return action.payload;

    case POST_COMMENT_ERROR:
      return action.payload;

    case DELETE_COMMENT_ERROR:
      return action.payload;

    default: return state;
  }
}
