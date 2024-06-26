import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('emailQueue', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

new Worker('emailQueue', async (job) => {
    const { emailContent, emailAddress } = job.data;

    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(emailAddress, reply);
});

export const scheduleEmailProcessing = (emailContent: string, emailAddress: string) => {
    emailQueue.add('processEmail', { emailContent, emailAddress });
};
