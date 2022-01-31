const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const punishmentLogSchema = mongoose.Schema({
	guildId: reqString,
	issuerId: reqString,
	targetId: reqString,
	punishment: reqString,
	reason: reqString,
	date: reqString,
}, /*{
	timestamps: true,
}*/);

const model = mongoose.model('punishmentlogs', punishmentLogSchema);
module.exports = model;