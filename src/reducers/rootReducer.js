import { combineReducers } from 'redux';
import auth from './auth';
import comments from './comments';
import commentErrors from './commentErrors';


const appReducer = combineReducers({
  auth,
  commentErrors,
  comments
});

export default appReducer;
