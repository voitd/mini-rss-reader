/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all';
import _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import * as yup from 'yup';
import resources from './locales';

const schema = yup.object().shape({
  url: yup.string().url('Must enter URL in http://www.example.com format'),
});
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};
const proxyCORS = 'https://cors-anywhere.herokuapp.com/';
const feeds = ['http://lorem-rss.herokuapp.com/feed'];

const renderErrors = (element, errors) => {
  const feedbackElement = document.querySelector('.error-message');
  const error = errors[element.name];
  if (feedbackElement.innerHTML !== '') {
    element.classList.remove('is-invalid');
    feedbackElement.innerHTML = '';
  }
  if (!error) {
    return;
  }
  feedbackElement.textContent = error.message;
  element.classList.add('is-invalid');
};

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      fields: {
        url: '',
      },
      valid: true,
      errors: {},
    },
    item: {},
    link: {},
  };

  const form = document.querySelector('.rss-form');
  const formInput = document.querySelector('#urlInput');
  const formBtn = document.querySelector('.btn');

  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return _.keyBy(e.inner, 'path');
    }
  };

  const updateValidationState = (state) => {
    const errors = validate(state.form.fields);
    if (_.isEqual(errors, {})) {
      state.form.valid = true;
      state.form.errors = {};
    } else {
      state.form.errors = errors;
      state.form.valid = false;
    }
  };

  formInput.addEventListener('input', (e) => {
    state.form.fields[e.target.name] = e.target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios
      .get(proxyCORS + state.form.fields.url, state.form.fields)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => console.log(data))
      .catch((err) => {
        console.log('err', err);
        state.form.processError = errorMessages.network.error;
        state.form.processState = 'failed';
        throw err;
      });
  });

  watch(state.form, 'errors', () => {
    renderErrors(formInput, state.form.errors);
  });
};

app();
