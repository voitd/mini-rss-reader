import { getFeedData, updateFeedData, validateURL } from './services';

const listen = (channels, form, input, state) => {
  input.addEventListener('input', ({ target }) => {
    const { name, value } = target;
    const feeds = state.data.feeds.map(({ url }) => url);
    validateURL(value, feeds)
      .then(() => {
        state.form.input[name] = value;
        state.form.processState = 'valid';
      })
      .catch((err) => {
        state.form.processState = 'error';
        state.form.errors.message = err.message;
      });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.processState = 'sending';
    getFeedData(state)
      .then(() => {
        state.form.processState = 'finished';
        updateFeedData(state);
      })
      .catch((err) => {
        state.form.processState = 'error';
        state.form.errors.message = 'network';
        throw err;
      });
  });

  channels.addEventListener('click', ({ target }) => {
    const feed = target.closest('a');
    state.data.activeFeedID = feed.id;
  });
};

export default listen;
