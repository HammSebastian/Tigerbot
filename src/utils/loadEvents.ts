import path from 'path';
import { readdirSync } from 'fs';
import { Client } from 'discord.js';

export function loadEvents(client: Client): void {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file)).default;

        if (!event?.name || !event.execute) {
            console.warn(`⚠️ Ungültiges Event in Datei ${file}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(`✅ Event geladen: ${event.name}`);
    }
}
