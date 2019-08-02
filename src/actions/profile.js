import axios from 'axios';
import { toast } from 'react-toastify';
import {
  PROFILE_LOADING,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  FETCH_USER_ARTICLES_SUCCESS,
  FETCH_USER_ARTICLES_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from './types';


export const isLoading = () => ({
  type: PROFILE_LOADING
});

export const fetchProfileSuccess = profile => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: profile
});

export const fetchProfileFailure = error => ({
  type: FETCH_PROFILE_FAILURE,
  payload: error
});

export const updateProfileSuccess = profile => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: profile
});

export const updateProfileFailure = error => ({
  type: UPDATE_PROFILE_FAILURE,
  payload: error
});

export const fetchUserArticlesSuccess = articles => ({
  type: FETCH_USER_ARTICLES_SUCCESS,
  payload: articles
});

export const fetchUserArticlesFailure = error => ({
  type: FETCH_USER_ARTICLES_FAILURE,
  payload: error
});

export const getProfile = (username) => async (dispatch) => {
  try {
    dispatch(isLoading());

    const response = await axios.get(`/profiles/${username}`);

    dispatch(fetchProfileSuccess(response.data.payload));
    dispatch(getUserArticles(response.data.payload.userId));
  } catch (error) {
    dispatch(fetchProfileFailure(error.response.data.errors.gloabal));
  }
}

export const getUserArticles = (userId) => async (dispatch) => {
  try {
    dispatch(isLoading());

    const response = await axios.get('/articles?page=1&limit=50');
    const result = response.data.payload.rows.filter(article => article.author.id === userId);

    dispatch(fetchUserArticlesSuccess(result));
  } catch (error) {
    dispatch(fetchUserArticlesFailure(error.response.data.errors.global));
  }
}

export const updateProfile = (values) => async (dispatch) => {
  try {
    dispatch(isLoading());

    const response = await axios.put('/users', values);
    dispatch(updateProfileSuccess(response.data.payload));
    toast.success('Profile Updated!');
  } catch (error) {
    dispatch(updateProfileFailure(error.response.data.errors));
  }
};