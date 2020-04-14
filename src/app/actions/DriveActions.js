import { PING_SERVICE_SUCCESS, PING_SERVICE_FAILED } from '../../consts';

export function pingServiceFailed() {
  return {
    type: PING_SERVICE_FAILED,
  };
}

export function pingServiceSuccess({ user, service }) {
  return {
    type: PING_SERVICE_SUCCESS,
    user,
    service,
  };
}

export function pingService() {
  return () => {};
}
