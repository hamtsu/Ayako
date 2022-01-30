const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Shows necessary information for debugging.'),
	async execute(interaction, client) {
		const embed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('Bot Information')
			.setDescription(`**PING**\n> Websocket heartbeat: \`\`${client.ws.ping}ms\`\``);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
