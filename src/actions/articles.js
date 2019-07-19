import axios from 'axios';
import { toast } from 'react-toastify';
import { SET_ALL_ARTICLES, SET_LOADER } from './types';

const setAllArticles = payload => ({
  type: SET_ALL_ARTICLES,
  payload
});

const setLoader = value => ({
  type: SET_LOADER,
  payload: value
});

const fetchArticles = () => async dispatch => {
  try {
    dispatch(setLoader(true));
    const res = await axios.get(`/articles`);
    dispatch(setAllArticles(res.data.payload.rows));
  } catch (error) {
    dispatch(setLoader(false));
    toast.error('Please check your network connection and try again');
  }
};

export default fetchArticles;
