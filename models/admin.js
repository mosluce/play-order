var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    name: 'Admin',
    schema: new Schema({
        account: String,
        password: String,
        master: {
            type: Boolean,
            default: false
        }
    })
};