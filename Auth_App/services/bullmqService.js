const { Queue } = require('bullmq');
const { handleIncomingEmail } = require('../controllers/emailController');

const emailQueue = new Queue('emailQueue', {
    connection: {
        host: '127.0.0.1',
        port: 6379,
    },
});

exports.scheduleEmailProcessing = (emailContent, emailAddress) => {
    emailQueue.add('processEmail', { emailContent, emailAddress });
};

emailQueue.process('processEmail', async (job) => {
    const { emailContent, emailAddress } = job.data;
    await handleIncomingEmail({ body: { emailContent, emailAddress } }, { status: () => ({ json: () => {} }) });
});
