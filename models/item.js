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
        photo: String,
        amount: {
            big: {
                type: Number,
                default: 0
            },
            small: {
                type: Number,
                default: 0
            }
        }
    })
};