const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');
const moment = require('moment');
const { ButtonPaginator } = require('@psibean/discord.js-pagination');

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

				const punishments = new Array();

				// let reply = '';
				if (!results.length) {
					punishments.push('> *No logged Punishments could be found.*');
				}
				else {
					for (const result of results) {
						let punishment = `• ➢ __**${result.punishment}**__ ***(${result.silent})***`;
						let removedby = ' ';
						let time = ' ';

						if (result.punishment === 'Timeout') {
							// Calculate time information
							const today = Date.now();
							const until = result.until;
							let expired = false;
							let expiresin = '';
							let expires = '';
							expires = until - today;
							// Conversion - Credit: https://stackoverflow.com/a/27065690
							const days = Math.floor(expires / (24 * 60 * 60 * 1000));
							const daysms = expires % (24 * 60 * 60 * 1000);
							const hours = Math.floor(daysms / (60 * 60 * 1000));
							const hoursms = expires % (60 * 60 * 1000);
							const minutes = Math.floor(hoursms / (60 * 1000));
							const minutesms = expires % (60 * 1000);
							const sec = Math.floor(minutesms / 1000);
							expiresin = `${days}d ${hours}h ${minutes}m ${sec}s`;
							if (today.getTime() >= until.getTime()) {
								expired = true;
							}

							// Decide what state the punishment is currently in
							if (result.removed) {
								punishment = `• <:Error:939392259160416307> __**${result.punishment}**__ ***(${result.silent})***`;
								removedby = `> \n> <:Administrator:936160147015880734>  —  **REMOVED**\n> ➥ **Removed by** <@${result.removedBy}> ** for:** *${result.removedReason}*\n> \n`;
								time = `\n> **Time Information:** \n> \`\`\`Removed at: ${moment(result.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}\n> Issued at: ${moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\`\``;
							}
							else if (expired) {
								punishment = `• <:Warning:939441727851343872> __**${result.punishment}**__ ***(${result.silent})***`;
								time = `\n> **Time Information:** \n> \`\`\`Expired at: ${moment(until).format('MMMM Do YYYY, h:mm:ss a')}\n> Issued at: ${moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\`\``;
							}
							else {
								punishment = `• <:Notify:939432612282372148> __**${result.punishment}**__ ***(${result.silent})***`;
								time = `\n> **Time Information:** \n> \`\`\`Expires in: ${expiresin}\n> Issued at: ${moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\`\``;
							}

							// Add punishmentlog to the Embed
							punishments.push(`${punishment}\n${removedby}> **Reason:** *${result.reason}*\n> **Duration:** *${result.duration}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Punishment ID:** *\`\`${result._id}\`\`*${time}\n`);
						}

						// Punishments that don't require state deciding
						if (result.punishment === 'Warning') {
							punishments.push(`• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** *${result.reason}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> \`\`\`${moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\`\`\n`);
						}
						if (result.punishment === 'Kick') {
							punishments.push(`• ➢ __**${result.punishment}**__ ***(${result.silent})***\n> **Reason:** *${result.reason}*\n> **Issued by:** <@${result.issuerId}> \`\`(${result.issuerId})\`\`\n> **Date Issued:**\n> \`\`\`${moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\`\`\`\n`);
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

				const generateEmbed = async start => {
					const current = punishments.slice(start, start + 4).join('');
					const embed = new MessageEmbed()
						.setColor('WHITE')
						.setTitle(`Punishment Information (${targetuser.tag})`)
						.setDescription(`**Current Status**\n${punishstatus}\n\n**Prior Punishments**\n${current}`)
						.setTimestamp()
						.setFooter({ text: `${targetuser.tag}'s Punishment History`, iconURL: `${target.displayAvatarURL()}` });
					return embed;
				};

				const canFitOnOnePage = punishments.length <= 4;
				const embedMessage = await interaction.editReply({
					embeds: [await generateEmbed(0)],
					components: canFitOnOnePage ? [] : [new MessageActionRow({ components: [forwardButton] })] });
				if (canFitOnOnePage) return;

				const collector = embedMessage.createMessageComponentCollector({
					filter: ({ user }) => user.id === interaction.user.id,
				});

				let currentIndex = 0;
				collector.on('collect', async message => {
					message.customId === backId ? (currentIndex -= 4) : (currentIndex += 4);
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
