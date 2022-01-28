module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Successfully logged into ${client.user.tag}.`);
		client.user.setActivity('♡');
		client.user.setStatus('dnd');

		const Guilds = client.guilds.cache.map((guild) => guild);
		const all_fetchedCommands = await Guilds[0].commands.fetch();
		const purgeCommand = all_fetchedCommands.find(command => command.name === 'purge');
		const purgeCommandId = purgeCommand.permissions.commandId;
	},
};