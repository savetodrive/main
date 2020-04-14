const strings = require('../Strings');
const Drive = require('../services/drives/Drive');

process.on('message', ({ type, context }) => {
  const drive = new Drive(context.cloud);

  switch (type) {
    case strings.BOOT_UPLOADING_PROCESS:
      drive.setAccessToken(context.accessToken);
      drive.upload(
        context,

        /* Progress report here */
        (progress) => {
          process.send({ type: strings.UPLOAD_PROGRESS, data: progress });
        },

        /* Step logs here */
        (step, stepType) => {
          process.send({
            type: strings.UPLOAD_LOGS,
            data: {
              type: stepType,
              message: step,
            },
          });
        },

        /* Callback when task is completed or aborted */
        (error, result) => {
          if (error) {
            return process.send({
              type: strings.UPLOAD_FAILED,
              data: {
                message: error.message,
              },
            });
          }
          return process.send({
            type: strings.UPLOAD_SUCCESS,
            data: {
              result,
            },
          });
        },
      );
      break;

    default:
      global.logger.error('No task found, ignoring and send kill command');
      process.send({ type: strings.KILL_ME });
      break;
  }
});
