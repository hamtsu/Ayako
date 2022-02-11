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
	duration: { type: String },
	silent: reqString,
	_id: reqString,
	removed: { type: Boolean },
	removedBy: { type: String },
	removedReason: { type: String },
	until: { type: Date },
}, {
	timestamps: true,
});

module.exports = mongoose.model('punishment-logs', punishmentLogSchema);
