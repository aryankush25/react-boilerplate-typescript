import { RouterState } from 'connected-react-router';

export interface UserDataTypes {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserDataReducerTypes {
  userData: UserDataTypes;
  loginSpinner: boolean;
}

export default interface StoreState {
  userData: UserDataReducerTypes;

  router: RouterState;
}
