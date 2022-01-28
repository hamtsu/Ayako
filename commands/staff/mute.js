const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
// const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Issue a Timeout.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target for this timeout')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for this timeout.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('durationtype')
				.setDescription('The duration type for this timeout.')
				.setRequired(true)
				.addChoice('Minutes', 'Minute(s)')
				.addChoice('Hours', 'Hour(s)')
				.addChoice('Days', 'Day(s)'))
		.addIntegerOption(option =>
			option.setName('durationlength')
				.setDescription('The duration length for this timeout.')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100))
		.addBooleanOption(option =>
			option.setName('public')
				.setDescription('Whether this timeout should be publically announced.')
				.setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getMember('target');
		const targetuser = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason');
		const dtype = interaction.options.getString('durationtype');
		const dlength = interaction.options.getInteger('durationlength');
		const public = interaction.options.getBoolean('public');
		const ID = (Math.random() + 1).toString(36).substring(7);
		let length = 300000;
		let rank = 'Issued by a Moderator';
		let image = 'https://i.imgur.com/dg61aHi.png';
		// let nick = `[Timeout] ${target.displayName}`;

		if (dtype === 'Minute(s)') {
			length = dlength * 60000;
		}
		else if (dtype === 'Hour(s)') {
			length = dlength * (60000 * 60);
		}
		else if (dtype === 'Day(s)') {
			length = dlength * 24 * 60 * 60 * 1000;
		}

		if (interaction.member.roles.cache?.has('921665022768345139')) {
			rank = 'Issued by an Administrator';
			image = 'https://i.imgur.com/OyyT7dm.png';
		}

		const publicembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle('User Timeout Notification')
			.setDescription(`> *<@${target.id}> has recieved a temporary mute.*\n\n`)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Duration', value: `${dlength} ${dtype}`, inline: true },
			)
			.setTimestamp()
			.setFooter({ text: `${rank} | rID: ${ID}`, iconURL: `${image}` });

		const staffembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${targetuser.tag} was temporarily timed-out for ${dlength} ${dtype}`)
			.setDescription(`**Reason:** *${reason}*\n**Reference ID:** *${ID}*`)
			.setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
			.setTimestamp();

		const dmembed = new MessageEmbed()
			.setColor('WHITE')
			.setTitle(`${interaction.guild.name} | You have been temporarily timed-out`)
			.setDescription(`> **Reference ID: ${ID}** `)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Duration', value: `${dlength} ${dtype}`, inline: true },
			)
			.setTimestamp()
			.setFooter({ text: `${rank}`, iconURL: `${image}` });
		const dmrow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://discord.com/channels/921657537336574002/921670008621400094/936240488384692244')
					.setLabel('Appeal this Punishment')
					.setStyle('LINK'),
			);

		if (targetuser.id === '456927565689389056') {
			await interaction.reply({ content: `❌ You can't punish **${targetuser.tag}**!`, ephemeral: true });
			return;
		}

		if (target.isCommunicationDisabled()) {
			await interaction.reply({ content: `❌ **${targetuser.tag}** already has an active timeout.`, ephemeral: true });
			return;
		}

		target.timeout(length, reason);
		// target.setNickname(`${nick}`, 'Timeout');

		if (public) {
			await interaction.reply({ embeds: [publicembed] });
			await interaction.followUp({ content: `✅ You've temporarily muted **${targetuser.tag}** for **${dlength} ${dtype}** with the reason: *${reason}*.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `✅ You've temporarily muted **${targetuser.tag}** for **${dlength} ${dtype}** with the reason: *${reason}*.`, ephemeral: true });
		}

		client.channels.cache.get('936309022846517248').send({ embeds: [staffembed] });

		target.send({ embeds: [dmembed], components: [dmrow] }).catch(() => interaction.followUp({ content: `❌ Failed to send a Notification DM to **${target.tag}** as they have their DMs Off.`, ephemeral: true }));

		console.log(`[Punishment] ${interaction.user.tag}: ${targetuser.tag} was temp muted for ${dlength} ${dtype} with the reason: ${reason}`);

	},
};