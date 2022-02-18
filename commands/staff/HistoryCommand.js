const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');
const moment = require('moment');

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

		const retrieve = new MessageEmbed()
			.setColor('2F3137')
			.setDescription(`**Retrieving ${targetuser.tag}'s punishments from database**\nPlease wait patiently while Ayako searches the Database.\n\`\`\`ㅤ\`\`\``);
		const retrieveRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('loading')
					.setLabel('Fetching...')
					.setStyle('SECONDARY')
					.setDisabled(true),
			);
		await interaction.reply({ embeds: [retrieve], components: [retrieveRow] });

		const punishstatus = (
			`> ***Timed-out:** ${target.isCommunicationDisabled()}*`
		);

		await mongo().then(async (mongoose) => {
			try {
				const results = await punishmentLogSchema.find({
					guildId: interaction.guild.id,
					targetId: target.id,
				});

				const punishments = new Array();

				if (!results.length) {
					punishments.push('> *No logged Punishments could be found.*');
				}
				else {
					for (const result of results) {
						let punishment = `• ➢ __**${result.punishment}**__ ***(${result.silent})***`;
						let removedBy = '';
						let time;

						if (result.punishment === 'Timeout') {
							// Calculate time information
							const today = Date.now();
							const until = result.until;
							let expired;
							let expiredMessage = `<t:${moment(until).unix()}:R>`;
							if (new Date(today).getTime() >= new Date(until).getTime()) {
								expired = true;
								expiredMessage = '``Expired``';
							}

							// Decide what state the punishment is currently in
							if (result.removed) {
								punishment = `• <:Error:939392259160416307> __**${result.punishment}**__ ***(${result.silent})***`;
								removedBy = `> \n> <:Administrator:936160147015880734>  —  **REMOVED**\n> ➥ **Removed by** <@${result.removedBy}> ** for:** *${result.removedReason}*\n> \n`;
								time = `\n> **Removed at:** <t:${moment(result.updatedAt).unix()}:f>\n> **Issued at:** <t:${moment(result.createdAt).unix()}:f>`;
							}
							else if (expired) {
								punishment = `• <:Warning:939441727851343872> __**${result.punishment}**__ ***(${result.silent})***`;
								time = `\n> **Issued at:** <t:${moment(result.createdAt).unix()}:f>\n> **Duration:** ${result.duration} | ${expiredMessage}`;
							}
							else {
								punishment = `• <:Notify:939432612282372148> __**${result.punishment}**__ ***(${result.silent})***`;
								time = `\n> **Issued at:** <t:${moment(result.createdAt).unix()}:f>\n> **Duration:** ${result.duration} | ${expiredMessage}`;
							}

							// Add punishmentlog to the Embed
							punishments.push(`${punishment}\n${removedBy}> **ID:** *\`\`${result._id}\`\`*\n> **Reason:** ${result.reason}\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`${time}\n`);
						}

						// Punishments that don't require state deciding
						if (result.punishment === 'Warning') {
							punishments.push(`• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** ${result.reason}\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> **Issued at:** <t:${moment(result.createdAt).unix()}:f>\n`);
						}
						if (result.punishment === 'Kick') {
							punishments.push(`• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** ${result.reason}\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> **Issued at:** <t:${moment(result.createdAt).unix()}:f>\n`);
						}
					}
				}

				// Credit: https://stackoverflow.com/a/60693028/18126581
				const backId = 'back';
				const backButton = new MessageButton({
					style: 'PRIMARY',
					label: 'Previous Page',
					customId: backId,
				});
				const forwardId = 'forward';
				const forwardButton = new MessageButton({
					style: 'PRIMARY',
					label: 'Next Page',
					customId: forwardId,
				});

				let currentPage = 1;

				const generateEmbed = async start => {
					const current = punishments.slice(start, start + 4).join('');
					const embed = new MessageEmbed()
						.setColor('2F3137')
						.setTitle(`Punishment Information (${targetuser.tag})`)
						.setDescription(`**Current Status**\n${punishstatus}\n\n**Prior Punishments**\n${current}`)
						.setTimestamp()
						.setFooter({ text: `Current Page: ${currentPage}`, iconURL: `${target.displayAvatarURL()}` });
					return embed;
				};

				const canFitOnOnePage = punishments.length <= 4;
				const embedMessage = await interaction.editReply({
					embeds: [await generateEmbed(0)],
					components: canFitOnOnePage ? [new MessageActionRow({ components: [forwardButton.setDisabled(true)] })] : [new MessageActionRow({ components: [forwardButton] })] });
				if (canFitOnOnePage) return;

				const collector = embedMessage.createMessageComponentCollector({
					filter: ({ user }) => user.id === interaction.user.id,
				});

				let currentIndex = 0;
				collector.on('collect', async message => {
					message.customId === backId ? (currentIndex -= 4, currentPage = currentPage - 1) : (currentIndex += 4, currentPage = currentPage + 1);
					await message.update({
						embeds: [await generateEmbed(currentIndex)],
						components: [
							new MessageActionRow({
								components: [
									...(currentIndex ? [backButton] : []),
									...(currentIndex + 4 < punishments.length ? [forwardButton] : []),
								],
							}),
						],
					});
				});
			}
			finally {
				mongoose.connection.close();
			}
		});

	},
};
