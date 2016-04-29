var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'stock',
    schema: new Schema({
        item: {
            type: Schema.Types.ObjectId,
            ref: 'item'
        },
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