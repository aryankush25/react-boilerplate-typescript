import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../../utils/history';

import userData from './userData';

const allReducers = combineReducers({
  userData,

  router: connectRouter(history)
});

export default allReducers;
