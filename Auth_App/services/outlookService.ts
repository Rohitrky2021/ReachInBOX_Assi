import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { getOutlookOAuthClient } from '../utils/oauth';

export const getOutlookClient = (accessToken: string) => {
    const credentialProvider = new TokenCredentialAuthenticationProvider({
        getToken: async () => accessToken,
    });

    return Client.initWithMiddleware({ authProvider: credentialProvider });
};

export const listMessages = async (client: Client) => {
    const messages = await client.api('/me/messages')
        .filter("isRead eq false")
        .get();

    return messages.value;
};

export const getMessage = async (client: Client, messageId: string) => {
    const message = await client.api(`/me/messages/${messageId}`).get();
    return message;
};
