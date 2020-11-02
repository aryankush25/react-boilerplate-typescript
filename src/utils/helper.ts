import _ from 'lodash';
import humps from 'humps';

export const isNilOrEmpty = (value: any) =>
  _.isNil(value) || _.isEmpty(value) || _.isNull(value) || _.isNaN(value);

export const isPresent = (value: any) => !isNilOrEmpty(value);

export const getEncodedBody = (details: {}) => {
  const decamelizeDetails = humps.decamelizeKeys(details);

  var formBody = [];

  for (var property in decamelizeDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(decamelizeDetails[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }

  const newFormBody = formBody.join('&');

  return newFormBody;
};

export const getStringifyBody = (details: {}, decamelizeKeys: boolean) => {
  const decamelizeDetails = decamelizeKeys
    ? humps.decamelizeKeys(details)
    : details;

  const newFormBody = JSON.stringify(decamelizeDetails);

  return newFormBody;
};
