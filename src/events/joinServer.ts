import {EmbedBuilder, Events, GuildMember, TextChannel} from 'discord.js';

const WELCOME_CHANNEL_ID ='1324749076981481488';

export default {
    name: 'guildMemberAdd',
    once: false,
    async execute(member: GuildMember) {
        const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID) as TextChannel | undefined;
        if (!channel || !channel.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Blau, kannst du anpassen
            .setTitle(`👋 Willkommen auf dem Server, ${member.user.username}!`)
            .setDescription(`Schön, dass du hier bist, <@${member.id}>! 🎉\nBitte lies dir die Regeln durch und viel Spaß.`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Erster Schritt', value: 'Stell dich kurz vor 👋', inline: true },
                { name: 'Server-Regeln', value: '[Hier klicken](https://deinserverlink/zur-regeln)', inline: true },
                { name: 'Support', value: 'Bei Fragen wende dich an <@AdminID>' }
            )
            .setFooter({ text: 'TigerBot begrüßt dich!', iconURL: member.guild.iconURL() ?? undefined })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    },
};