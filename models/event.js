var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    pid: String,
    title: String,    
    subtitle: String,
    host: String,
    content: String,
    content_detail: String,    
    date: { type: Date, default: Date.now  },
    startTime: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 },    
    place: Object,    
    certificate: String,
    confirm: { type: Boolean, default: 0 }, 
    regdate: { type: Date, default: Date.now  },
    editdate: { type: Date, default: Date.now  },
    rpl_count: { type: Number, default: 0  },
    like: { type: Number, default: 0  },
    noLike_count: { type: Number, default: 0  },
    
    cheer_count: { type: Number, default: 0  },
    sad_count: { type: Number, default: 0  },
    anger_count: { type: Number, default: 0  }
    
});

module.exports = mongoose.model('event', eventSchema);