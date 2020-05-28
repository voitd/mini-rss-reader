/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
// приём запроса от пользователя;
// анализ запроса;
// выбор следующего действия системы, соответственно результатам анализа
// (например, передача запроса другим элементам системы).
import { isEqual } from 'lodash';
import { addURL, getFeedData, validateURL } from './servises';

const listen = (channels, form, input, state) => {
  input.addEventListener('input', ({ target }) => {
    state.form.processState = 'filling';
    const { name, value } = target;
    state.form.fields[name] = value;
    const errors = validateURL(value, state.data.urls);
    if (isEqual(errors, {})) {
      state.form.errors.message = '';
    } else {
      state.form.processState = 'error';
      state.form.errors.message = errors;
      state.form.errors.type = 'danger';
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.form.fields.url.length) {
      addURL(state.form.fields.url, state.data.urls);
    } else return;
    state.form.processState = 'sending';
    state.form.errors.type = 'warning';
    state.form.errors.message = 'Wait a few seconds.Feeds is loaded...';
    try {
      getFeedData(state).then((feed) => {
        state.data.feeds = feed.map((item) => item.rss.channel);
        state.form.processState = 'finished';
        state.form.errors.type = 'success';
        state.form.errors.message = 'RSS is added';
      });
    } catch (err) {
      state.form.processState = 'error';
      state.form.errors = 'Network Problems. Try again.';
      state.form.errors.type = 'danger';
      throw err;
    }
  });
  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedId = feed.id;
  });
};

export default listen;
