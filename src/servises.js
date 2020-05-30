/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { differenceBy } from 'lodash';
import parse from './parse';
import resources from './locales';

i18next.init({
  lng: 'en',
  resources,
});

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const makeProxyBasedURL = (url) => `${PROXY_URL}${url}`;

export const addURL = (url, urls) => {
  const proxyURL = makeProxyBasedURL(url);
  if (urls.includes(proxyURL)) return;
  urls.push(proxyURL);
};

export const validateURL = (url, urls) => {
  const proxyURL = makeProxyBasedURL(url);
  const schema = yup.object().shape({
    isUrl: yup.string().url(i18next.t('url')).required(i18next.t('required')),
    isExist: yup.mixed().notOneOf(urls, i18next.t('notOneOf')),
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
    .then((response) => response.map((elm) => parse(elm.data)))
    .then((data) => {
      const newItems = data.flatMap((item) => item.rss.channel.item);
      const diff = differenceBy(newItems, state.data.news, 'link');

      state.data.feeds = data.map((item) => item.rss.channel);
      state.data.news = [...state.data.news, ...diff];
    })
    .finally(() => {
      setInterval(() => getFeedData(state), 5000);
    });
};
