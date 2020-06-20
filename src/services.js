import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { differenceBy, uniqueId } from 'lodash';
import parse from './parse';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const makeProxyBasedURL = (url) => `${PROXY_URL}${url}`;

export const validateURL = (url, feeds) =>
  yup
    .string()
    .url(i18next.t('url'))
    .required(i18next.t('required'))
    .notOneOf(feeds, i18next.t('notOneOf'))
    .validate(url);

export const getFeedData = (state) => {
  const { url } = state.form.input;
  const urlWithProxy = makeProxyBasedURL(url);

  return axios
    .get(urlWithProxy)
    .then(({ data }) => parse(data))
    .then((parsedData) => {
      const id = uniqueId();
      const { title, description, link, items } = parsedData;

      const channel = { id, title, description, link, url };
      state.data.feeds = [channel, ...state.data.feeds];

      const news = items.map((item) => ({ id, ...item }));
      state.data.news = [...news, ...state.data.news];
    });
};

export const updateFeedData = (state) => {
  const { feeds, news } = state.data;
  const feedsUrls = feeds.map(({ url }) => makeProxyBasedURL(url));
  const promiseUrls = feedsUrls.map(axios.get);

  return Promise.all(promiseUrls)
    .then((response) => response.map(({ data }) => parse(data)))
    .then((parsedData) => {
      const updatedFeeds = parsedData.map((item) => item);

      const newFeeds = differenceBy(updatedFeeds, feeds, 'link');
      state.data.feeds = [...newFeeds, ...feeds];

      const updatedItems = parsedData.flatMap(({ items, link }) => {
        const currentFeed = feeds.filter((feed) => feed.link === link);
        const { id } = currentFeed[0];
        return items.map((item) => ({ id, ...item }));
      });

      const newItems = differenceBy(updatedItems, news, 'link');
      state.data.news = [...newItems, ...news];
    })
    .finally(() => {
      setTimeout(() => updateFeedData(state), 30000);
    });
};
