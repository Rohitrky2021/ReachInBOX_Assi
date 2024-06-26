import { google } from 'googleapis';
import { ConfidentialClientApplication } from '@azure/msal-node';


export const getGmailOAuthClient = () => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
    );

    return oAuth2Client;
};



export const getOutlookOAuthClient = () => {
    const config = {
        auth: {
            clientId: process.env.OUTLOOK_CLIENT_ID,
            authority: process.env.OUTLOOK_AUTHORITY,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
        },
    };

    const cca = new ConfidentialClientApplication(config);
    return cca;
};
