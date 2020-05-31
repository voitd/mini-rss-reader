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

export const addNewFeed = (url, feeds) => {
  const proxyURL = makeProxyBasedURL(url);
  if (feeds.includes(proxyURL)) return;
  feeds.push(proxyURL);
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

export const updateFeedData = (state) => {
  const promiseUrls = state.data.urls.map(axios.get);

  return Promise.all(promiseUrls)
    .then((response) => response.map((elm) => parse(elm.data)))
    .then((data) => {
      const oldChannels = state.data.feeds;
      const updateChannels = data.map((item) => item.rss.channel);
      const newChannels = differenceBy(updateChannels, oldChannels, 'link');
      state.data.feeds = [...newChannels, ...oldChannels];

      const oldItems = state.data.news;
      const updateItems = data.flatMap((item) => item.rss.channel.item);
      const newItems = differenceBy(updateItems, oldItems, 'link');
      state.data.news = [...newItems, ...oldItems];
    })
    .finally(() => {
      setTimeout(() => updateFeedData(state), 5000);
    });
};
