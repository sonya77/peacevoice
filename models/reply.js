var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reply = new Schema({
    pid: Number,
    writer: String,
    text: String,    
    regdate: { type: Date, default: Date.now  },
    editdate: { type: Date, default: Date.now  },
    edited: Boolean,   
    
    like: { type: Number, default: 0  },
    noLike_count: { type: Number, default: 0  }    
});

module.exports = mongoose.model('event', eventSchema);