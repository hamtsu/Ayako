const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isButton()) {
			if (interaction.customId === 'accept') {
				if (interaction.member.roles.cache?.has('936244650841362472')) {
					interaction.reply({ content: 'You seem to already be verified, please select **"Contact Staff"** if you believe this is an error.', ephemeral: true });
				}
				else {
					interaction.member.roles.add('936244650841362472');
					interaction.reply({ content: 'Verification Successful, thanks!', ephemeral: true });
					console.log(`[Verification] ${interaction.user.tag} has successfully verified.`);

					// Welcome Message
					const imagelist = new Array('https://i.imgur.com/CuJVZ9v.gif', 'https://i.imgur.com/G18TCyB.gif', 'https://i.imgur.com/saj0HCO.gif', 'https://i.imgur.com/rT220IH.gif');
					const randomimage = Math.floor(Math.random() * imagelist.length);
					const image = imagelist[randomimage];

					const msglist = new Array('Tip: Try to avoid communicating with hamtsu ;)', 'We hope you enjoy your stay!', 'Have a great time!');
					const randommsg = Math.floor(Math.random() * msglist.length);
					const msg = msglist[randommsg];

					const embed = new MessageEmbed()
						.setColor('WHITE')
						.setTitle('Welcome to The Tavern')
						.setDescription(`> Welcome <@${interaction.member.id}>!\n> ${msg}\n\`\`\`Total Members: ${interaction.guild.memberCount}\`\`\``)
						.setThumbnail(interaction.member.displayAvatarURL())
						.setImage(image)
						.setFooter({ text: `${interaction.user.tag} has joined`, iconURL: interaction.member.displayAvatarURL() })
						.setTimestamp();
					interaction.guild.channels.cache.get('936640166385287188').send({ content: `<@${interaction.user.id}>`, embeds: [embed] });
				}
			}
		}

	},
};