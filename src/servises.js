/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
// Mодель — это не только совокупность кода доступа к данным и СУБД,
// но и вся бизнес-логика;
// также, модели могут инкапсулировать в себе другие модели

// import _ from 'lodash';
// import i18n from 'i18next';
// import resources from './locales';
import axios from 'axios';
import * as yup from 'yup';
import parse from './parse';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const makeProxyBasedURL = (url) => `${PROXY_URL}${url}`;

export const validateURL = (url, urls) => {
  const proxyURL = makeProxyBasedURL(url);
  const schema = yup.object().shape({
    isUrl: yup.string().url('Must enter URL in http://www.example.com format'),
    isExist: yup.mixed().notOneOf(urls, 'This feed already exist'),
  });
  try {
    schema.validateSync({ isUrl: url, isExist: proxyURL }, { abortEarly: false });
    urls.push(proxyURL);
    return {};
  } catch (e) {
    return e.message;
  }
};

export const getFeedData = (state) => {
  const promiseUrls = state.data.urls.map(axios.get);
  return Promise.all(promiseUrls)
    .then((response) => response.map((elm) => parse(elm.data)))
    .then((feed) => (state.data.feeds = feed.map((item) => item.rss.channel)))
    .catch((e) => (state.form.errors = e));
  // .finally(() => {
  //   setInterval(() => getFeeds(state), 5000);
  // });
};
