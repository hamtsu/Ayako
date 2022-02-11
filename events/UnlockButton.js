const { Permissions, MessageEmbed } = require('discord.js');
const config = require('../configuration/config.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isButton()) {
			const role = interaction.guild.roles.resolve('936244650841362472');
			const channel = interaction.guild.channels.cache.get(interaction.channel.id);
			let rank = 'Issued by a Moderator';
			let image = 'https://i.imgur.com/dg61aHi.png';

			if (!interaction.member.roles.cache.has('921665226523430943')) {
				interaction.reply({ content: '<:Error:939392259160416307> Only staff members can unlock channels.', ephemeral: true });
				return;
			}

			if (interaction.member.roles.cache?.has('921665022768345139')) {
				rank = 'Issued by an Administrator';
				image = 'https://i.imgur.com/OyyT7dm.png';
			}

			if (interaction.customId === 'unlock') {

				if (interaction.channel.permissionsFor(role).has('SEND_MESSAGES') === true) {
					interaction.reply({ content: '<:Error:939392259160416307> This channel doesn\'t seem to be locked.', ephemeral: true });
					return;
				}

				channel.permissionOverwrites.set([
					{
						id: role,
						allow: [Permissions.FLAGS.SEND_MESSAGES],
					},
				]);

				const embed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle('Channel Unlocked')
					.setDescription('> *The lock on this channel has been lifted.*\n> *We sincerely apologise for any inconveniences.*')
					.setTimestamp()
					.setFooter({ text: `${rank}`, iconURL: `${image}` });
				const staffembed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`#${interaction.channel.name} was unlocked`)
					.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
					.setTimestamp();

				interaction.reply({ embeds: [embed] });
				client.channels.cache.get('936309022846517248').send({ embeds: [staffembed] });
			}
			if (interaction.customId === 'global') {
				const channels = config.publicChannelIds;
				const embed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle('Channel Unlocked')
					.setDescription('> *Server lockdown has been lifted.*\n> *We sincerely apologise for any inconveniences.*')
					.setTimestamp()
					.setFooter({ text: `${rank}`, iconURL: `${image}` });
				const staffembed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle('Server Lockdown was Lifted')
					.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
					.setTimestamp();

				for (const ch of channels) {
					const channel1 = interaction.guild.channels.cache.get(ch);
					channel1.permissionOverwrites.set([
						{
							id: role,
							allow: [Permissions.FLAGS.SEND_MESSAGES],
						},
					]);
					channel1.send({ embeds: [embed] });
				}
				interaction.reply({ embeds: [staffembed] });
			}
		}
	},
};