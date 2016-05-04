var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Order',
    schema: new Schema({
        vip: {
            type: Schema.Types.ObjectId,
            ref: 'vip'
        },
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