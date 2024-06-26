import { Request, Response } from 'express';
import { getOutlookOAuthClient } from '../middlewares/oauth';
import { analyzeEmailContent, generateEmailReply } from '../services/openAIService';
import { sendEmail } from '../middlewares/emailUtils';

export const connectOutlook = async (req: Request, res: Response) => {
    const cca = getOutlookOAuthClient();
    const authCodeUrlParameters = {
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    };

    const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
};

export const handleOutlookCallback = async (req: Request, res: Response) => {
    const cca = getOutlookOAuthClient();
    const { code } = req.query;

    const tokenRequest = {
        code: code as string,
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
    };

    const response = await cca.acquireTokenByCode(tokenRequest);
    res.status(200).json({ message: 'Outlook connected successfully', tokens: response.accessToken });
};

export const handleOutlookWebhook = async (req: Request, res: Response) => {
    const { emailContent } = req.body;
    
    const category = await analyzeEmailContent(emailContent);
    const reply = await generateEmailReply(category, emailContent);

    await sendEmail(req.body.email, reply);

    res.status(200).json({ message: 'Email processed and replied', category, reply });
};
