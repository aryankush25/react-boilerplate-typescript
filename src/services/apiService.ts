import httpStatus from 'http-status';
import fetch, { RequestInit, Response } from 'node-fetch';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { isNilOrEmpty } from '../utils/helper';
import ReduxStore from '../store';
import { startLogout } from '../store/actions/userActions';
import { getLocalStorageTokens } from '../utils/tokensHelper';

const getResponseBody = (contentType: string = '', response: Response) => {
  if (contentType.includes('text/plain')) {
    return response.text();
  }
  if (contentType.match('text/*')) {
    return response.text();
  }
  if (contentType.includes('application/json')) {
    return response.json();
  }
  if (contentType.includes('application/x-www-form-urlencoded;charset=UTF-8')) {
    return response;
  }
  if (contentType.match('application/*')) {
    return response.blob();
  }
  if (contentType.match('audio/*')) {
    return response.blob();
  }
  if (contentType.match('image/*')) {
    return response.blob();
  }
  if (contentType.match('video/*')) {
    return response.blob();
  }
  if (contentType.match('message/*')) {
    return response.blob();
  }
  if (contentType.match('Application/*')) {
    return response.blob();
  }
  if (contentType.match('x-world/*')) {
    return response.blob();
  }

  return response.text();
};

const handleSuccessResponse = async (
  contentType: string,
  response: Response
) => {
  let returnObj = {};

  if (response.status === httpStatus.NO_CONTENT) {
    return returnObj;
  }

  if (contentType.includes('application/octet-stream')) {
    const blobData = await getResponseBody(contentType, response);
    returnObj = { url: URL.createObjectURL(blobData) };
  } else {
    returnObj = await getResponseBody(contentType, response);
  }
  return returnObj;
};

const handleFailureResponse = async (
  contentType: string,
  response: Response
) => {
  let returnObj: Response = {};
  let errorDataFromServer = null;

  if (contentType.includes('application/octet-stream')) {
    const blobData = await getResponseBody(contentType, response);
    errorDataFromServer = { url: URL.createObjectURL(blobData) };
  } else {
    errorDataFromServer = await getResponseBody(contentType, response);
  }

  if (_.isNil(errorDataFromServer) || _.isNil(errorDataFromServer.error)) {
    returnObj.error = httpStatus[response.status];
  } else {
    returnObj = errorDataFromServer;
  }

  return returnObj;
};

const responseHandler = async (
  response: Response,
  resolve: { (value: unknown): void; (arg0: any): any },
  reject: { (reason?: any): void; (arg0: any): any }
) => {
  const metaData = {
    responseStatus: response.status
  };
  let returnObj: Response = {};

  try {
    let contentType = response.headers.get('content-type') || '';

    if (contentType) {
      contentType = contentType.toLowerCase();
    }

    if (response.ok) {
      returnObj = await handleSuccessResponse(contentType, response);
      returnObj = _.merge(returnObj, metaData);
      return resolve(returnObj);
    }

    returnObj = await handleFailureResponse(contentType, response);
    returnObj = _.merge(returnObj, metaData);

    return reject(returnObj);
  } catch (error) {
    returnObj.error = error.message ? error.message : true;
    returnObj = _.merge(returnObj, metaData);

    return reject(returnObj);
  }
};

function getBaseApiEndPoint() {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }

  return '';
}

async function handleNetworkCall(apiObject) {
  const fetchObject: RequestInit = {};
  let body = {};
  fetchObject.method = apiObject.method ? apiObject.method : 'GET';

  let isAuthenticationRequired = true;
  if (typeof apiObject.authenticationRequired === 'boolean') {
    isAuthenticationRequired = apiObject.authenticationRequired;
  }

  fetchObject.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  fetchObject.headers = apiObject.headers
    ? { ...fetchObject.headers, ...apiObject.headers }
    : { ...fetchObject.headers };
  if (apiObject.removeHeader) {
    delete fetchObject.headers['Content-Type'];
    delete fetchObject.headers.Accept;
  }
  body = apiObject.body;
  // body = apiObject.body ? JSON.stringify(apiObject.body) : {};

  if (fetchObject.method === 'GET') {
    fetchObject.body = undefined;
  } else {
    fetchObject.body = body;
  }

  if (isAuthenticationRequired) {
    if (isNilOrEmpty(fetchObject.headers.authorization)) {
      const { accessToken } = getLocalStorageTokens();
      fetchObject.headers.authorization = `BEARER ${accessToken}`;
    }
  }

  const url = `${getBaseApiEndPoint()}${apiObject.endPoint}`;

  return new Promise(async (resolve, reject) => {
    try {
      const fetchResult: Response = await fetch(url, fetchObject);

      return responseHandler(fetchResult, resolve, reject);
    } catch (err) {
      return reject({
        error: 'someThing Unexpected Happened',
        msg: err.message || 'Something Went Wrong'
      });
    }
  });
}

export function callApi(apiObject: {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await handleNetworkCall(apiObject);

      resolve(response);
    } catch (err) {
      if (err.responseStatus === httpStatus.INTERNAL_SERVER_ERROR) {
        toast.error(
          `An error has ocurred, please try again. If this error persists contact SKF administrator for more information.`
        );
      }

      if (err.responseStatus === httpStatus.UNAUTHORIZED) {
        toast.error('Login Token expired, please Login again.');
        ReduxStore.dispatch(startLogout());
        return resolve([]);
      }

      reject(err);
    }
  });
}

export function callApiParallel(apiObject: {}) {
  const responseObj = {
    showError: false,
    message: '',
    response: []
  };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await handleNetworkCall(apiObject);

      resolve({ ...responseObj, response });
    } catch (err) {
      if (err.responseStatus === httpStatus.UNAUTHORIZED) {
        ReduxStore.dispatch(startLogout());
      }

      resolve({ ...responseObj, showError: false });
    }
  });
}

export default callApi;
