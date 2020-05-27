/* eslint-disable no-param-reassign */
// приём запроса от пользователя;
// анализ запроса;
// выбор следующего действия системы, соответственно результатам анализа
// (например, передача запроса другим элементам системы).
import { isEqual } from 'lodash';
import { getFeedData, validateURL } from './servises';

const listen = (channels, form, input, state) => {
  input.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    state.form.fields[name] = value;
    const errors = validateURL(value, state.data.urls);
    // if (!value) {
    //   state.form.processState = 'filling';
    // }
    if (isEqual(errors, {}) || !value) {
      state.form.processState = 'filling';
      state.form.errors = '';
    } else {
      state.form.processState = 'error';
      state.form.errors = errors;
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.processState = 'sending';
    try {
      getFeedData(state).then((state.form.processState = 'finished'));
    } catch (err) {
      state.form.processState = 'error';
      state.form.errors = 'Network Problems. Try again.';
      throw err;
    }
  });
  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedId = feed.id;
  });
};

export default listen;
