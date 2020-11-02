import _ from 'lodash';
import StoreState from './StoreTypes';

export const getUserTokens = (state: StoreState) => ({
  username: _.get(state, 'userData.userData.username', ''),
  accessToken: _.get(state, 'userData.userData.accessToken', ''),
  refreshToken: _.get(state, 'userData.userData.refreshToken', '')
});
