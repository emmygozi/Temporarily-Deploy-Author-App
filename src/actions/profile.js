/* eslint-disable no-console */
import axios from 'axios';
import { UPDATE_PROFILE, FETCH_PROFILE } from './types';

export const getUserProfile = (username) => dispatch => {
  axios.get(`profiles/${username}`)
  .then((res) => dispatch({
    type: FETCH_PROFILE,
    payload: res.data.payload
  }))
}

export const updateProfile = updateData => async dispatch => {
  axios.put('/users', updateData)
  .then((res) => dispatch({
    type: UPDATE_PROFILE,
    payload: res.data.payload
  }))
}
