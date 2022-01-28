module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const Guilds = client.guilds.cache.map((guild) => guild);
		const all_fetchedCommands = await Guilds[0].commands.fetch();
		const warnCommand = all_fetchedCommands.find(command => command.name === 'warn');
		const purgeCommand = all_fetchedCommands.find(command => command.name === 'purge');
		const muteCommand = all_fetchedCommands.find(command => command.name === 'mute');
		const unmuteCommand = all_fetchedCommands.find(command => command.name === 'unmute');
		const smessageCommand = all_fetchedCommands.find(command => command.name === 'servermessage');
		const warnCommandId = warnCommand.permissions.commandId;
		const purgeCommandId = purgeCommand.permissions.commandId;
		const muteCommandId = muteCommand.permissions.commandId;
		const unmuteCommandId = unmuteCommand.permissions.commandId;
		const smessageCommandId = smessageCommand.permissions.commandId;

		const fullPermissions = [
			{
				id: warnCommandId,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: purgeCommandId,
				permissions: [{
					id: '921665022768345139',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: muteCommandId,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: unmuteCommandId,
				permissions: [{
					id: '921665226523430943',
					type: 'ROLE',
					permission: true,
				}],
			},
			{
				id: smessageCommandId,
				permissions: [{
					id: '456927565689389056',
					type: 'USER',
					permission: true,
				}],
			},
		];

		await Guilds[0].commands.permissions.set({ fullPermissions });
		console.log('Successfully set Command Permissions.');
	},
};