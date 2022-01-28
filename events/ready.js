module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Successfully logged into ${client.user.tag}.`);
		client.user.setActivity('♡');
		client.user.setStatus('dnd');
	},
};