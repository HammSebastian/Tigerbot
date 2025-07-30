import { Client } from 'discord.js';
import {startTwitchListener} from "../listeners/twitchListener";

export default {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        global.discordClient = client;
        console.log(`✅ Logged in as ${client.user?.tag}`);

        await startTwitchListener();
    },
};