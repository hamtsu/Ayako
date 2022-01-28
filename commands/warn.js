const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a specified user.')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target user.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('choice')
				.setDescription('The Reason for the warning')
				.setRequired(true)
				.addChoice('Toxicity', 'Toxic and Disruptive Behaviour')
				.addChoice('Spam/Flood', 'Spam / Flood in chat')),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const choice = interaction.options.getString('choice');
		await interaction.reply(`> <:Administrator:936160147015880734> **WARNING** - <@${target.id}>\nYou have been warned for **${choice}**.`);
		await interaction.followUp({ content: `✅ You have warned **${target.tag}** for *${choice}*.`, ephemeral: true });
	},
};
