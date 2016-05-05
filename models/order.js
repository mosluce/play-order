var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Order',
    schema: new Schema({
        vip: {
            type: Schema.Types.ObjectId,
            ref: 'Vip'
        },
        list: [{
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Item'
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
        }],
        datetime: Date,
        canceled: {
            type: Boolean,
            default: false
        },
        finished: {
            type: Boolean,
            default: false
        }
    })
};