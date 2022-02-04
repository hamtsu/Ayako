const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const reqBoolean = {
	type: Boolean,
	required: true,
};

const punishmentLogSchema = mongoose.Schema({
	guildId: reqString,
	issuerId: reqString,
	targetId: reqString,
	punishment: reqString,
	reason: reqString,
	date: reqString,
	duration: reqString,
	silent: reqString,
	refId: reqString,
	removed: { type: Boolean },
	removedBy: { type: String },
	removedReason: { type: String },
});

const model = mongoose.model('punishmentlogs', punishmentLogSchema);
module.exports = model;