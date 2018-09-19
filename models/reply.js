var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
    pid: String,
    device_id: String,
    text: String,    
    regdate: { type: Date, default: Date.now  },
    editdate: { type: Date, default: Date.now  },
    edited: Boolean,   
    
    like: { type: Number, default: 0  },
    noLike: { type: Number, default: 0  }    
});

module.exports = mongoose.model('reply', replySchema);