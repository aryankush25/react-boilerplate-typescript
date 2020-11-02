import actionTypes from '../actionTypes';

export const requestUserRequest = (username: string, password: string) => {
  return {
    type: actionTypes.USER_REQUEST,
    payload: { username, password }
  };
};

export const requestUserSuccess = (
  username: string,
  accessToken: string,
  refreshToken: string
) => {
  return {
    type: actionTypes.USER_SUCCESS,
    payload: {
      username,
      accessToken,
      refreshToken
    }
  };
};

export const requestUserFailure = () => {
  return { type: actionTypes.USER_FAILURE, payload: {} };
};

export const startLogout = () => {
  return {
    type: actionTypes.LOGOUT
  };
};
