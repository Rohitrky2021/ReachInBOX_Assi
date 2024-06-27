# ReachInbox Email Automation Tool

## Introduction
ReachInbox-MailSenseAI is a powerful backend tool designed to parse emails from Google and Outlook, categorize them into "Interested," "Not Interested," or "More Information," and suggest context-based replies. Leveraging OAuth for authentication, CronJob for task scheduling and OpenAI for advanced natural language processing capabilities, this tool streamlines email management and enhances user productivity.

## Video Walkthrough
[Watch the video walkthrough here](https://www.loom.com/share )

## Features
- **Google OAuth Integration:** Users can seamlessly sign up and log in using their Google accounts, enhancing security and convenience.
- **Email Parsing and Categorization:** The tool intelligently parses incoming emails from Google and Outlook, categorizing them into predefined categories for efficient management.
- **Context-Based Replies:** Utilizing OpenAI's natural language processing capabilities, the tool suggests context-based replies tailored to the content of the received emails.
- **Scalable Architecture:** Built with CronJob for message queueing, ensuring scalability and reliability in processing a large volume of emails.
```bash



ReachInbox/
|-- Server
    |-- node_modules/
    |-- src/
    |   |-- config/
    |   |-- controller/
    |   |-- model/
    |   |-- route/
    |   |-- utils/
    |   `-- index.ts
    |-- .env
    |-- .gitignore
    |-- package.json
    |-- package-lock.json
 
```


## Setup Instructions

1. Clone the repository:
    ```
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory with the following content:
    ```
    GMAIL_CLIENT_ID=<your-gmail-client-id>
    GMAIL_CLIENT_SECRET=<your-gmail-client-secret>
    GMAIL_REDIRECT_URI=<your-gmail-redirect-uri>
    GMAIL_REFRESH_TOKEN=<your-gmail-refresh-token>
    OUTLOOK_CLIENT_ID=<your-outlook-client-id>
    OUTLOOK_CLIENT_SECRET=<your-outlook-client-secret>
    OUTLOOK_AUTHORITY=<your-outlook-authority>
    OUTLOOK_REDIRECT_URI=<your-outlook-redirect-uri>
    OPENAI_API_KEY=<your-openai-api-key>
    PORT=3000
    ```

4. Run the application:
    ```
    npm start
    ```

## Usage

1. Connect new email accounts for both Google and Outlook using OAuth.
2. Send an email to these accounts from another account.
3. The tool will read incoming emails, categorize them based on the content, and assign a label.
4. The tool will then suggest an appropriate response based on the content of the email and send out a reply.

## Additional Information

- This tool uses OpenAI's API to understand the context of the emails and generate responses.
- BullMQ is used for task scheduling to handle email processing.
- The application is built using TypeScript for better type safety and maintainability.
