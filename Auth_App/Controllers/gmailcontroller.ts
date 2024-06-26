import { Request, Response } from 'express';
import { google } from 'googleapis';
import { getGmailOAuthClient } from '../middlewares/oauth';
import { analyzeEmailContent, generateEmailReply } from '../services/openAIService';
import { sendEmail } from '../middlewares/emailUtils';

export const connectGmail = async (req: Request, res: Response) => {
    const oAuth2Client = getGmailOAuthClient();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
    });

    res.redirect(authUrl);
};

export const handleGmailCallback = async (req: Request, res: Response) => {
    const oAuth2Client = getGmailOAuthClient();
    const { code } = req.query;

    const { tokens } = await oAuth2Client.getToken(code as string);
    oAuth2Client.setCredentials(tokens);

    res.status(200).json({ message: 'Gmail connected successfully', tokens });
};

export const handleGmailWebhook = async (req: Request, res: Response) => {
    const { emailContent } = req.body;
    
    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(req.body.email, reply);

    res.status(200).json({ message: 'Email processed and replied', category, reply });
};
