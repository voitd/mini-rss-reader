import i18next from 'i18next';
import listen from './listeners';
import watchState from './watchers';

import resources from './locales';

i18next.init({
  lng: 'en',
  resources,
});

const app = () => {
  const state = {
    form: {
      processState: 'finished',
      input: {
        url: '',
      },
      errors: {
        message: '',
        type: '',
        style: '',
      },
    },
    data: {
      feeds: [],
      news: [],
      activeFeedID: null,
    },
  };

  const DOMElements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input'),
    btn: document.querySelector('.btn'),
    channelsList: document.querySelector('.rss-channel'),
    itemsList: document.querySelector('.rss-items'),
    alert: document.querySelector('.feedback'),
  };

  listen(state, DOMElements);

  watchState(state, DOMElements);
};

export default app;
