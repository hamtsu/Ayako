const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Shows server information.'),
	async execute(interaction) {
		const serverIcon = interaction.guild.iconURL();
		const embed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.guild.name}`)
			.setDescription(`> **Total Member Count** \`\`${interaction.guild.memberCount}\`\`\n> **Created at** \`\`${interaction.guild.createdAt}\`\`\n\n> **Verification Level** \`\`${interaction.guild.verificationLevel}\`\`\n> **Explicit Content Filter Level** \`\`${interaction.guild.explicitContentFilter}\`\`\n> **MFA Level** \`\`${interaction.guild.mfaLevel}\`\`\n> **NSFW Level** \`\`${interaction.guild.nsfwLevel}\`\``)
			.setThumbnail(serverIcon);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};