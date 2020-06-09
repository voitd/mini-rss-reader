import i18next from 'i18next';

const channels = document.querySelector('.rss-channel');
const items = document.querySelector('.rss-items');
const alert = document.querySelector('.feedback');
const input = document.querySelector('#urlInput');

const renderNews = (state) => {
  const list = document.createElement('ul');
  list.className = 'list-group';
  const { news } = state.data;
  const item =
    state.data.activeFeedId === 0 ? news : news.filter(({ id }) => state.data.activeFeedId === id);

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

const renderChannels = (state) => {
  const list = document.createElement('div');
  list.className = 'list-group';
  state.data.feeds.forEach(({ id, title, description, link }) => {
    const a = document.createElement('a');
    const p = document.createElement('p');
    const div = document.createElement('div');
    const h5 = document.createElement('h5');
    const span = document.createElement('span');
    const small = document.createElement('small');
    const name = document.createTextNode(title);
    const desc = document.createTextNode(description);
    const url = document.createTextNode(link);

    const count = state.data.news.filter((post) => post.id === id).length;

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

const renderAlert = (errors) => {
  console.log('renderAlert -> errors', errors);
  const { type, style } = errors;
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

export { renderNews, renderChannels, renderAlert, hideAlert };
