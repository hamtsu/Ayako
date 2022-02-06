const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const punishmentLogSchema = require('../../events/database/schemas/PunishmentLogSchema');
const mongo = require('../../events/database/Mongo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Issue a Warning.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this warning.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this warning.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether this warning should be pubically announced.')
				.setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');
		const public = interaction.options.getBoolean('public');

		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
		}

		// Embed that is sent publically
		const publicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('User Warning Notification')
			.setDescription(`> <@${target.id}> has recieved a warning for ***${reason}***. `)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		// Embed that is sent in staff channels
		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${target.tag} has recieved a warning`)
			.setDescription(`**Reason:** *${reason}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();
		// Embed that is sent to target through DM
		const dmembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.guild.name} | You have recieved a Warning`)
			.setDescription(`> **Reason: ${reason}**`)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });

		if (public) {
			await interaction.reply({ embeds: [publicembed] });
			await interaction.followUp({ content: `✅ You've warned **${target.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `✅ You've warned **${target.tag}** with the reason: *${reason}*.`, ephemeral: true });
		}

		client.channels.cache.get('936309022846517248').send({ embeds: [staffembed] });

		target.send({ embeds: [dmembed] }).catch(() => interaction.followUp({ content: `❌ Failed to send a Notification DM to **${target.tag}** as they have their DMs Off.`, ephemeral: true }));

		console.log(`[Punishment] ${interaction.user.tag}: ${target.tag} was warmed with the reason: ${reason}`);

		const guildId = interaction.guild.id;
		const issuerId = interaction.member.id;
		const targetId = target.id;
		const punishment = 'Warning';
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
