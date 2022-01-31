const mongoose = require('mongoose');
const { dbToken } = require('../../configuration/config.json');

module.exports = async () => {
	await mongoose.connect(dbToken);
	return mongoose;
};