import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const getGmailService = (tokens: any) => {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);

    return google.gmail({ version: 'v1', auth: oAuth2Client });
};

export const listMessages = async (gmail: any) => {
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
    });
    return res.data.messages || [];
};

export const getMessage = async (gmail: any, messageId: string) => {
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
    });
    return res.data;
};
