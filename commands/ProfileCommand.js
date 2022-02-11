const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongo = require('../events/database/Mongo');
const UserXpSchema = require('./../events/database/schemas/UserXPScehma');

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

		await mongo().then(async (mongoose) => {
			try {
				const results = await UserXpSchema.find({
					_id: target.id,
				});
				if (results.experience) {
					const embed = new MessageEmbed()
						.setColor('WHITE')
						.setTitle(`${targetuser.tag}'s profile`)
						.setDescription(`Experience: ${results.experience}`)
						.setImage(target.displayAvatarURL());
					await interaction.reply({ embeds: [embed] });
				}
				else {
					const embed = new MessageEmbed()
						.setColor('WHITE')
						.setTitle(`${targetuser.tag}'s profile`)
						.setDescription('Experience: 0')
						.setImage(target.displayAvatarURL());
					await interaction.reply({ embeds: [embed] });
				}
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};