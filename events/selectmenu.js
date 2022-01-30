module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (interaction.customId === 'locselector') {
			const member = interaction.member;
			const rolelist = new Array('937005416053870603', '937186571747201077', '937186614696882186', '937186651061518366', '937186676801949747', '937186707063849021');

			for (const role of rolelist) {
				if (interaction.member.roles.cache.has(role)) {
					member.roles.remove(role);
				}
			}

			if (interaction.values[0] === 'as') {
				interaction.member.roles.add('937005416053870603');
				interaction.reply({ content: '✅ Successfully added the "Asia" role to you.', ephemeral: true });
			}
			else if (interaction.values[0] === 'na') {
				interaction.member.roles.add('937186571747201077');
				interaction.reply({ content: '✅ Successfully added the "North America" role to you.', ephemeral: true });
			}
			else if (interaction.values[0] === 'sa') {
				interaction.member.roles.add('937186614696882186');
				interaction.reply({ content: '✅ Successfully added the "South America" role to you.', ephemeral: true });

			}
			else if (interaction.values[0] === 'eu') {
				interaction.member.roles.add('937186651061518366');
				interaction.reply({ content: '✅ Successfully added the "Europe" role to you.', ephemeral: true });

			}
			else if (interaction.values[0] === 'af') {
				interaction.member.roles.add('937186676801949747');
				interaction.reply({ content: '✅ Successfully added the "Africa" role to you.', ephemeral: true });

			}
			else if (interaction.values[0] === 'oce') {
				interaction.member.roles.add('937186707063849021');
				interaction.reply({ content: '✅ Successfully added the "Oceania" role to you.', ephemeral: true });

			}
		}
	},
};