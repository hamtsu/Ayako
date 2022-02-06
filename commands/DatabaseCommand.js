const { SlashCommandBuilder } = require('@discordjs/builders');
const mongo = require('../events/database/Mongo');
const punishmentLogSchema = require('../events/database/schemas/PunishmentLogSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Access database options.')
		.addSubcommand(subcommand =>
			subcommand.setName('purge')
				.setDescription('Delete all documents in a specified collection.')
				.addStringOption(option => option.setName('collection').setDescription('The collection to delete all documents in.').setRequired(true).addChoice('Punishment-Logs', 'punishment-logs'))
				.addStringOption(option => option.setName('punishmenttype').setDescription('The type of punishment to purge from the database.').setRequired(true).addChoice('All Punishments', 'all').addChoice('Warnings', 'warnings').addChoice('Kicks', 'kicks').addChoice('Mutes', 'mutes'))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'purge') {
			const collection = interaction.options.getString('collection');
			const type = interaction.options.getString('punishmenttype');

			await mongo().then(async (mongoose) => {
				try {
					if (collection === 'punishment-logs') {
						if (type === 'all') {
							const remove = await punishmentLogSchema.deleteMany({});
							await interaction.reply({ content: `✅ Successfully purged **${remove.deletedCount}** documents from *punishment-logs*. (All Punishments)`, ephemeral: true });
						}
						else if (type === 'warnings') {
							const remove = await punishmentLogSchema.deleteMany({ punishment: 'Warning' });
							await interaction.reply({ content: `✅ Successfully purged **${remove.deletedCount}** documents from *punishment-logs*. (Warnings)`, ephemeral: true });
						}
						else if (type === 'kicks') {
							const remove = await punishmentLogSchema.deleteMany({ punishment: 'Kick' });
							await interaction.reply({ content: `✅ Successfully purged **${remove.deletedCount}** documents from *punishment-logs*. (Kicks)`, ephemeral: true });
						}
						else if (type === 'mutes') {
							const remove = await punishmentLogSchema.deleteMany({ punishment: 'Timeout' });
							await interaction.reply({ content: `✅ Successfully purged **${remove.deletedCount}** documents from *punishment-logs*. (Mutes)`, ephemeral: true });
						}
					}
				}
				finally {
					mongoose.connection.close();
				}
			});
		}
	},
};
