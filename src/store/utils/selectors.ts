import _ from 'lodash';
import StoreState from './StoreTypes';

export const getUserTokensToken = (state: StoreState) => ({
  accessToken: _.get(state, 'user.userStatus.accessToken', ''),
  refreshToken: _.get(state, 'user.userStatus.refreshToken', '')
});
