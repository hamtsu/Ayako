const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const config = require('../../configuration/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge a specified amount of messages in a channel.')
		.setDefaultPermission(false)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to delete.')
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(true)),
	async execute(interaction, client) {
		const amount = interaction.options.getInteger('amount');
		const stafflogs = config.channels.staffLogs;
		interaction.channel.bulkDelete(amount, true);
		await wait(1000);
		await interaction.reply({ content: `✅ Successfully purged ${amount} messages in this channel.` });

		// Embed that is sent in staff channels
		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.user.tag} has purged #${interaction.channel.name}`)
			.setDescription(`**Amount:** ${amount} message(s)`)
			.setTimestamp();
		client.channels.cache.get(stafflogs).send({ embeds: [staffembed] });

		await wait(2000);
		await interaction.deleteReply();

		console.log(`[Purge] ${interaction.user.tag}: has purged #${interaction.channel.name} and removed ${amount} messages.`);
	},
};
