var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memSchema = new Schema({
    device_id: Number,
    pid: Number,   
    like: { type: Boolean, default: 'F'  },   
    cheer: { type: Boolean, default: 'F'  },
    sad: { type: Boolean, default: 'F'  },
    anger: { type: Boolean, default: 'F'  },
    noLike: { type: Boolean, default: 'F'  }    
});

module.exports = mongoose.model('mem', memSchema);