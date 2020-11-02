import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import reducers from './reducers';
import rootSaga from './saga';
import history from '../utils/history';
import StoreState from './utils/StoreTypes';
import { MY_WEB_APP_TOKENS } from '../utils/tokensHelper';

const persistConfig = {
  key: MY_WEB_APP_TOKENS + '-redux',
  storage,
  whitelist: ['']
};

const persistedReducer = persistReducer<StoreState>(persistConfig, reducers);
const middlewares: any[] = [];

if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}

const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

const routerHistoryMiddleware = routerMiddleware(history);
middlewares.push(routerHistoryMiddleware);

const enhancer = applyMiddleware(...middlewares);

const finalCreateStore = compose(enhancer)(createStore);

let store = finalCreateStore(persistedReducer);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default store;
