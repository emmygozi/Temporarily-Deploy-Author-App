import axios from 'axios';
import { toast } from 'react-toastify';
import {
  GET_COMMENTS, GET_COMMENTS_ERROR, POST_COMMENT, POST_COMMENT_ERROR, DELETE_COMMENT, DELETE_COMMENT_ERROR, LIKE_COMMENT, UNLIKE_COMMENT
} from './types';

// Get all comments
export const getComments = (slug) => (dispatch) => {
  axios.get(`/articles/${slug}/comments`)
    .then(res => dispatch({
      type: GET_COMMENTS,
      payload: res.data.payload
    }))
    .catch(err => dispatch({
      type: GET_COMMENTS_ERROR,
      payload: err.response.data
    }));
};

// Post a comment
export const postComment = (newComment, slug) => (dispatch) => {
  axios.post(`/articles/${slug}/comments`, newComment)
    .then(res => dispatch({
      type: POST_COMMENT,
      payload: res.data.payload
    }))
    .catch(err => {
      toast.error(err.response.data.errors.global);
      dispatch({
      type: POST_COMMENT_ERROR,
      payload: err.response.data
    })});
};

// Delete a comment
export const delComment = (id, slug) => (dispatch) => {
  axios.delete(`/articles/${slug}/comments/${id}`)
    .then(() => dispatch({
      type: DELETE_COMMENT,
      payload: id
    }))
    .catch(err => dispatch({
      type: DELETE_COMMENT_ERROR,
      payload: err.response.data
    }));
};

// Like a comment
export const likeComment = (id, slug) => (dispatch) => {
  axios.post(`/articles/${slug}/comments/${id}/like`)
    .then((res) => dispatch({
      type: LIKE_COMMENT,
      payload: res.data.payload
    }))
    .catch(err => { return err });
  getComments();
};

// Unlike a comment
export const unlikeComment = (id, slug) => (dispatch) => {
  axios.delete(`/articles/${slug}/comments/${id}/unlike`)
    .then((res) => dispatch({
      type: UNLIKE_COMMENT,
      payload: res.data.payload
    }))
    .catch(err => { return err });
  getComments();
};
