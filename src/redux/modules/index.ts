import { combineReducers } from 'redux';

// 라우팅
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

// modules
import weather from './weather';
import time from './time';
import location from './location';

export const history = createBrowserHistory();

// root reducer
const rootReducer = combineReducers({
  weather,
  time,
  location,
  router: connectRouter(history),
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
