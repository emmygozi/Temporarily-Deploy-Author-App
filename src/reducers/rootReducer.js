import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import auth from './auth';
import comments from './comments';
import commentErrors from './commentErrors';
import article from './articles';
import profile from './profile';

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['errors', 'loading']
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  profile,
  commentErrors,
  article,
  comments
});

export default appReducer;
