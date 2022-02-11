const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const game = require('../configuration/game.json');
const mongo = require('../events/database/Mongo');
const UserXpSchema = require('./../events/database/schemas/UserXPScehma');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startgame')
		.setDescription('Start a game.')
		.setDefaultPermission(false)
		.addStringOption(option =>
			option.setName('game')
				.setDescription('The game to start.')
				.setRequired(true)
				.addChoice('Quiz', 'quiz')),
	async execute(interaction) {
		const gametype = interaction.options.getString('game');

		const seconds = 1;
		const startingCounter = 4;
		let counter = startingCounter;

		const countdownembed = new MessageEmbed()
			.setColor('WHITE')
			.setDescription('🎲 A game is starting in **5** second(s).');
		await interaction.reply({ embeds: [countdownembed] });

		const getText = () => {
			return new MessageEmbed()
				.setColor('WHITE')
				.setDescription(`🎲 A game is starting in **${counter}** second(s).`);
		};

		const updateCounter = async () => {
			await interaction.editReply({ embeds: [getText()] });
			counter -= seconds;

			if (counter <= 0) {
				if (gametype === 'quiz') {
					const item = game.quiz[Math.floor(Math.random() * game.quiz.length)];
					const filter = response => {
						return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
					};

					const gameembed = new MessageEmbed()
						.setColor('WHITE')
						.setTitle(item.question)
						.setDescription('> Answer this quiz correctly to win XP!');

					const currentDate = Date.now();
					let won = false;
					let winner = '';
					await interaction.editReply({ embeds: [gameembed] }, { fetchReply: true })
						.then(() => {
							interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
								.then(collected => {
									const ms = Date.now() - currentDate;
									const time = ms.toString().substring(0, 1) + '.' + ms.toString().substring(1, 4);
									const winnerembed = new MessageEmbed()
										.setTitle(`${item.question}`)
										.setColor('WHITE')
										.setDescription(`${collected.first().author} is the **Winner**!\n> They answered in *\`\`${time}\`\` seconds*.`);
									interaction.deleteReply();
									collected.first().reply({ embeds: [winnerembed] });
									winner = collected.first().author.id;
									won = true;

								})
								.catch(collected => {
									const embed = new MessageEmbed()
										.setTitle(`${item.question}`)
										.setColor('WHITE')
										.setDescription('> Nobody was able to answer the quiz in time.');
									interaction.editReply({ embeds: [embed] });
								});
						});
					if (won) {
						await mongo().then(async (mongoose) => {
							try {
								const results = await UserXpSchema.find({
									_id: winner,
								});

								await new UserXpSchema({
									_id: winner,
									experience: results.experience + 10,
								}).save();
								console.log(results.experience);
							}
							finally {
								mongoose.connection.close();
							}
						});
					}
				}
			}
			if (counter > 0) {
				setTimeout(() => {
					updateCounter();
				}, 1000 * seconds);
			}
		};

		updateCounter();


	},
};