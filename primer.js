import _ from 'lodash';
import * as yup from 'yup';

import { watch } from 'melanke-watchjs';
import axios from 'axios';

// Never hardcore urls
const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password'), null], 'Password confirmation does not match to password'),
});

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// BEGIN
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

const renderErrors = (elements, errors) => {
  Object.entries(elements).forEach(([name, element]) => {
    const errorElement = element.nextElementSibling;
    const error = errors[name];
    if (errorElement) {
      element.classList.remove('is-invalid');
      errorElement.remove();
    }
    if (!error) {
      return;
    }
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.innerHTML = error.message;
    element.classList.add('is-invalid');
    element.after(feedbackElement);
  });
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      valid: true,
      errors: {},
    },
  };

  const container = document.querySelector('[data-container="sign-up"]');
  const form = document.querySelector('[data-form="sign-up"]');
  const fieldElements = {
    name: document.getElementById('sign-up-name'),
    email: document.getElementById('sign-up-email'),
    password: document.getElementById('sign-up-password'),
    passwordConfirmation: document.getElementById('sign-up-password-confirmation'),
  };
  const submitButton = form.querySelector('input[type="submit"]');

  Object.entries(fieldElements).forEach(([name, element]) => {
    element.addEventListener('input', (e) => {
      state.form.fields[name] = e.target.value;
      updateValidationState(state);
    });
  });

  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'failed':
        submitButton.disabled = false;
        // TODO render error
        break;
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        break;
      case 'finished':
        container.innerHTML = 'User Created!';
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state.form, 'valid', () => {
    submitButton.disabled = !state.form.valid;
  });

  watch(state.form, 'errors', () => {
    renderErrors(fieldElements, state.form.errors);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    state.form.processState = 'sending';
    try {
      await axios.post(routes.usersPath(), state.form.fields);
      state.form.processState = 'finished';
    } catch (err) {
      // TODO: Real behavior depends on the status code of response
      state.form.processError = errorMessages.network.error;
      state.form.processState = 'failed';
      throw err;
    }
  });
};
