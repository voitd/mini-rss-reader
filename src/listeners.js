/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { isEqual } from 'lodash';
import { addNewFeed, updateFeedData, validateURL } from './servises';

const listen = (channels, form, input, state) => {
  const feedList = state.data.urls;

  const updateAlertState = (process, type, style) => {
    state.form.processState = process;
    state.form.errors.type = type;
    state.form.errors.style = style;
  };

  input.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    state.form.input[name] = value;

    const errors = validateURL(value, feedList);

    if (isEqual(errors, {})) {
      state.form.processState = 'valid';
    } else {
      updateAlertState('error', errors, 'danger');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const validURL = state.form.input.url;
    addNewFeed(validURL, feedList);

    updateFeedData(state)
      .then(updateAlertState('sending', 'warning', 'warning'))
      .catch((err) => {
        updateAlertState('error', 'network', 'danger');
        throw err;
      });
    updateAlertState('finished', 'success', 'success');
  });

  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedId = feed.id;
  });
};

export default listen;
