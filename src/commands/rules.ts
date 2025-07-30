import {ChatInputCommandInteraction, GuildMember, GuildMemberRoleManager, SlashCommandBuilder} from "discord.js";

const RULES_CHANNEL_ID='1324749076981481486';
const ALLOWED_CHANNEL_ID='1324749076981481486';

const rulesMessage = `
    # :scroll: Discord-Server-Regeln :scroll:

1. **:heart_hands: Respektiere andere Mitglieder**  
   Behandle alle Mitglieder mit Respekt. Belästigung, Beleidigungen, Rassismus oder Diskriminierung jeglicher Art sind streng verboten.

2. **:no_entry_sign: Keine Werbung**  
   Werbe nicht ohne Erlaubnis für deinen eigenen Server, Produkte oder Websites. Spamming ist ebenfalls verboten.

3. **:underage: Keine NSFW-Inhalte**  
   Pornografische oder anstößige Inhalte sind nicht gestattet. Bitte halte den Inhalt geeignet für alle Altersgruppen.

4. **:x: Kein Spam**  
   Spame nicht in den Kanälen, in Nachrichten oder bei anderen Mitgliedern. Dazu gehören auch unnötige Nachrichten und Emojis.

5. **:computer: Verbot von Hacking- oder Exploit-Inhalten**  
   Das Teilen von illegalen Programmen oder Exploits ist strengstens verboten.

6. **:loud_sound: Kein Rauschen oder laute Störungen**  
   Achte darauf, dass deine Mikrofon- und Audioqualität gut ist. Vermeide laute Hintergrundgeräusche.

7. **:scales: Keine Diskussionen über Politik oder Religion**  
   Halte dich von hitzigen politischen oder religiösen Diskussionen fern, um Konflikte zu vermeiden.

8. **:video_game: Bleibe beim Thema**  
   Verhalte dich im jeweiligen Kanal themenbezogen. Nutze die entsprechenden Kanäle für spezifische Themen.

9. **:octagonal_sign: Behalte die Privatsphäre**  
   Teile keine persönlichen Informationen von dir oder anderen ohne deren Zustimmung.

10. **:busts_in_silhouette: Sei freundlich und hilfsbereit**  
    Unterstütze neue Mitglieder und trage zu einer positiven Atmosphäre bei.
    `;


export default {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Postet die Regeln im Regeln-Channel'),
    async execute(interaction: ChatInputCommandInteraction) {
        const adminRoleId = process.env.ADMIN_ROLE_ID;
        const member = interaction.member as GuildMember;

        if (!interaction.memberPermissions?.has('Administrator') &&
            !member.roles.cache.has(adminRoleId!)) {
            await interaction.reply({content: '❌ Du hast keine Berechtigung für diesen Befehl.', ephemeral: true});
            return;
        }

        if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
            await interaction.reply({
                content: `❌ Dieser Befehl darf nur im <#${ALLOWED_CHANNEL_ID}> ausgeführt werden.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const rulesChannel = interaction.guild?.channels.cache.get(RULES_CHANNEL_ID);
        if (rulesChannel?.isTextBased()) {
            await rulesChannel.send(rulesMessage);
            await interaction.editReply('✅ Regeln wurden im Regeln-Channel gepostet.');
        } else {
            await interaction.editReply('❌ Regeln-Channel nicht gefunden.');
        }
    }
};
