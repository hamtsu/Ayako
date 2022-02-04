const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Shows punishment logs for a specifc user.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('❌ If you can\'t find the user, they may be banned?')
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getMember('target');
		const targetuser = interaction.options.getUser('target');

		// await interaction.reply(`**Retrieving ${targetuser.tag}'s punishments from database...**`);
		const retrieve = new MessageEmbed()
			.setColor('WHITE')
			.setDescription(`\`\`\`Retrieving ${targetuser.tag}'s punishments from database...\`\`\``);
		await interaction.reply({ embeds: [retrieve] });

		const punishstatus = (
			`> ***Timed-out:** ${target.isCommunicationDisabled()}*`
		);

		await mongo().then(async (mongoose) => {
			try {
				const results = await punishmentLogSchema.find({
					guildId: interaction.guild.id,
					targetId: target.id,
				});

				let reply = '';

				if (!results.length) {
					reply = '> *No logged Punishments could be found.*';
				}

				else {
					for (const result of results) {
						let punishment = `• ➢ __**${result.punishment}**__ ***(${result.silent})***`;
						let removedby = '';

						if (result.removed) {
							punishment = `• ➢ [R] __**${result.punishment}**__ ***(${result.silent})***`;
							removedby = `> <:Administrator:936160147015880734>  —  **REMOVED**\n> ➥ **Removed By:** <@${result.removedBy}>\n> ➥ **Added Note:** *${result.removedReason}*\n`;
						}

						if (result.punishment === 'Warning') {
							reply += `• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** *${result.reason}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> \`\`\`${result.date}\`\`\`*Punishment ID: ${result.refId}*\n`;
						}
						if (result.punishment === 'Kick') {
							reply += `• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** *${result.reason}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> \`\`\`${result.date}\`\`\`*Punishment ID: ${result.refId}*\n`;
						}
						if (result.punishment === 'Timeout') {
							reply += `${punishment}\n> **Reason:** *${result.reason}*\n> **Duration:** *${result.duration}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> \`\`\`${result.date}\`\`\`*Punishment ID: ${result.refId}*\n> \n${removedby}`;
						}
					}
				}
				const embed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Punishment Information (${targetuser.tag})`)
					.setDescription(`**Current Status**\n${punishstatus}\n\n**Prior Punishments**\n${reply}`);
				interaction.editReply({ embeds: [embed] });
			}
			finally {
				mongoose.connection.close();
			}
		});

	},
};
