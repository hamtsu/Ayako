module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const Guilds = client.guilds.cache.map((guild) => guild);
		const all_fetchedCommands = await Guilds[0].commands.fetch();
		const warnCommand = all_fetchedCommands.find(command => command.name === 'warn').permissions.commandId;
		const purgeCommand = all_fetchedCommands.find(command => command.name === 'purge').permissions.commandId;
		const muteCommand = all_fetchedCommands.find(command => command.name === 'mute').permissions.commandId;
		const unmuteCommand = all_fetchedCommands.find(command => command.name === 'unmute').permissions.commandId;
		const kickCommand = all_fetchedCommands.find(command => command.name === 'kick').permissions.commandId;
		const smessageCommand = all_fetchedCommands.find(command => command.name === 'servermessage').permissions.commandId;
		const historyCommand = all_fetchedCommands.find(command => command.name === 'history').permissions.commandId;
		const lockCommand = all_fetchedCommands.find(command => command.name === 'lock').permissions.commandId;
		const databaseCommand = all_fetchedCommands.find(command => command.name === 'database').permissions.commandId;
		const startgameCommand = all_fetchedCommands.find(command => command.name === 'startgame').permissions.commandId;

		const fullPermissions = [
			{
				id: startgameCommand,
				permissions: [{
					id: '940896080588070942',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: databaseCommand,
				permissions: [{
					id: '456927565689389056',
					type: 'USER',
					permission: true,
				}],
			},
			{
				id: lockCommand,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: historyCommand,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: warnCommand,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: purgeCommand,
				permissions: [{
					id: '921665022768345139',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: muteCommand,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: unmuteCommand,
				permissions: [{
					id: '921665022768345139',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: smessageCommand,
				permissions: [{
					id: '456927565689389056',
					type: 'USER',
					permission: true,
				}],
			},
			{
				id: kickCommand,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
		];

		await Guilds[0].commands.permissions.set({ fullPermissions });
		console.log('Successfully set Command Permissions.');
	},
};