/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import listen from './listeners';
import resources from './locales';

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
      urls: [],
      activeFeedId: 0,
    },
  };

  i18next.init({
    lng: 'en',
    resources,
  });

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#urlInput');
  const btn = document.querySelector('.btn');
  const alert = document.querySelector('.feedback');
  const channels = document.querySelector('.rss-channel');
  const items = document.querySelector('.rss-items');

  const showAlert = () => {
    const { type, style } = state.form.errors;
    const message = i18next.t(`alert.${type}`);

    if (alert.innerHTML !== '') {
      alert.innerHTML = '';
    }
    alert.classList.remove('invisible');

    const div = document.createElement('div');
    const closeBtn = document.createElement('button');
    const span = document.createElement('span');
    const text = document.createTextNode(message);

    div.setAttribute('class', `alert mt-2 w-50 alert-${style} text-${style} fade show`);
    div.setAttribute('role', 'alert');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('class', 'close');
    closeBtn.setAttribute('data-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';
    closeBtn.append(span);
    div.append(closeBtn);
    div.append(text);
    alert.append(div);
  };

  const hideAlert = () => {
    input.classList.remove('is-invalid');
    alert.classList.add('invisible');
  };

  const renderNews = () => {
    const list = document.createElement('ul');
    list.className = 'list-group';
    const { news } = state.data;
    const item =
      state.data.activeFeedId === 0
        ? news
        : news.filter(({ id }) => state.data.activeFeedId === id);

    item.forEach(({ title, description, link }) => {
      const li = document.createElement('li');
      const h5 = document.createElement('h5');
      const a = document.createElement('a');
      const h6 = document.createElement('h6');
      li.className = 'list-group-item';
      h5.className = 'mb-2';
      a.href = link;
      a.textContent = title;
      h5.append(a);
      h6.textContent = description;
      li.append(h5);
      li.append(h6);
      list.append(li);
    });
    items.innerHTML = '';
    items.append(list);
  };

  const renderChannelsList = () => {
    const list = document.createElement('div');
    list.className = 'list-group';
    state.data.feeds.forEach(({ id, title, description, item, link }) => {
      const a = document.createElement('a');
      const p = document.createElement('p');
      const div = document.createElement('div');
      const h5 = document.createElement('h5');
      const span = document.createElement('span');
      const small = document.createElement('small');
      const name = document.createTextNode(title);
      const desc = document.createTextNode(description);
      const count = document.createTextNode(item.length);
      const url = document.createTextNode(link);
      if (id === state.data.activeFeedId) {
        a.setAttribute('class', 'list-group-item list-group-item-action active');
      } else {
        a.setAttribute('class', 'list-group-item list-group-item-action');
      }
      a.id = id;
      div.setAttribute('class', 'd-flex w-100 align-items-center justify-content-between');
      h5.setAttribute('class', 'mb-1');
      h5.append(name);
      span.setAttribute('class', 'badge badge-info badge-pill');
      span.append(count);
      div.append(h5);
      div.append(span);
      a.append(div);
      p.setAttribute('class', 'mb-1');
      p.append(desc);
      a.append(p);
      small.setAttribute('class', 'text-muted');
      small.append(url);
      a.append(small);
      list.append(a);
    });
    channels.innerHTML = '';
    channels.append(list);
  };

  watch(state.data, ['activeFeedId', 'feeds'], renderChannelsList);

  watch(state.data, ['activeFeedId', 'news'], renderNews);

  watch(state.form.errors, showAlert);

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
