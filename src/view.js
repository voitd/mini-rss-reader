/* eslint-disable no-param-reassign */
import { watch } from 'melanke-watchjs';
import listen from './listeners';

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      fields: {
        url: '',
      },
      errors: {
        message: '',
        type: 'danger',
      },
    },
    data: {
      feeds: [],
      urls: [],
      activeFeedId: 0,
    },
  };

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#urlInput');
  const btn = document.querySelector('.btn');
  const alert = document.querySelector('.feedback');
  const channels = document.querySelector('.rss-channel');
  const items = document.querySelector('.rss-items');

  const showAlert = (message, type) => {
    if (!message) return;
    if (alert.innerHTML !== '') {
      alert.innerHTML = '';
    }
    alert.classList.remove('invisible');

    const div = document.createElement('div');
    const closeBtn = document.createElement('button');
    const span = document.createElement('span');

    div.setAttribute('class', `alert mt-2 w-50 alert-${type} text-${type} fade show`);
    div.setAttribute('role', 'alert');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('class', 'close');
    closeBtn.setAttribute('data-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    span.setAttribute('aria-hidden', 'true');
    div.append(closeBtn);
    closeBtn.append(span);
    span.innerHTML = '&times;';
    div.textContent = message;
    alert.append(div);
  };

  const renderNews = () => {
    const list = document.createElement('ul');
    list.className = 'list-group';
    const { feeds } = state.data;
    const news = state.data.activeFeedId === 0
      ? feeds
      : feeds.filter((channel) => state.data.activeFeedId === channel.id);
    const actualNews = news
      .flatMap((channel) => channel.item)
      .forEach(({ title, description, link }) => {
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
    list.append(actualNews);
    items.innerHTML = '';
    items.append(list);
  };
  const renderChannelsList = () => {
    channels.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'list-group';
    state.data.feeds.forEach((channel) => {
      const a = document.createElement('a');
      const p = document.createElement('p');
      const div = document.createElement('div');
      const h5 = document.createElement('h5');
      const span = document.createElement('span');
      const small = document.createElement('small');
      const name = document.createTextNode(channel.title);
      const description = document.createTextNode(channel.description);
      const count = document.createTextNode(channel.item.length);
      const link = document.createTextNode(channel.link);
      if (channel.id === state.data.activeFeedId) {
        a.setAttribute('class', 'list-group-item list-group-item-action active');
      } else {
        a.setAttribute('class', 'list-group-item list-group-item-action');
      }
      a.id = channel.id;
      div.setAttribute('class', 'd-flex w-100 align-items-center justify-content-between');
      h5.setAttribute('class', 'mb-1');
      h5.append(name);
      span.setAttribute('class', 'badge badge-info badge-pill');
      span.append(count);
      div.append(h5);
      div.append(span);
      a.append(div);
      p.setAttribute('class', 'mb-1');
      p.append(description);
      a.append(p);
      small.setAttribute('class', 'text-muted');
      small.append(link);
      a.append(small);
      list.append(a);
    });

    channels.append(list);
  };

  listen(channels, form, input, state);

  watch(state.data, ['activeFeedId', 'feeds'], () => {
    renderChannelsList();
    renderNews();
  });

  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'error':
        btn.disabled = true;
        input.classList.add('is-invalid');

        break;
      case 'filling':
        input.value = '';
        btn.disabled = false;

        input.disabled = false;
        alert.classList.add('invisible');
        input.classList.remove('is-invalid');
        console.log(alert);
        break;
      case 'sending':
        btn.disabled = true;
        input.disabled = true;
        break;
      case 'finished':
        input.value = '';
        btn.disabled = false;
        input.disabled = false;
        input.classList.remove('is-invalid');
        break;
      default:
        throw new Error('Unknown state');
    }
  });
  watch(state.form.errors, ['message', 'type'], () => {
    showAlert(state.form.errors.message, state.form.errors.type);
  });
};

export default app;
