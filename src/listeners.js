/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { isEqual } from 'lodash';
import { addURL, getFeedData, validateURL } from './servises';

const listen = (channels, form, input, state) => {
  const feedList = state.data.urls;

  const updateValidationState = (process, type, style) => {
    state.form.processState = process;
    state.form.errors.type = type;
    state.form.errors.style = style;
  };

  input.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    state.form.fields[name] = value;

    const errors = validateURL(value, feedList);

    if (isEqual(errors, {})) {
      state.form.processState = 'valid';
    } else {
      updateValidationState('error', errors, 'danger');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valideURL = state.form.fields.url;
    addURL(valideURL, feedList);
    updateValidationState('sending', 'warning', 'warning');

    getFeedData(state)
      .then(updateValidationState('finished', 'success', 'success'))
      .catch((err) => {
        updateValidationState('error', 'network', 'danger');
        throw err;
      });
  });

  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedId = feed.id;
  });
};

export default listen;
