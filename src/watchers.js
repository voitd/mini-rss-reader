import { watch } from 'melanke-watchjs';
import { renderNews, renderChannels, renderAlert } from './renders';

const watchState = (state, domElements) => {
  const { channelsList, itemsList, input, btn, alert } = domElements;

  watch(state.data, ['activeFeedID', 'feeds'], () => renderChannels(channelsList, state));

  watch(state.data, ['activeFeedID', 'news'], () => renderNews(itemsList, state));

  watch(state.form.errors, () => renderAlert(alert, state));

  watch(state.form, 'processState', () => {
    const { processState, errors } = state.form;
    switch (processState) {
      case 'error':
        btn.disabled = true;
        input.classList.add('is-invalid');
        errors.type = errors.message;
        errors.style = 'danger';
        break;
      case 'valid':
        btn.disabled = false;
        input.disabled = false;
        input.classList.remove('is-invalid');
        alert.classList.add('invisible');
        break;
      case 'sending':
        btn.disabled = true;
        input.disabled = true;
        errors.type = 'warning';
        errors.style = 'warning';
        break;
      case 'success':
        input.value = '';
        btn.disabled = true;
        input.disabled = false;
        errors.type = 'success';
        errors.style = 'success';
        setTimeout(() => {
          input.classList.remove('is-invalid');
          alert.classList.add('invisible');
        }, 5000);
        break;
      default:
        throw new Error(`${state.form.processState}:Unknown state`);
    }
  });
};

export default watchState;
