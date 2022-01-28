const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servermessage')
		.setDescription('Send a Server Setup Message in a specified channel.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The Message to send.')
				.setRequired(true)
				.addChoice('Verification Message', 'verify')
				.addChoice('Rules Message', 'rules'))
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('Channel ID for the server message to be sent in.')
				.setRequired(true)),
	async execute(interaction, client) {
		const message = interaction.options.getString('message');
		const channel = interaction.options.getString('channel');

		if (message === 'verify') {
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('accept')
						.setLabel('Accept')
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId('contact')
						.setLabel('Contact Staff')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setURL('https://discord.com/channels/921657537336574002/921670008621400094/936240488384692244')
						.setLabel('Rules')
						.setStyle('LINK'),
				);
			const embed = new MessageEmbed()
				.setColor('WHITE')
				.setTitle('Please accept our rules')
				.setDescription('> Click the checkmark below to verify that you have read and agreed to our rules.');
			client.channels.cache.get(channel).send({ embeds: [embed], components: [row] });
			await interaction.reply({ content: 'Verification message sent to channel', ephemeral: true });
		}
		else if (message === 'rules') {
			const embed = new MessageEmbed()
				.setColor('WHITE')
				.setTitle('Server Rules')
				.setDescription('*To be written*');
			client.channels.cache.get(channel).send({ embeds: [embed] });
			await interaction.reply({ content: 'Rules message sent to channel', ephemeral: true });
		}
	},
};