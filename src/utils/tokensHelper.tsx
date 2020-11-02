import _ from 'lodash';
import { isNilOrEmpty } from './helper';

export const MY_WEB_APP_TOKENS = 'my-web-app-tokens'; // Change name according to your project
const TOKENS = ['username', 'accessToken', 'refreshToken'];

export interface LocalStorageTokensProps {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export const setLocalStorageTokens = (tokens: LocalStorageTokensProps) => {
  const currentTokens = getLocalStorageTokens();
  const newTokensValues = { ...currentTokens, ...tokens };
  const tokensToSet = {};

  TOKENS.forEach((token) => {
    tokensToSet[`${token}`] = newTokensValues[`${token}`];
  });

  localStorage.setItem(MY_WEB_APP_TOKENS, JSON.stringify(tokensToSet));
};

export const getLocalStorageTokens = () => {
  const currentTokensString = localStorage.getItem(MY_WEB_APP_TOKENS);
  const currentTokensObject = JSON.parse(`${currentTokensString}`);

  const returnTokens: LocalStorageTokensProps = {
    username: '',
    accessToken: '',
    refreshToken: ''
  };

  TOKENS.forEach((token) => {
    returnTokens[`${token}`] = _.get(currentTokensObject, [`${token}`], '');
  });

  return returnTokens;
};

export const isTokensPresentLocalStorage = () => {
  const currentTokens = getLocalStorageTokens();
  let isAllTokensPresent = true;

  TOKENS.forEach((tokenName) => {
    const tokenValue = currentTokens[`${tokenName}`];

    if (isNilOrEmpty(tokenValue)) {
      isAllTokensPresent = false;
    }
  });

  return isAllTokensPresent;
};

export const clearLocalStorage = () => {
  localStorage.removeItem(MY_WEB_APP_TOKENS);
};
