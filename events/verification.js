module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.customId === 'accept') {
			if (interaction.member.roles.cache?.has('936244650841362472')) {
				interaction.reply({ content: 'You seem to already be verified, please select "Contact Staff" if you believe this is an error.', ephemeral: true });
			}
			else {
				interaction.member.roles.add('936244650841362472');
				interaction.reply({ content: 'Thanks for verifying, we hope you enjoy your stay!', ephemeral: true });
			}
		}
	},
};