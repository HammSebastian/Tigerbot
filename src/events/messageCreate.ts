import { Events, Message } from 'discord.js';

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message) {
        if (message.author?.bot) return;
        const channel = message.channel;
        if (message.content.toLowerCase() === '!ping' && 'send' in channel) {
            channel.send('🏓 Pong!');
        }
    },
};
