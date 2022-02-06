const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Prevent normal users from typing inside of a channel.')
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
		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
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
			.setDescription('> ***The Tavern** has been put into lockdown.*\n\n> *Please wait patiently while staff work to resolve the situation.*')
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		const publicrow = new MessageActionRow()
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
				interaction.reply({ content: '❌ This channel is already locked.', ephemeral: true });
				return;
			}

			channel.permissionOverwrites.set([
				{
					id: role,
					deny: [Permissions.FLAGS.SEND_MESSAGES],
				},
			]);

			interaction.reply({ embeds: [currentpublicembed], components: [publicrow] });
			client.channels.cache.get('936309022846517248').send({ embeds: [currentstaffembed] });
		}

		if (choice === 'global') {
			
		}
	},
};
