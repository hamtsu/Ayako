const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Issue a Warning.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this warning.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this warning.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether this warning should be pubically announced.')
				.setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getUser('target');
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
			.setTitle('User Warning Notification')
			.setDescription(`> <@${target.id}> has recieved a warning for ***${reason}***. `)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });

		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${target.tag} has recieved a warning`)
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();

		const dmembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.guild.name} | You have recieved a Warning`)
			.setDescription(`> **Reason: ${reason}**`)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });

		if (public) {
			await interaction.reply({ embeds: [publicembed] });
			await interaction.followUp({ content: `✅ You've warned **${target.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `✅ You've warned **${target.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}

		client.channels.cache.get('936309022846517248').send({ embeds: [staffembed] });


		target.send({ embeds: [dmembed] }).catch(() => interaction.followUp({ content: `❌ Failed to send a Notification DM to **${target.tag}** as they have their DMs Off.`, ephemeral: true }));


		console.log(`[Punishment] ${interaction.user.tag}: ${target.tag} was warmed with the reason: ${reason}`);
	},
};
