const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows user information.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The target user.')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getMember('user');
		const embed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${user.tag}'s profile`)
			.setImage(user.displayAvatarURL());

		await interaction.reply({ embeds: [embed] });
	},
};