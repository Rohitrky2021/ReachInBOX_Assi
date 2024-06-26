const { analyzeEmailContent, generateEmailReply } = require('../services/openAIService');
const { scheduleEmailProcessing } = require('../services/bullmqService');
const { getGmailService, listMessages: listGmailMessages, getMessage: getGmailMessage } = require('../services/gmailService');
const { getOutlookClient, listMessages: listOutlookMessages, getMessage: getOutlookMessage } = require('../services/outlookService');
const { sendEmail } = require('../utils/emailUtils');

exports.processGmail = async (req, res) => {
    const { tokens } = req.body;
    const gmail = getGmailService(tokens);

    const messages = await listGmailMessages(gmail);

    for (const message of messages) {
        const fullMessage = await getGmailMessage(gmail, message.id);
        const emailContent = Buffer.from(fullMessage.payload.body.data, 'base64').toString();

        scheduleEmailProcessing(emailContent, fullMessage.payload.headers.find(header => header.name === 'From').value);
    }

    res.status(200).json({ message: 'Gmail messages processed' });
};

exports.processOutlook = async (req, res) => {
    const { accessToken } = req.body;
    const client = getOutlookClient(accessToken);

    const messages = await listOutlookMessages(client);

    for (const message of messages) {
        const fullMessage = await getOutlookMessage(client, message.id);
        const emailContent = fullMessage.body.content;

        scheduleEmailProcessing(emailContent, fullMessage.from.emailAddress.address);
    }

    res.status(200).json({ message: 'Outlook messages processed' });
};

exports.handleIncomingEmail = async (req, res) => {
    const { emailContent, emailAddress } = req.body;

    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(emailAddress, reply);

    res.status(200).json({ message: 'Email processed and replied', category, reply });
};
