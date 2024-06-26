const { getOutlookOAuthClient } = require('../utils/oauth');
const { analyzeEmailContent, generateEmailReply } = require('../services/openAIService');
const { sendEmail } = require('../utils/emailUtils');

exports.connectOutlook = async (req, res) => {
    const cca = getOutlookOAuthClient();
    const authCodeUrlParameters = {
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    };

    const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
};

exports.handleOutlookCallback = async (req, res) => {
    const cca = getOutlookOAuthClient();
    const { code } = req.query;

    const tokenRequest = {
        code: code,
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    };

    const response = await cca.acquireTokenByCode(tokenRequest);
    res.status(200).json({ message: 'Outlook connected successfully', tokens: response.accessToken });
};

exports.handleOutlookWebhook = async (req, res) => {
    const { emailContent } = req.body;
    
    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(req.body.email, reply);

    res.status(200).json({ message: 'Email processed and replied', category, reply });
};
