const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const config = require('../../configuration/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Prevent normal users from typing inside of a channel.')
		.setDefaultPermission(false)
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('Where should this lockdown be applied?')
				.setRequired(true)
				.addChoice('Global', 'global')
				.addChoice('Current Channel', 'current'))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this lock.')
				.setRequired(true)),
	async execute(interaction, client) {
		const choice = interaction.options.getString('channel');
		const reason = interaction.options.getString('reason');
		const stafflogs = config.channels.staffLogs;

		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
		}

		if (config.channels.publicChannelIds.length <= 0) {
			interaction.reply({ content: '<:Error:939392259160416307> Cannot lock the server as you haven\'t specified public channels in configuration.', ephemeral: true });
			return;
		}

		// Embed that is sent publically
		const currentpublicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('Channel Lockdown')
			.setDescription('> *This channel has been locked to only staff members.*\n> *Please wait patiently while staff work to resolve the situation.*')
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		const globalpublicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('Server Lockdown')
			.setDescription('> ***The Tavern** has been put into lockdown.*\n> *Please wait patiently while staff work to resolve the situation.*')
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		const publiccurrentrow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://discord.com/channels/921657537336574002/921670008621400094/936240488384692244')
					.setLabel('Why is this happening?')
					.setStyle('LINK'),
				new MessageButton()
					.setCustomId('unlock')
					.setLabel('Unlock')
					.setStyle('SUCCESS')
					.setEmoji('🔓'),
			);
		const publicglobalrow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://discord.com/channels/921657537336574002/921670008621400094/936240488384692244')
					.setLabel('Why is this happening?')
					.setStyle('LINK'),
			);
		const staffglobalrow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('global')
					.setLabel('Remove Lockdown')
					.setStyle('SUCCESS')
					.setEmoji('🔓'),
			);
		// Embed that is sent in staff channels
		const currentstaffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`#${interaction.channel.name} was locked`)
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();
		const globalstaffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('The server was locked')
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();

		const role = interaction.guild.roles.resolve('936244650841362472');
		const channel = interaction.guild.channels.cache.get(interaction.channel.id);

		if (choice === 'current') {
			if (interaction.channel.permissionsFor(role).has('SEND_MESSAGES') === false) {
				interaction.reply({ content: '❌ This channel is already locked, or normal users don\t have permission to speak here.', ephemeral: true });
				return;
			}

			channel.permissionOverwrites.set([
				{
					id: role,
					deny: [Permissions.FLAGS.SEND_MESSAGES],
				},
			]);

			interaction.reply({ embeds: [currentpublicembed], components: [publiccurrentrow] });
			client.channels.cache.get(stafflogs).send({ embeds: [currentstaffembed] });
		}
		else if (choice === 'global') {
			const channels = config.channels.publicChannelIds;
			for (const ch of channels) {
				const channel1 = interaction.guild.channels.cache.get(ch);
				channel1.permissionOverwrites.set([
					{
						id: role,
						deny: [Permissions.FLAGS.SEND_MESSAGES],
					},
				]);
				channel1.send({ embeds: [globalpublicembed], components: [publicglobalrow] });
			}
			interaction.reply({ content: '✅ Successfully intiated server lockdown, visit <#936309022846517248> to remove the lock.', ephemeral: true });
			client.channels.cache.get(stafflogs).send({ embeds: [globalstaffembed], components: [staffglobalrow] });
		}

	},
};
