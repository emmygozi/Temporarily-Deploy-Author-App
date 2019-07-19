import { combineReducers } from 'redux';
import auth from './auth';
import comments from './comments';
import commentErrors from './commentErrors';
import article from './articles';


const appReducer = combineReducers({
  auth,
  commentErrors,
  article,
  comments
});

export default appReducer;
