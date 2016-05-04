var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'User',
    schema: new Schema({
        phone: String,
        password: String,
        displayName: String
    })
};