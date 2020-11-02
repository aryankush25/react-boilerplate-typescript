// This file is just an example how to make an API call

import * as ApiService from './apiService';

export function authenticateUser(payload) {
  const formData = Object.keys(payload)
    .map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`;
    })
    .join('&');

  const APIObj = {
    endPoint: '/token',
    authenticationRequired: false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  };

  return ApiService.callApi(APIObj);
}

export const fetchData1 = () => {
  const APIObj = {
    endPoint: '/endPoint/1',
    authenticationRequired: true,
    method: 'GET'
  };

  return ApiService.callApi(APIObj);
};

export const fetchData2 = () => {
  const APIObj = {
    endPoint: '/endPoint/2',
    authenticationRequired: true,
    method: 'GET'
  };

  return ApiService.callApi(APIObj);
};
