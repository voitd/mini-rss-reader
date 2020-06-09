/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { differenceBy, uniqueId } from 'lodash';
import parse from './parse';
import resources from './locales';

i18next.init({
  lng: 'en',
  resources,
});

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const makeProxyBasedURL = (url) => `${PROXY_URL}${url}`;

export const validateURL = (url, feeds) =>
  yup
    .string()
    .url(i18next.t('url'))
    .required(i18next.t('required'))
    .notOneOf(feeds, i18next.t('notOneOf'))
    .validate(url);

const preparedContent = (data, state, url) => {
  const id = uniqueId();

  const { title, description, link, items } = data;

  const channel = { id, title, description, link, url };
  state.data.feeds = [channel, ...state.data.feeds];

  const news = items.map((item) => ({ id, ...item }));
  state.data.news = [...news, ...state.data.news];
};

export const getFeedData = (state) => {
  const { url } = state.form.input;
  const urlWithProxy = makeProxyBasedURL(url);

  return axios
    .get(urlWithProxy)
    .then(({ data }) => parse(data))
    .then((parsedData) => preparedContent(parsedData, state, url));
};

export const updateFeedData = (state) => {
  const feedsUrls = state.data.feeds.map(({ url }) => makeProxyBasedURL(url));

  const promiseUrls = feedsUrls.map(axios.get);

  return Promise.all(promiseUrls)
    .then((response) => response.map(({ data }) => parse(data)))
    .then((parsedData) => {
      const oldChannels = state.data.feeds;
      const updateChannels = parsedData.map((item) => item);
      const newChannels = differenceBy(updateChannels, oldChannels, 'link');
      state.data.feeds = [...newChannels, ...oldChannels];

      const oldItems = state.data.news;
      const updatedItems = parsedData.flatMap(({ items, link }) => {
        const currentChannel = state.data.feeds.filter((feed) => feed.link === link);
        const { id } = currentChannel[0];
        return items.map((item) => ({ id, ...item }));
      });
      const newItems = differenceBy(updatedItems, oldItems, 'link');
      state.data.news = [...newItems, ...oldItems];
    })
    .finally(() => {
      setTimeout(() => updateFeedData(state), 30000);
    });
};
