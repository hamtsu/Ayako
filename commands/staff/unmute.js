const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Staff Command: Remove a Timeout')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this removal')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this removal.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether the removal should be publically announced.')
				.setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getMember('target');
		const targetuser = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');
		const public = interaction.options.getBoolean('public');

		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
		}

		const publicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('User Timeout Lifted')
			.setDescription(`> *<@${target.id}>'s mute has been manually removed.*`)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });

		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${targetuser.tag}'s timeout has been removed`)
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Removed by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();

		if (!target.isCommunicationDisabled()) {
			interaction.reply({ content: `❌ **${targetuser.tag}** doesn't have an active timeout.`, ephemeral: true });
			return;
		}

		target.timeout(null, reason);

		if (public) {
			await interaction.reply({ embeds: [publicembed] });
			await interaction.followUp({ content: `✅ You've removed **${targetuser.tag}**'s timeout with the reason: *${reason}*.`, ephemeral: true });
		}

		client.channels.cache.get('936309022846517248').send({ embeds: [staffembed] });

		if (!public) {
			await interaction.reply({ content: `✅ You've removed **${targetuser.tag}**'s timeout with the reason: *${reason}*.`, ephemeral: true });
		}

	},
};