const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { getOutlookOAuthClient } = require('../utils/oauth');

exports.getOutlookClient = (accessToken) => {
    const credentialProvider = new TokenCredentialAuthenticationProvider({
        getToken: async () => accessToken,
    });

    return Client.initWithMiddleware({ authProvider: credentialProvider });
};

exports.listMessages = async (client) => {
    const messages = await client.api('/me/messages')
        .filter("isRead eq false")
        .get();

    return messages.value;
};

exports.getMessage = async (client, messageId) => {
    const message = await client.api(`/me/messages/${messageId}`).get();
    return message;
};
