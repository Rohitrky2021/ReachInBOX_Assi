const { google } = require('googleapis');
const { getGmailOAuthClient } = require('../utils/oauth');
const { analyzeEmailContent, generateEmailReply } = require('../services/openAIService');
const { sendEmail } = require('../utils/emailUtils');

exports.connectGmail = async (req, res) => {
    const oAuth2Client = getGmailOAuthClient();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
    });

    res.redirect(authUrl);
};

exports.handleGmailCallback = async (req, res) => {
    const oAuth2Client = getGmailOAuthClient();
    const { code } = req.query;

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.status(200).json({ message: 'Gmail connected successfully', tokens });
};

exports.handleGmailWebhook = async (req, res) => {
    const { emailContent } = req.body;
    
    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(req.body.email, reply);

    res.status(200).json({ message: 'Email processed and replied', category, reply });
};
