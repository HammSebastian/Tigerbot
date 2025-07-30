declare global {
    // Adjust the type as needed for your discordClient
    var discordClient: typeof import('../utils/discordClient').discordClient;
}
export {};