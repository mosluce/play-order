var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Stock',
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