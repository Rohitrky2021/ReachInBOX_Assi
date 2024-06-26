const { google } = require('googleapis');
const { PublicClientApplication } = require('@azure/msal-node');
require('dotenv').config();

exports.getGmailOAuthClient = () => {
    return new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
    );
};

exports.getOutlookOAuthClient = () => {
    return new PublicClientApplication({
        auth: {
            clientId: process.env.OUTLOOK_CLIENT_ID,
            authority: process.env.OUTLOOK_AUTHORITY,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
        },
    });
};
