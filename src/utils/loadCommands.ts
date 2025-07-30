import path from 'path';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

export function loadCommands(): Collection<string, any> {
    const commands = new Collection<string, any>();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file)).default;

        if (!command?.data || !command.execute) {
            console.warn(`⚠️ Ungültiger Command in Datei ${file}`);
            continue;
        }

        commands.set(command.data.name, command);
        console.log(`✅ Command geladen: ${command.data.name}`);
    }

    return commands;
}
