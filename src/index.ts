import { discordClient } from './utils/discordClient';
import { loadEvents } from './utils/loadEvents';
import { loadCommands } from './utils/loadCommands';
import { startTwitchListener } from './listeners/twitchListener';

(global as any).discordClient = discordClient;

discordClient.commands = loadCommands();
loadEvents(discordClient);

discordClient.once('ready', async () => {
    console.log(`✅ Logged in als ${discordClient.user?.tag}`);
    await startTwitchListener();
});

discordClient.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = discordClient.commands.get(interaction.commandName);
    if (!command) {
        await interaction.reply({ content: '❌ Unbekannter Befehl.', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Fehler beim Ausführen des Befehls.', ephemeral: true });
    }
});

discordClient.login(process.env.DISCORD_TOKEN);