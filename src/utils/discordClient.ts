import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { CustomClient } from '../types/CustomClient';

export const discordClient: CustomClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
}) as CustomClient;

discordClient.commands = new Collection<string, any>();
