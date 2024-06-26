import { Request, Response } from 'express';
import { analyzeEmailContent, generateEmailReply } from '../services/openAIService';
import { scheduleEmailProcessing } from '../services/bullmqService';
import { getGmailService, listMessages as listGmailMessages, getMessage as getGmailMessage } from '../services/gmailService';
import { getOutlookClient, listMessages as listOutlookMessages, getMessage as getOutlookMessage } from '../services/outlookService';
import { sendEmail } from '../middlewares/emailUtils';

export const processGmail = async (req: Request, res: Response) => {
    try {
        const { tokens } = req.body;
        const gmail = getGmailService(tokens);

        const messages = await listGmailMessages(gmail);

        for (const message of messages) {
            const fullMessage = await getGmailMessage(gmail, message.id);
            const emailContent = Buffer.from(fullMessage.payload.body.data, 'base64').toString();

            const fromAddress = fullMessage.payload.headers.find((header) => header.name === 'From');
            if (fromAddress) {
                scheduleEmailProcessing(emailContent, fromAddress.value);
            } else {
                console.error('From address not found in Gmail message headers');
            }
        }

        res.status(200).json({ message: 'Gmail messages processed' });
    } catch (error) {
        console.error('Error processing Gmail messages:', error);
        res.status(500).json({ message: 'Error processing Gmail messages' });
    }
};

export const processOutlook = async (req: Request, res: Response) => {
    try {
        const { accessToken } = req.body;
        const client = getOutlookClient(accessToken);

        const messages = await listOutlookMessages(client);

        for (const message of messages) {
            const fullMessage = await getOutlookMessage(client, message.id);
            const emailContent = fullMessage.body.content;

            if (fullMessage.from && fullMessage.from.emailAddress && fullMessage.from.emailAddress.address) {
                scheduleEmailProcessing(emailContent, fullMessage.from.emailAddress.address);
            } else {
                console.error('From address not found in Outlook message');
            }
        }

        res.status(200).json({ message: 'Outlook messages processed' });
    } catch (error) {
        console.error('Error processing Outlook messages:', error);
        res.status(500).json({ message: 'Error processing Outlook messages' });
    }
};

export const handleIncomingEmail = async (req: Request, res: Response) => {
    try {
        const { emailContent, emailAddress } = req.body;

        if (!emailContent || !emailAddress) {
            throw new Error('Email content or email address is missing');
        }

        const category = await analyzeEmailContent(emailContent);
        const reply = await generateEmailReply(category, emailContent);

        await sendEmail(emailAddress, reply);

        res.status(200).json({ message: 'Email processed and replied', category, reply });
    } catch (error) {
        console.error('Error handling incoming email:', error);
        res.status(500).json({ message: 'Error handling incoming email' });
    }
};