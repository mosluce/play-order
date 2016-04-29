var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'item',
    schema: new Schema({
        name: String,
        price: {
            big: Number,
            small: Number
        },
        photo: String
    })
};