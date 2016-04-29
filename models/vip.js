var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'vip',
    schema: new Schema({
        phone: String,
        password: String,
        displayName: String
    })
};