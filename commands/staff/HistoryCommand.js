const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Shows punishment logs for a specifc user.')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this command.')
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getMember('target');
		const targetuser = interaction.options.getUser('target');

		await interaction.reply(`**Retrieving ${targetuser.tag}'s punishments from database...**`);

		await mongo().then(async (mongoose) => {
			try {
				const results = await punishmentLogSchema.find({
					guildId: interaction.guild.id,
					targetId: target.id,
				});

				let reply = '';
				for (const result of results) {
					reply += `__**${result.punishment}**__\n**Reason:** ${result.reason}\n**Issued by:** <@${result.issuerId}>\n**Timestamp**\n> ${result.date}`;
				}

				const embed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Punishment History for ${targetuser.tag}`)
					.setDescription(reply);

				await interaction.editReply({ embeds: [embed] });
			}
			finally {
				mongoose.connection.close();
			}
		});

	},
};
