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

//mongoose.connect('mongodb://ec2-52-78-138-9.ap-northeast-2.compute.amazonaws.com/local');
mongoose.connect('mongodb://localhost/local');

// DEFINE MODEL
var Event = require('./models/event');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
console.log('뷰 엔진이 ejs로 설정되었습니다.');

// public 폴더를 static으로 오픈
//app.use('/public', static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 80;

// [CONFIGURE ROUTER]
var router = require('./routes')(app, Event);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});