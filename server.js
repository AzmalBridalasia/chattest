const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bridal Asia Chat Socket Server Running...");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    console.log("✅ Connected :", socket.id);

    // ===========================
    // LOGIN
    // ===========================
    socket.on("login", (user_id) => {

        socket.join("user_" + user_id);

        console.log(`User ${user_id} joined personal room user_${user_id}`);

    });


    // ===========================
    // JOIN CHAT ROOM
    // ===========================
    socket.on("join_room", (room_id) => {

        socket.join(String(room_id));

        console.log(`Socket ${socket.id} joined Room ${room_id}`);

    });


    // ===========================
    // SEND MESSAGE
    // ===========================
    socket.on("send_message", (data) => {

        console.log("Message :", data);

        // Chat screen open users
        io.to(String(data.room)).emit("receive_message", data);

        // Receiver notification (even if room not open)
        io.to("user_" + data.receiver_id).emit("receive_message", data);

    });


    // ===========================
    // TYPING
    // ===========================
    socket.on("typing", (data) => {

        socket.to(String(data.room)).emit("typing", data);

    });


    socket.on("stop_typing", (data) => {

        socket.to(String(data.room)).emit("stop_typing", data);

    });


    socket.on("disconnect", () => {

        console.log("❌ Disconnected :", socket.id);

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(`🚀 Socket Server Running On Port ${PORT}`);

});
