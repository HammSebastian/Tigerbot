import {GuildMember, GuildMemberRoleManager, SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('announcement')
        .setDescription('Sendet eine Ankündigung im Ankündigungs-Kanal.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Titel der Ankündigung')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Nachrichtentext')
                .setRequired(true))
        .addMentionableOption(option =>
            option.setName('mention')
                .setDescription('Optional: Rolle oder User erwähnen')
                .setRequired(false)),
    async execute(interaction: any) {
        const adminRoleId = process.env.ADMIN_ROLE_ID;
        const member = interaction.member as GuildMember;

        if (!interaction.memberPermissions?.has('Administrator') &&
            !member.roles.cache.has(adminRoleId!)) {
            await interaction.reply({content: '❌ Du hast keine Berechtigung für diesen Befehl.', ephemeral: true});
            return;
        }

        const title = interaction.options.getString('title', true);
        const message = interaction.options.getString('message', true);
        const mention = interaction.options.getMentionable('mention');

        const announceChannelId = process.env.ANNOUNCEMENT_CHANNEL_ID;
        if (!announceChannelId) {
            await interaction.reply({ content: '❌ Ankündigungskanal nicht konfiguriert.', ephemeral: true });
            return;
        }

        const channel = interaction.client.channels.cache.get(announceChannelId);
        if (!channel || !channel.isTextBased()) {
            await interaction.reply({ content: '❌ Ankündigungskanal nicht gefunden oder ungültig.', ephemeral: true });
            return;
        }

        const mentionText = mention ? `<@${mention.id}>` : '';
        const embed = {
            color: 0x0099ff,
            title: title,
            description: message,
            timestamp: new Date().toISOString()
        };

        await channel.send({ content: mentionText, embeds: [embed] });
        await interaction.reply({ content: '✅ Ankündigung gesendet.', ephemeral: true });
    }
};
