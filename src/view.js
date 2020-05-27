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
      errors: '',
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
  const alert = document.querySelector('.alert');
  const channels = document.querySelector('.rss-channel');
  const items = document.querySelector('.rss-items');

  const showAlert = (type, error) => {
    console.log('showAlert -> error', error, type);
    if (!error) return;
    if (alert.innerHTML !== '') {
      alert.innerHTML = '';
    }
    alert.classList.remove('invisible');
    alert.classList.add(`alert-${type}`, `text-${type}`);
    alert.classList.add();
    //  TODO: Make as elements
    alert.innerHTML = `
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span></button>
      ${error}`;
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
      .map(
        //  TODO: Make as elements
        ({ title, description, link }) => `
        <li class="list-group-item">
        <h5 class="mb-2">
          <a href="${link}">${title}</a>
        </h5>
        <h6>${description}</h6>
      </li>`,
      )
      .join('');
    list.innerHTML = actualNews;
    items.innerHTML = '';
    items.append(list);
  };
  const renderChannelsList = () => {
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
    channels.innerHTML = '';
    channels.append(list);
  };

  listen(channels, form, input, state);

  watch(state.data, ['activeFeedId', 'feeds'], () => {
    renderChannelsList();
    renderNews();
  });

  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    console.log('app -> processState', processState);
    switch (processState) {
      case 'error':
        btn.disabled = true;
        input.classList.add('is-invalid');
        showAlert('danger', state.form.errors);
        console.log('app -> state.form.errors', state.form.errors);
        break;
      case 'filling':
        btn.disabled = false;
        input.value = '';
        alert.classList.add('invisible');
        input.classList.remove('is-invalid');
        break;
      case 'sending':
        btn.disabled = true;
        input.disabled = true;
        showAlert('warning', 'Wait a few seconds.Feeds is loaded...');
        break;
      case 'finished':
        btn.disabled = false;
        input.value = '';
        input.classList.remove('is-invalid');
        showAlert('success', 'RSS is added');
        break;
      default:
        throw new Error('Unknown state');
    }
  });
};

export default app;
