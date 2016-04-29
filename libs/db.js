var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var fs = require('fs');
var path = require('path');

exports.setup = function(url, modeldir, callback) {
    var conn = mongoose.connection;

    conn.once('open', function() {
        fs.readdir(modeldir, function(err, files) {
            if(err) return callback(err);

            files.forEach(function(file) {
                var model = require(path.join(modeldir, file));
                model.schema.plugin(timestamps);
                mongoose.model(model.name, model.schema);
            });

            callback(null, conn);
        });
    });

    conn.on('error', function(err) {
        console.log(err);
        callback(err);
    });

    mongoose.connect(url);
};