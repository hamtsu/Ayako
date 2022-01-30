const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servermessage')
		.setDescription('Send a Server Setup Message in a specified channel.')
		.setDefaultPermission(false)
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The Message to send.')
				.setRequired(true)
				.addChoice('Verification Message', 'verify')
				.addChoice('Rules Message', 'rules')
				.addChoice('Age Role Selctor', 'ageroles'))
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
				.setDescription('> By clicking accept below you confirm that you have read and agreed to our Rules.');
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
		else if (message === 'ageroles') {
			const embed = new MessageEmbed()
				.setColor('WHITE')
				.setTitle('Location Roles')
				.setDescription('> Select the role that best indicates where you\'re from.');
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('locselector')
						.setPlaceholder('Select your location')
						.setMinValues(1)
						.setMaxValues(1)
						.addOptions([
							{
								label: 'Asia',
								value: 'as',
								description: 'You are from Asia.',
							},
							{
								label: 'North America',
								value: 'na',
								description: 'You are from North America.',
							},
							{
								label: 'South America',
								value: 'sa',
								description: 'You are from South America.',
							},
							{
								label: 'Europe',
								value: 'eu',
								description: 'You are from Europe.',
							},
							{
								label: 'Africa',
								value: 'af',
								description: 'You are from Africa.',
							},
							{
								label: 'Oceania',
								value: 'oce',
								description: 'You are from Oceania.',
							},
						]),
				);


			if (client.channels.cache.has(channel)) {
				client.channels.cache.get(channel).send({ embeds: [embed], components: [row] });
				interaction.reply({ content: '✅ Successfully sent Age Selector to channel.', ephemeral: true });
			}
			else {
				interaction.reply({ content: '❌ That channel could not be found inside of this guild.', ephemeral: true });
			}
		}
	},
};