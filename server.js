// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', function(){
    console.error
    console.log('Connection Failed!');
});
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

//mongoose.connect('mongodb://ubuntu:ubuntu@54.180.8.237:27017/siwi');//, { useMongoClient: true }//52.78.138.9 mongodb://localhost/siwi



const connectOptions = { 
  useMongoClient: true,
  autoReconnect: true
};

const uri = 'mongodb://54.180.8.237:27017/siwi';

mongoose.Promise = global.Promise;

mongoose.connect(uri, connectOptions);

// DEFINE MODEL
var Event = require('./models/event');
var Reply = require('./models/reply');
var Mem = require('./models/mem');
var Feel = require('./models/feel');
var Ecounter = require('./models/ecounter');


// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//console.log('뷰 엔진이 ejs로 설정되었습니다.');

// public 폴더를 static으로 오픈
//app.use('/public', static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 3000;

// [CONFIGURE ROUTER]
var router = require('./routes')(app, Event, Reply, Mem, Feel, Ecounter);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
