var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'History',
    schema: new Schema({
        item: String,
        amount: Number,
        vip: String
    })
};