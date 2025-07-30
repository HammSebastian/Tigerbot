import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'path';
import { readdirSync } from 'fs';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;  // Für Tests am besten auf einen Dev-Server
const TOKEN = process.env.DISCORD_TOKEN!;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

const commandNames = new Set<string>();

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default;

    if (!command?.data || typeof command.data.name !== 'string') {
        console.warn(`⚠️ Ungültiger Command in Datei ${file}`);
        continue;
    }

    if (commandNames.has(command.data.name)) {
        console.error(`❌ Duplicate Command-Name gefunden: ${command.data.name} in Datei ${file}`);
        continue; // Überspringen
    }

    commandNames.add(command.data.name);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`🚀 Starte Command Deployment...`);

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log('✅ Commands erfolgreich registriert.');
    } catch (error) {
        console.error(error);
    }
})();
