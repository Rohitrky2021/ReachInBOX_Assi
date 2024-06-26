import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const analyzeEmailContent = async (content: string) => {
    const response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `Categorize this email: "${content}". Categories: Interested, Not Interested, More Information.`,
        max_tokens: 60,
    });

    return response.data.choices[0].text.trim();
};

export const generateEmailReply = async (category: string, content: string) => {
    let prompt: string;

    switch (category) {
        case 'Interested':
            prompt = `Generate a response to this email indicating interest: "${content}". Invite them to a demo call.`;
            break;
        case 'Not Interested':
            prompt = `Generate a polite response to this email indicating no interest: "${content}".`;
            break;
        case 'More Information':
            prompt = `Generate a response to this email requesting more information: "${content}".`;
            break;
        default:
            prompt = `Generate a generic response to this email: "${content}".`;
            break;
    }

    const response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt,
        max_tokens: 150,
    });

    return response.data.choices[0].text.trim();
};
