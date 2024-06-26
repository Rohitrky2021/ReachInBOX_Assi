const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.analyzeEmailContent = async (emailContent) => {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Analyze the following email and categorize it into one of these categories: Interested, Not Interested, More Information:\n\n${emailContent}`,
        max_tokens: 60,
    });

    return response.data.choices[0].text.trim();
};

exports.generateEmailReply = async (category, emailContent) => {
    const prompt = `
    Based on the following category and email content, generate an appropriate response:

    Category: ${category}
    Email Content: ${emailContent}

    Reply:
    `;

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
    });

    return response.data.choices[0].text.trim();
};
