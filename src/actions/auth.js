import axios from 'axios';
import { toast } from 'react-toastify';
import {
  SIGNIN_FAILURE,
  SIGNIN_SUCCESS,
  GET_PROFILE_ERROR,
  SET_CURRENT_USER,
  IS_LOADING,
  SET_PROFILE,
  LOGOUT_USER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  ACTIVATE_SUCCESS,
  ACTIVATE_FAILURE
} from './types';
import { fetchArticles } from './articles';

axios.defaults.baseURL = 'https://kingsmen-ah-backend-staging.herokuapp.com/api/v1';

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const isLoading = value => ({
  type: IS_LOADING,
  payload: value
});

export const setUserProfile = payload => ({
  type: SET_PROFILE,
  payload
});

export const getProfile = username => async dispatch => {
  try {
    const res = await axios.get(`/profiles/${username}`);
    dispatch(setUserProfile(res.data.payload));
  } catch (error) {
    if (error.response) {
      return dispatch({
        type: GET_PROFILE_ERROR,
        payload: error.response.data.errors
      });
    }
    toast.error('Please check your network connection and try again');
  }
};

export const logoutUser = history => dispatch => {
  dispatch(isLoading(true));
  axios.post('/auth/logout');
  localStorage.removeItem('jwtToken');
  dispatch({ type: LOGOUT_USER });
  history.push('/');
  setAuthToken();
  dispatch(fetchArticles());
};

export const loginUser = userData => async dispatch => {
  try {
    dispatch(isLoading(true));

    const res = await axios.post('/auth/login', userData);
    const response = res.data.payload;

    const { token } = response;
    localStorage.setItem('jwtToken', token);

    const { id, email, username, exp } = response;
    const user = {
      id,
      email,
      username,
      exp
    };

    setAuthToken(token);
    dispatch(setCurrentUser(user));
    toast.success('Login successful');
    dispatch(getProfile(username));
    dispatch({ type: SIGNIN_SUCCESS });
    dispatch(fetchArticles());
  } catch (error) {
    if (error.response) {
      const errors = error.response.data.errors;
      if (errors.global) toast.error(errors.global);
      return dispatch({
        type: SIGNIN_FAILURE,
        payload: errors
      });
    }
    dispatch(isLoading(false));
    toast.error('Please check your network connection and try again');
  }
};

export const register = userData => dispatch => {
  axios
    .post('/users', userData)
    .then(response => {
      if (response.status === 201) {
        localStorage.setItem('token', response.data.payload.token);
        setAuthToken(response.data.payload.token);
        dispatch({ type: REGISTER_SUCCESS, payload: response.data });
        toast.success('Registration successful');
        dispatch(fetchArticles());
        dispatch(getProfile(response.data.payload.username));
        return response;
      }
    })
    .catch(err => {
      dispatch({ type: REGISTER_FAILURE, payload: err.response.data });
      if (err) {
        const { errors } = err.response.data;
        const { username, email } = errors;
        if (username) {
          toast.error(username);
        }
        if (email) {
          toast.error(email);
        }
      }
    });
};

export const userActivated = (userParams, history) => async dispatch => {
  try {
    const { email, token } = userParams;
    const res = await axios.post(
      `/auth/activate_user?email=${email}&token=${token}`
    );

    const response = res.data;
    if (res.status === 200) {
      dispatch({ type: ACTIVATE_SUCCESS, payload: response });
      toast.success('Account verified!');
      history.push('/');
      return response;
    }
  } catch (err) {
    if (err) {
      toast.error('Your verification token is expired!');
      dispatch({ type: ACTIVATE_FAILURE, payload: err.response.data.errors });
      history.push('/');
    }
  }
};
