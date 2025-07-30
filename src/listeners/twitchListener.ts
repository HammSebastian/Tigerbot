import fs from 'fs/promises';
import path from 'path';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { EmbedBuilder, TextChannel } from 'discord.js';

declare global {
    var discordClient: any;
}

const statusFile = path.join(__dirname, 'twitchStatus.json');

async function loadStatus(): Promise<boolean> {
    try {
        const data = await fs.readFile(statusFile, 'utf-8');
        const obj = JSON.parse(data);
        return obj.wasLive === true;
    } catch {
        return false; // Datei nicht gefunden oder Fehler => assume offline
    }
}

async function saveStatus(wasLive: boolean) {
    try {
        await fs.writeFile(statusFile, JSON.stringify({ wasLive }), 'utf-8');
    } catch (error) {
        console.error('❌ Fehler beim Speichern des Twitch Live-Status:', error);
    }
}

export async function startTwitchListener() {
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
    const channelName = process.env.TWITCH_CHANNEL_NAME!;
    const discordChannelId = process.env.TWITCH_DISCORD_CHANNEL_ID!;
    const discordBot = global.discordClient;

    if (!discordBot) {
        console.error('❌ Discord Client noch nicht initialisiert!');
        return;
    }

    const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
    const apiClient = new ApiClient({ authProvider });

    const user = await apiClient.users.getUserByName(channelName);
    if (!user) {
        console.error(`❌ Twitch-User "${channelName}" nicht gefunden.`);
        return;
    }

    console.log(`✅ Twitch-Listener aktiv für ${user.displayName} (${user.id})`);

    let wasLive = await loadStatus();

    // Direkt initial prüfen, damit nicht 60s gewartet werden muss
    const initialStream = await apiClient.streams.getStreamByUserId(user.id);
    if (initialStream && !wasLive) {
        wasLive = true;
        await saveStatus(true);

        const discordChannel = discordBot.channels.cache.get(discordChannelId) as TextChannel | undefined;
        if (discordChannel) {
            const pingRoleId = process.env.TWITCH_PING_ROLE_ID;
            const mention = pingRoleId ? `<@&${pingRoleId}>` : '';

            const embed = new EmbedBuilder()
                .setColor('#9146FF')
                .setTitle(`🔴 ${user.displayName} ist jetzt live!`)
                .setURL(`https://twitch.tv/${user.name}`)
                .setDescription(`📺 **${initialStream.title}**`)
                .setThumbnail(user.profilePictureUrl)
                .addFields(
                    { name: 'Kanal', value: `[Hier klicken](https://twitch.tv/${user.name})`, inline: true },
                    { name: 'Jetzt einschalten', value: '🎉 Viel Spaß beim Zuschauen!', inline: true }
                )
                .setTimestamp();

            await discordChannel.send({ content: mention, embeds: [embed] });
        }
    }

    setInterval(async () => {
        try {
            const stream = await apiClient.streams.getStreamByUserId(user.id);

            if (stream && !wasLive) {
                wasLive = true;
                await saveStatus(true);

                console.log(`🎥 ${user.displayName} ist jetzt live: ${stream.title}`);

                const discordChannel = discordBot.channels.cache.get(discordChannelId) as TextChannel | undefined;
                if (discordChannel) {
                    const pingRoleId = process.env.TWITCH_PING_ROLE_ID;
                    const mention = pingRoleId ? `<@&${pingRoleId}>` : '';

                    const embed = new EmbedBuilder()
                        .setColor('#9146FF')
                        .setTitle(`🔴 ${user.displayName} ist jetzt live!`)
                        .setURL(`https://twitch.tv/${user.name}`)
                        .setDescription(`📺 **${stream.title}**`)
                        .setThumbnail(user.profilePictureUrl)
                        .addFields(
                            { name: 'Kanal', value: `[Hier klicken](https://twitch.tv/${user.name})`, inline: true },
                            { name: 'Jetzt einschalten', value: '🎉 Viel Spaß beim Zuschauen!', inline: true }
                        )
                        .setTimestamp();

                    await discordChannel.send({ content: mention, embeds: [embed] });
                } else {
                    console.warn(`⚠️ Discord Channel mit ID ${discordChannelId} nicht gefunden.`);
                }
            }

            if (!stream && wasLive) {
                wasLive = false;
                await saveStatus(false);

                console.log(`🔴 ${user.displayName} ist offline.`);
            }
        } catch (error) {
            console.error('❌ Fehler beim Twitch-Listener Loop:', error);
        }
    }, 60_000); // alle 60 Sekunden prüfen
}
