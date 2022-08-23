require("dotenv").config();
const next = require("next");
const express = require("express");
const path = require("path");
const { parse } = require("cookie");
const { Server } = require("socket.io");

const db = require("./helpers/db");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

db.connect();
nextApp.prepare().then(() => {
  const app = express();
  const server = require("http").createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });
  io.use((socket, next) => {
    const { accessToken } = parse(socket.request.headers.cookie);
    if (!accessToken) return next(new Error("User is unauthorized"));
    socket.user = accessToken;
    next();
  });

  io.on("connection", (socket) => {
    //Notify when replying
    socket.on("reply", (data) => {
      socket.broadcast.emit("notify", data);
    });
  });
  // app.use(express.static(path.join(__dirname, "public")));
  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
