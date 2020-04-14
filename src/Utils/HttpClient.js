/* global NProgress */
import axios from 'axios';
import { getToken } from '../Utils/Token';

// const HOST = process.env.NODE_ENV === 'development'
//  ? 'http://localhost:3001'
//  : 'http://localhost:3000';
const interCeptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      NProgress.start();
      return config;
    },
    (error) => {
      NProgress.done();
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      NProgress.done();
      return response;
    },
    (error) => {
      NProgress.done();
      return Promise.reject(error);
    },
  );
};
const validateStatus = function validateStatus(status) {
  return status >= 200 && status <= 299; // default
};
export default {
  guest: function guest() {
    const instance = axios.create({
      baseURL: `/`,
      validateStatus,
    });
    interCeptor(instance);
    return instance;
  },
  auth: function api() {
    const instance = axios.create({
      baseURL: `/api/auth`,
      headers: {
        Authorization: `JWT ${getToken()}`,
      },
      validateStatus,
    });
    interCeptor(instance);
    return instance;
  },
  api: function api() {
    const instance = axios.create({
      baseURL: `/api/`,
      validateStatus,
    });
    interCeptor(instance);
    return instance;
  },
};
