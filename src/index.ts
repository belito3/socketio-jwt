import * as express from "express";
import { AppConfiguration } from "./app.config";
import { ApiService } from "./service/api.service";
import * as jwt from "jsonwebtoken";

const app = express();
app.set("port", process.env.PORT || AppConfiguration.port);

let http = require('http').Server(app);

// set up socket.io and bind it to our
// http server.
let io = require('socket.io')(http)

let apiService = new ApiService();

app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});
// middleware vertify jwt
// io.use((socket, next) => {
//     if (socket.handshake.query && socket.handshake.query.token){
//         let token = socket.handshake.query.token;
//         //console.log(token);
//         jwt.verify(socket.handshake.query.token, AppConfiguration.SECRET, (err, decoded) => {
         
//         if(err) {
//             console.log("error");
//             return new Error('Authentication error');
//         } else {
//             console.log(decoded);
//             socket.decoded = decoded;
//             next();
//         }
        
//       });
//     }   
// });

io.on('connection', (socket) => {

    // Log whenever a user connects
    console.log('user connected with id = '+ socket.id);

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(){
        console.log('user disconnected id = ' + socket.id);
        //console.log(socket.UserName);
    });


    // SysUser login
    socket.on('login', (msg) => {
        msg = JSON.parse(msg);
        socket.UserName = msg.UserName;
        
        console.log(`Username: ${socket.UserName} login with id = ${socket.id}.`);

        // SysUser close web browser
        socket.on('disconnect', () => {

            // update active=0 in table sysUser
            apiService.logout(socket.UserName).subscribe(
                (data) => {
                    
                    // console.log(data.response);
                    if (data.body.StatusCode === 200) { // POST succeeded...
                        let data = {
                            "StatusCode": 200,
                            "Message" : "User disconnected",
                            "UserName": socket.UserName
                            }
                        io.emit('user-disconnect', data);
            
                        console.log(`Username ${socket.UserName} disconnect with id = ${socket.id}.`);
                    }
                },
                (err) => console.error(err) // Show error in console
            );
        })
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('message', (message) => {
        console.log("Message Received: " + message);
        io.emit('message', {type:'new-message', text: message});    
    });

    // Change from component device-register component
    socket.on('device-change', (msg) => {
        console.log("Message Received: " + msg);
        io.emit('device-change', msg);
    });
});

// Initialize our websocket server on port 5000
http.listen(AppConfiguration.port, () => {
    console.log('WS Server started on port 5000');
});