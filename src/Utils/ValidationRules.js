const Yup = require('yup');

module.exports = {
  formRules(data) {
    const errors = {};

    ['First_name', 'Last_name', 'Email', 'Password'].forEach((field) => {
      const lowerCaseField = field.toLowerCase();
      if (!data[lowerCaseField]) {
        errors[lowerCaseField] = field.replace('_', ' ') + ' is required'; // eslint-disable-line
      }
      if (lowerCaseField === 'email' && data[lowerCaseField]) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data[lowerCaseField])) {
          errors[lowerCaseField] = 'Invalid email address';
        }
      }
    });
    return errors;
  },
  register: Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    password: Yup.string()
      .min(8)
      .required(),
  }),
  login: Yup.object().shape({
    username: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .min(8)
      .required(),
  }),
  upload: Yup.object().shape({
    isFilename: Yup.boolean(),
    isEmail: Yup.boolean(),
    filename: Yup.string().when('isFilename', {
      is: true,
      then: Yup.string().required(),
    }),
    email: Yup.string().when('isEmail', {
      is: true,
      then: Yup.string()
        .email()
        .required(),
    }),
    connections: Yup.array()
      .min(1)
      .required()
      .max(10),
    urls: Yup.array()
      .min(1)
      .max(10)
      .of(
        Yup.object().shape({
          id: Yup.string(),
          value: Yup.string()
            .url('All urls must be valid url, be sure url has (http/https).')
            .required('Url field is required.'),
        }),
      )
      .required(),
  }),
  cloudClone: Yup.object().shape({
    destination: Yup.object().shape({
      connectionId: Yup.string().required(),
      activeFolder: Yup.object().shape({
        id: Yup.string().required(),
      }),
    }),
    source: Yup.object().shape({
      connectionId: Yup.string().required(),
      activeFolder: Yup.object().shape({
        id: Yup.string().required(),
      }),
      item: Yup.object().shape({
        id: Yup.string().required(),
      }),
    }),
  }),
  torrent: Yup.object().shape({
    type: Yup.string().required(),
    magnet: Yup.string().when('type', {
      is: 'magnet',
      then: Yup.string().required(),
    }),
    url: Yup.string().when('type', {
      is: 'url',
      then: Yup.string()
        .url()
        .required(),
    }),
    file: Yup.bool().when('type', {
      is: 'file',
      then: Yup.bool('Please select valid .torrent file').required(),
    }),
  }),
  copyTorrentItemToCloud: Yup.object().shape({
    source: Yup.object().shape({
      path: Yup.string().required(),
      name: Yup.string().required(),
    }),
    destination: Yup.object().shape({
      connectionId: Yup.string().required(),
      activeFolder: Yup.object().shape({
        id: Yup.string().required(),
      }),
    }),
  }),
};
