import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const HELP_CHANNEL_ID = '1324749076981481489';
const ALLOWED_CHANNEL_ID='1324749076981481489';

const helpMessage = `
📖 **Hilfe Übersicht**

👋 Hallo <@%USER_ID%>, hier sind die verfügbaren Befehle:

• \`/help\` — Zeigt diese Hilfe an
• \`/ping\` — Prüft die Bot-Verbindung (Antwort: Pong 🏓)
• \`/info\` — Zeigt Informationen zum Server
• \`/stats\` — Zeigt Statistiken zum Bot

💡 **Tipps:**
- Nutze \`/\` und tippe den Befehl, Discord schlägt dir automatisch vor
- Bei Fragen kontaktiere einen Admin

---

🔗 [Besuche unsere Website](https://sebastianthetech.com/tigerbot)
`;

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zeigt Hilfeinfos an'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
            await interaction.reply({
                content: `❌ Dieser Befehl darf nur im <#${ALLOWED_CHANNEL_ID}> ausgeführt werden.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const helpChannel = interaction.guild?.channels.cache.get(HELP_CHANNEL_ID);
        if (helpChannel?.isTextBased()) {
            const personalizedHelp = helpMessage.replace('%USER_ID%', interaction.user.id);
            await helpChannel.send(personalizedHelp);
            await interaction.editReply('✅ Hilfe wurde im Hilfe-Channel gepostet.');
        } else {
            await interaction.editReply('❌ Hilfe-Channel nicht gefunden.');
        }
    }
};
