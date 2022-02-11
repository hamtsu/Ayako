const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const userXpSchema = mongoose.Schema({
	_id: reqString,
	experience: reqString,
});

module.exports = mongoose.model('user-experience', userXpSchema);