/* eslint-disable no-param-reassign */

import { getFeedData, updateFeedData, validateURL } from './services';

const listen = (channels, form, input, state) => {
  const updateProcessState = (process, message = '') => {
    const alertType = {
      sending: () => {
        state.form.errors.type = 'warning';
        state.form.errors.style = 'warning';
      },
      finished: () => {
        state.form.errors.type = 'success';
        state.form.errors.style = 'success';
      },
      error: () => {
        state.form.errors.type = message;
        state.form.errors.style = 'danger';
      },
    };
    state.form.processState = process;
    alertType[process]();
  };

  input.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    const feeds = state.data.feeds.map(({ url }) => url);

    validateURL(value, feeds)
      .then(() => {
        state.form.input[name] = value;
        state.form.processState = 'valid';
      })
      .catch((err) => {
        updateProcessState('error', err.message);
      });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    updateProcessState('sending');

    getFeedData(state)
      .then(() => {
        updateProcessState('finished');
        updateFeedData(state);
      })
      .catch((err) => {
        updateProcessState('error', 'network');
        throw err;
      });
  });

  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedId = feed.id;
  });
};

export default listen;
