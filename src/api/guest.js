import template from 'lodash/fp/template';
import HttpClient from '../Utils/HttpClient';
import * as API from './';

const httpApiClient = HttpClient.api();
export function postAuthCallback({ service, payload, params }) {
  return httpApiClient.post(template(API.AUTH_FACEBOOK_CALLBACK)({ service }), payload, { params });
}
export function postLogin(payload) {
  return httpApiClient.post(API.LOGIN, payload);
}
export function postRegister(payload) {
  return httpApiClient.post(API.REGISTER, payload);
}
export function postForgotPassword(payload) {
  return httpApiClient.post(API.FORGOT_PASSWORD, payload);
}
export function postNewPassword({ hash }, payload) {
  return httpApiClient.post(template(API.RESET_PASSWORD)({ hash }), payload);
}
export function getServiceStatus(service) {
  return httpApiClient.get(template(API.PING_SERVICE)({ service }));
}
export function postUploadFileToService(service, data) {
  return httpApiClient.post(template(API.UPLOAD_FILE_TO_CLOUD)({ service }), data);
}
export function killUploadTask(processId) {
  return httpApiClient.post(template(API.KILL_UPLOAD_TASK)({ processId }));
}
export function getTags(params) {
  return httpApiClient.get(API.FETCH_TAGS, { params });
}
export function getPingApp() {
  return httpApiClient.get(API.PING_APP);
}
