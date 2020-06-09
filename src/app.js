import { watch } from 'melanke-watchjs';
import listen from './listeners';
import { renderNews, renderChannels, renderAlert, hideAlert } from './renders';

const app = () => {
  const state = {
    form: {
      processState: 'finished',
      input: {
        url: '',
      },
      errors: {
        type: '',
        style: '',
      },
    },
    data: {
      feeds: [],
      news: [],
      activeFeedId: 0,
    },
  };

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#urlInput');
  const btn = document.querySelector('.btn');
  const channels = document.querySelector('.rss-channel');

  watch(state.data, ['activeFeedId', 'feeds'], () => renderChannels(state));

  watch(state.data, ['activeFeedId', 'news'], () => renderNews(state));

  watch(state.form.errors, () => renderAlert(state.form.errors));

  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'error':
        btn.disabled = true;
        input.classList.add('is-invalid');
        break;
      case 'valid':
        btn.disabled = false;
        input.disabled = false;
        hideAlert();
        break;
      case 'sending':
        btn.disabled = true;
        input.disabled = true;
        break;
      case 'finished':
        input.value = '';
        btn.disabled = true;
        input.disabled = false;
        setTimeout(() => {
          hideAlert();
        }, 5000);
        break;
      default:
        throw new Error('Unknown state');
    }
  });
  listen(channels, form, input, state);
};

export default app;
