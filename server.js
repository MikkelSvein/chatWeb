const express = require("express");
const app = express();

// socket
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 5e6, // 5 MB — necesario para imágenes en base64
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.emit("messages", data);
  });
});

// inicio del servidor
http.listen(3000, () => {
  console.log("Server Running");
});