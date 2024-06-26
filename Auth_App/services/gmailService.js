const { google } = require('googleapis');

exports.getGmailService = (tokens) => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);

    return google.gmail({ version: 'v1', auth: oAuth2Client });
};

exports.listMessages = async (gmail) => {
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
    });
    return res.data.messages || [];
};

exports.getMessage = async (gmail, messageId) => {
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
    });
    return res.data;
};
