import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    TextChannel,
    ChannelType
} from 'discord.js';

const changelogs = require('../data/changelogs.json');

export default {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Sendet eine Changelog-Ankündigung für eine bestimmte Version')
        .addStringOption(option =>
            option.setName('version')
                .setDescription('Version, z.B. 1.0.0')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const adminRoleId = process.env.ADMIN_ROLE_ID!;
        const announcementChannelId = process.env.CHANGELOG_CHANNEL_ID!;
        const member = interaction.member as GuildMember;

        // Rechte checken
        if (!interaction.memberPermissions?.has('Administrator') &&
            !member.roles.cache.has(adminRoleId)) {
            await interaction.reply({content: '❌ Du hast keine Berechtigung für diesen Befehl.', ephemeral: true});
            return;
        }

        const version = interaction.options.getString('version', true);

        // Changelog suchen
        const changelogEntry = changelogs.find((c: any) => c.version === version);
        if (!changelogEntry) {
            await interaction.reply({content: `❌ Keine Changelog für Version "${version}" gefunden.`, ephemeral: true});
            return;
        }

        // Kanal holen
        const channel = interaction.guild?.channels.cache.get(announcementChannelId);
        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({content: '❌ Changelog-Kanal nicht gefunden oder kein Textkanal.', ephemeral: true});
            return;
        }
        const textChannel = channel as TextChannel;

        // Autor als Rollen-Ping
        const authorRoleId = changelogEntry.author;
        const authorMention = authorRoleId ? `<@&${authorRoleId}>` : 'Unbekannt';

        // Changelog-Text bauen
        const changelogText = changelogEntry.changes.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n');

        // Embed bauen
        const embed = new EmbedBuilder()
            .setTitle(`Changelog Version ${changelogEntry.version} (${changelogEntry.date})`)
            .setDescription(changelogEntry.description)
            .addFields(
                { name: 'Autor', value: authorMention, inline: true },
                { name: 'Änderungen', value: changelogText }
            )
            .setColor('#0099ff')
            .setTimestamp();

        try {
            await textChannel.send({embeds: [embed]});
            await interaction.reply({content: `✅ Changelog für Version ${version} im Kanal ${textChannel.toString()} gesendet.`, ephemeral: true});
        } catch (error) {
            console.error('Fehler beim Senden der Changelog-Ankündigung:', error);
            await interaction.reply({content: '❌ Fehler beim Senden der Changelog-Ankündigung.', ephemeral: true});
        }
    }
};
