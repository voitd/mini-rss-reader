/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
// Mодель — это не только совокупность кода доступа к данным и СУБД,
// но и вся бизнес-логика;
// также, модели могут инкапсулировать в себе другие модели
import axios from 'axios';
import * as yup from 'yup';
import parse from './parse';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const makeProxyBasedURL = (url) => `${PROXY_URL}${url}`;

export const addURL = (url, urls) => {
  const proxyURL = makeProxyBasedURL(url);
  if (urls.includes(url)) return;
  urls.push(proxyURL);
};

export const validateURL = (url, urls) => {
  const proxyURL = makeProxyBasedURL(url);
  const schema = yup.object().shape({
    isUrl: yup.string().url('Must enter URL in http://www.example.com format'),
    isExist: yup.mixed().notOneOf(urls, 'This feed already exist'),
  });
  try {
    schema.validateSync({ isUrl: url, isExist: proxyURL }, { abortEarly: false });
    return {};
  } catch (e) {
    return e.message;
  }
};

export const getFeedData = (state) => {
  const promiseUrls = state.data.urls.map(axios.get);
  return Promise.all(promiseUrls)
    .then((response) => response.map((elm) => parse(elm.data)));
  // .catch((e) => {
  //   state.form.errors.message = e;
  //   state.form.errors.type = 'danger';
  // });
  // .finally(() => {
  //   setInterval(() => getFeeds(state), 5000);
  // });
};
