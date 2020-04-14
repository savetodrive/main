const uuidv3 = require('uuid/v3');
const uuidv1 = require('uuid/v1');
const { PROCESS_TYPE } = require('../../Strings');

class Process {
  constructor() {
    this.processType = PROCESS_TYPE.REMOTE_UPLOAD;
    this.plan_code = 'free';
  }

  setProcessType(processType) {
    this.processType = processType;
  }
  getEmail() {
    return this.email;
  }
  /**
   * Sometime there might be conflict with uuid so we can regenerate
   */
  regenerateMetaUuid(key = '') {
    if (!this.meta) {
      this.meta = {};
    }
    this.meta.uuid = uuidv3(key, uuidv1());
  }
  getFilename() {
    return this.createFilename();
  }
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
  getService() {
    return this.service;
  }
  setService(service) {
    this.cloud = service;
  }
  getMeta() {
    return this.meta;
  }
  setPremium(isPremium) {
    this.isPremium = isPremium;
  }
  setCompleted(isCompleted) {
    this.isCompleted = isCompleted;
  }
  setSessionId(sessionId) {
    this.sessionId = sessionId;
    return this;
  }
  setAuthProfile(profile) {
    this.authProfile = profile;
  }
  setUser(user) {
    this.user = {
      _id: user._id,
      email: user.email,
      subscription: {
        ends_at: user.subscription.ends_at,
      },
      plan: {
        _id: user.plan._id,
        name: user.plan.name,
        features: user.plan.features,
        provider_plan_code: user.plan.provider_plan_code,
      },
    };
    this.plan_code = user.plan.provider_plan_code;
  }

  setFilename(filename) {
    this.filename = filename;
  }

  setEmail(email) {
    this.email = email;
  }
  setGroupId(groupId) {
    this.groupId = groupId;
  }

  getGroupId() {
    return this.groupId;
  }
}
module.exports = Process;
