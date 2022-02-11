const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');
const config = require('../../configuration/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Issue a Kick.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this kick.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this kick.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether this kick should be announced publically.')
				.setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getMember('target');
		const targetuser = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');
		const public = interaction.options.getBoolean('public');
		const stafflogs = config.channels.staffLogs;
		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
		}

		// Embed that is sent publically
		const publicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('User Kick Notification')
			.setDescription(`> *<@${target.id}> has been kicked from the server for **${reason}**.*\n\n`)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		// Embed that is sent in staff channels
		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${targetuser.tag} was kicked from the server`)
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();
		// Embed that is sent to target through DM
		const dmembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.guild.name} | You have been kicked from the server`)
			.setDescription(`> **Reason: ${reason}** `)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });

		if (target.kickable) {
			await target.send({ embeds: [dmembed] }).catch(() => interaction.followUp({ content: `❌ Failed to send a Notification DM to **${targetuser.tag}** as they have their DMs Off.`, ephemeral: true }));
			target.kick(reason);
		}
		else {
			await interaction.reply({ content: '❌ You can\'t kick this user!' });
			return;
		}

		if (public) {
			await interaction.reply({ embeds: [publicembed] });
			await interaction.followUp({ content: `✅ You've kicked **${targetuser.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `✅ You've kicked **${targetuser.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}

		client.channels.cache.get(stafflogs).send({ embeds: [staffembed] });

		console.log(`[Punishment] ${interaction.user.tag}: ${targetuser.tag} was kicked with the reason: ${reason}`);

		const guildId = interaction.guild.id;
		const issuerId = interaction.member.id;
		const targetId = target.id;
		const punishment = 'Kick';
		let silent = 'Public';

		if (!public) {
			silent = 'Silent';
		}

		await mongo().then(async (mongoose) => {
			try {
				await new punishmentLogSchema({
					guildId,
					issuerId,
					targetId,
					punishment,
					reason,
					silent,
					_id: (Math.random() + 1).toString(36).substring(4),
					removed: false,
				}).save();
			}
			finally {
				mongoose.connection.close();
			}
		});

	},
};
