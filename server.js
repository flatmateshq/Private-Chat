var app = require("express")();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require("socket.io")(http);


app.use(require("express").static('data'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});


// creating array of users.
var users=[];

// This is auto initiated event when Client connects to Your Machien.  
io.on('connection',function(socket){  
    
    //Storing users into array as an object
    socket.on('user name',function(user_name){
      users.push({id:socket.id,user_name:user_name});
      len=users.length;
      len--;
      //Sending th user Id and List of users
      io.emit('user entrance',users,users[len].id); 
    });

    //Sending message to Specific user
    socket.on('send msg',function(data_server){
      socket.broadcast.to(data_server.id).emit('get msg',{msg:data_server.msg,id:data_server.id,name:data_server.name});
    });

    //Removig user when user left the chatroom
    socket.on('disconnect',function(){
      for(var i=0;i<users.length;i++){
        if(users[i].id==socket.id){
          users.splice(i,1); //Removing single user
        }
      }
      io.emit('exit',users); //sending list of users
    });
});


http.listen(81,function(){
    console.log("Listening on 81");
});
