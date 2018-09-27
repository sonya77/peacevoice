var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ecounter = new Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('ecounter', ecounter);