var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Item',
    schema: new Schema({
        name: String,
        price: {
            big: Number,
            small: Number
        },
        photo: String
    })
};