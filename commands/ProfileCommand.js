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
		const target = interaction.options.getMember('user');
		const targetuser = interaction.options.getUser('user');
		const embed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${targetuser.tag}'s profile`)
			.setImage(target.displayAvatarURL());

		await interaction.reply({ embeds: [embed] });
	},
};