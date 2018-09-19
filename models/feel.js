var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feelSchema = new Schema({
    pid: String,
    device_id: String,
    like: { type: Boolean, default: 0},//, default: 0  
    noLike: { type: Boolean},
    cheer: { type: Boolean},
    sad: { type: Boolean, default: 0},
    anger: { type: Boolean, default: 0}
});

module.exports = mongoose.model('feel', feelSchema);