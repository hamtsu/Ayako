const config = require('../configuration/config.json');
const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const punishmentLogSchema = require('./database/schemas/PunishmentLogSchema');
const mongo = require('./database/Mongo');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		const target = message.member;
		const targetuser = message.author;
		const content = message.content.replace(/\s+/g, '').toLowerCase();
		const filteredWords = config.muteableWords;
		const stafflogs = config.channels.staffLogs;
		const ID = (Math.random() + 1).toString(36).substring(7);
		if (message.channel.type === 'DM') return;

		for (const word of filteredWords) {
			if (content.includes(word)) {
				if (target.roles.cache?.has('921665226523430943') || target.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
				const reason = `Mutable word found in message: ${word}`;

				// Public Embed
				const embed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle('User Auto-Timeout Notification')
					.setDescription(`> *<@${target.id}> has been temporarily auto-muted.*`)
					.addFields(
						{ name: 'Reason', value: 'Mutable word found in message.', inline: true },
						{ name: 'Duration', value: '6 Hours', inline: true },
					)
					.setTimestamp()
					.setFooter({ text: `Issued by Ayako | rId: ${ID}`, iconURL: `${client.user.displayAvatarURL()}` });
				// Embed that is sent into staff channels
				const staffembed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`${targetuser.tag} was auto timed-out for 6 Hours`)
					.setDescription(`**Reason:** *${reason}*\n**Reference ID:** *${ID}*`)
					.setFooter({ text: 'Issued by Ayako', iconURL: `${client.user.displayAvatarURL()}` })
					.setTimestamp();
				// Embed that is sent to target through DM
				const dmembed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`${message.guild.name} | You have been temporarily timed-out`)
					.setDescription(`> **Reference ID: ${ID}** `)
					.addFields(
						{ name: 'Reason', value: reason, inline: true },
						{ name: 'Duration', value: '6 Hours', inline: true },
					)
					.setTimestamp()
					.setFooter({ text: 'Issued by Ayako', iconURL: `${client.user.displayAvatarURL()}` });
				const dmrow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setURL('https://discord.com/channels/921657537336574002/921670008621400094/936240488384692244')
							.setLabel('Appeal this Punishment')
							.setStyle('LINK'),
					);

				target.send({ embeds: [dmembed], components: [dmrow] }).catch(() => message.channel.send(`❌ Failed to send a Notification DM to **${target.tag}** as they have their DMs Off.`));

				message.delete();
				target.timeout(21600000, reason);

				message.channel.send({ embeds: [embed] });
				client.channels.cache.get(stafflogs).send({ embeds: [staffembed] });

				const guildId = message.guild.id;
				const issuerId = '936117232579260447';
				const targetId = target.id;
				const punishment = 'Timeout';
				const duration = '6 Hour(s)';
				const _id = ID;

				await mongo().then(async (mongoose) => {
					try {
						await new punishmentLogSchema({
							guildId,
							issuerId,
							targetId,
							punishment,
							reason,
							duration,
							silent: 'Automatic',
							_id,
							removed: false,
							removedBy: 'N/A',
							removedReason: 'N/A',
							until: target.communicationDisabledUntil,
						}).save();
					}
					finally {
						mongoose.connection.close();
					}
				});

				break;
			}
		}


	},
};