const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{

    console.log("Connected :",socket.id);

    socket.on("join_room",(room)=>{

        socket.join(room);

        console.log("Joined Room :",room);

    });

    socket.on("send_message",(data)=>{

        socket.to(data.room).emit("receive_message",data);

    });

});

server.listen(3000,()=>{
    console.log("Socket Running...");
});