var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var port = process.env.PORT || 8000;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');


/*
  We use multer to save the images temporary to the server in order then
  to use it properly
*/
var multer=require('multer');
const storage = multer.diskStorage({
  destination: './saveImages',
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

/*
  The app running the html file and the socket server for
  the communication between users and server
*/
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* In order to use cross origin sharing */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


app.use(cors());
//Set up the body bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* We include the static parts */
app.use( express.static( __dirname + '/build' ));

/* We response to get request by sending the html file */
app.get("/",function(req,res){
  res.sendFile( path.join( __dirname, 'build', 'index.html' ));
});

/* We response to get request by sending the html file */
app.get("/main",function(req,res){
  res.sendFile( path.join( __dirname, 'build', 'index.html' ));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*--------------------------------- Database Connection --------------------------*/
var dataBaseURL="mongodb://echatzief:fsfbeu1997@ds020228.mlab.com:20228/user_database";
var dbName = 'user_database';

//Mongoose for login and find
var mongoose=require('mongoose');

mongoose.connect(dataBaseURL,{ useNewUrlParser: true });
var conn = mongoose.connection;

/*--------------------------------- Database Schemas ----------------------------*/
var userSchema=new mongoose.Schema({
  username:String,
  password:String
});

var activeUserSchema=new mongoose.Schema({
	username:String,
});

var User = conn.model('User', userSchema);
var activeUser=conn.model('ActiveOne',activeUserSchema);

/*--------------------------------- Requests ------------------------------------*/

/*---------------------------------- Message Schemas ----------------------------*/

/* The message schema used to do stuff at database */
var messageSchema= new mongoose.Schema({
  type:String,
  from:String,
  to:String,
  message:String,
});
var messageModel=conn.model('Message',messageSchema);

var imageSchema = new mongoose.Schema({
  type:String,
  from:String,
  to:String,
  img: { data: Buffer, contentType: String }
})
var imageModel=conn.model('Message',messageSchema);
/*---------------------------------- Message Schemas ----------------------------*/

/* Request to login */
app.post('/login', function(req, res) {
  var user=req.body.username.toString();
  var password=req.body.password.toString();

  /* Show to the console that someone is trying to connect */
  console.log("User: "+user+" : "+password+" attempting to connect.");

  /* Search the database to search if the current user exists */
  var userFound=conn.collection('chat_users').find({'username':user,'password':password});

  /* Turn the result to array for easier use */
  userFound.toArray(function(err,users){
      if(err){
        console.log(err);
      }
      else{

          /*
            If exist make the return status 200 :SUCCESS
            else return 204:FAIL
          */
          var userLength=users.length;
          if(userLength > 0){
            console.log(user+" has successfully logged.");
            res.sendStatus(200);
          }
          else{
            res.sendStatus(204);
          }
      }
  });

});

/* Request to signUp */
app.post('/signUp', function(req, res) {
  var user=req.body.username.toString();
  var password=req.body.password.toString();
  var key=req.body.key.toString();

  /* Show to the console that someone trying to signup */
  console.log("User: "+user+" : "+password+" attempting to Sign Up.");

  /* If has the correct register key */
  if(key==="fortnite"){

      /* Search if someone has the same username */
      var userFound=conn.collection('chat_users').find({'username':user});

      /* Turn to array for easier use */
      userFound.toArray(function(err,users){
          if(err){
            console.log(err);
          }
          else{
              /*
                If the username is available,create account
                else return FAIL.
              */
              var userLength=users.length;
              if(userLength === 0){

                /* Register shema */
                var newUser=new User({
                  username:user,
                  password:password,
                });

                /* Insert the user and response back with SUCCESS */
                conn.collection('chat_users').insert(newUser);
                res.sendStatus(200);
              }
              else{
                res.sendStatus(204);
              }
          }
      });
  }
  else{
    console.log("[ERROR]: Wrong SignUp key.Try again.");
    res.sendStatus(204);
  }
});



/*  Request to Add a Active User */
app.post('/newActive',function(req, res){
	var newActiveUser=req.body.username.toString();
	console.log("New Active User: "+newActiveUser);

  /* Active Now Schema */
  var activeMember=new activeUser({
    username:newActiveUser,
  });

    /* Search if the username has been already added to the active ones */
    var userFound=conn.collection('activeUsers').find({'username':newActiveUser});

    /* Turn the result to array for easier use */
    userFound.toArray(function(err,users){
        if(err){
          console.log(err);
        }
        else{
            /*
              If the username hasnt been added,we add the username to active
              else we do nothing cause the username exists.
            */
            var userLength=users.length;
            if(userLength === 0){
              console.log(newActiveUser+" has Added to Active.");
              conn.collection('activeUsers').insert(activeMember,function(){

                /* After insert send the active ones */
                var userFound=conn.collection('activeUsers').find({});
                userFound.toArray(function(err,users){
                  io.emit('receiveNewUsers',users);
                  console.log("Active Now: "+users.toString());
                });

              });
            }
            else{
              /* After insert send the active ones */
              var userFound=conn.collection('activeUsers').find({});
              userFound.toArray(function(err,users){
                io.emit('receiveNewUsers',users);
                console.log("Active Now: "+users.toString());
              });
            }
        }
    });
    res.sendStatus(200);
});

/* Request to Remove a Active User */
app.post('/removeActive',function(req,res){
  var newActiveUser=req.body.username.toString();
	console.log("Remove Active User: "+newActiveUser);

  /* Active Now Schema */
  var activeMember=new activeUser({
    username:newActiveUser,
  });

    /* Remove the selected user from the active */
    conn.collection('activeUsers').remove({'username':newActiveUser});

     /*
      Inform the front end that the active user have changed to
      refresh the active now list
    */
    var userFound=conn.collection('activeUsers').find({});

    userFound.toArray(function(err,users){

      io.emit('receiveNewUsers',users);
      console.log("Active Now: "+users.toString());
    });
    console.log(newActiveUser+" has Remove from Active.");
    res.sendStatus(200);
});

/*
  Send the mp3 to the client so we can use the sound for notify the usersRouter
  when a message arrives
  */
app.get("/notification",function(req,res){
   console.log("Notification path: "+__dirname+"/audio/cheerful.mp3");
   res.sendFile(__dirname+"/audio/cheerful.mp3");
});

/* Receive a new Message and then redirect to the target */
app.post('/newMessage',function(req,res){

  /* Get the specific fields */
  var fromWho=req.body.whoAmI.toString(); /* The sender of the img or text */
  var toWho=req.body.toWho.toString();    /* The receiver of the img or text */
  var mess=req.body.msg.toString();       /* The message */
  var theType="Message";                  /* Type of content : Image or text */

  console.log(fromWho+" sents to "+toWho+" : "+mess);

  /* Save the requested data to JSON */
  var messageToSave=new messageModel({
    type:theType,
    from:fromWho,
    to:toWho,
    message:mess,
  })

  /* Send the message to all Users */
  if(toWho==='All Users'){
    io.emit('receiveMessages',fromWho+" : "+mess);
    conn.collection('messages').insert(messageToSave);
  }
  /* Send to specific User */
  else{
    io.emit(toWho,fromWho+" : "+mess);
    conn.collection('messages').insert(messageToSave);
  }
  res.sendStatus(200);
});

/* Upload the image to the node js server */
app.post('/uploadImage', upload.single('img'), (req, res) => {
  const file = req.file; // file passed from client
  const meta = req.body; // all other values passed from the client, like name, etc..
  console.log("File: "+file);
  console.log("Name: "+file.filename);
  var fullpath = '/saveImages?'+file.filename;
  var message=fullpath;
  io.emit('receiveImages',message);
  res.sendStatus(200);
});

/* Send the image when it is asked with img tag */
app.get("/saveImages", function(req, res) {
  const fullURL =req.url;
  var splitURL=fullURL.split("?");
  var fileName=splitURL[1].trim();

  console.log("Requested File: "+fileName);
  res.sendFile(__dirname+'/saveImages/'+fileName);
});

/* Start the server for the socket io  */
http.listen(port, function(){
  console.log('App listening  on *:'+port);
});

module.exports = app;
