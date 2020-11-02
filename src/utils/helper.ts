import _ from 'lodash';
import humps from 'humps';

export const isNilOrEmpty = (value: any) =>
  _.isNil(value) || _.isEmpty(value) || _.isNull(value) || _.isNaN(value);

export const isPresent = (value: any) => !isNilOrEmpty(value);

export const getStringifyBody = (details: {}, decamelizeKeys: boolean) => {
  const decamelizeDetails = decamelizeKeys
    ? humps.decamelizeKeys(details)
    : details;

  const newFormBody = JSON.stringify(decamelizeDetails);

  return newFormBody;
};
