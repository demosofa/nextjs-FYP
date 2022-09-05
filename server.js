require("dotenv").config();
const next = require("next");
const express = require("express");
const path = require("path");
const { parse } = require("cookie");
const { Server } = require("socket.io");
const Token = require("./helpers/Token");

const db = require("./helpers/db");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let times = 1;
console.log("run server times", times++);

db.connect();
nextApp.prepare().then(() => {
  const app = express();
  const server = require("http").createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  let timesInPrepare = 1;
  console.log("run server times in prepare mode", timesInPrepare++);

  const session = {};
  io.use((socket, next) => {
    const { accessToken } = parse(socket.request.headers.cookie);
    if (!accessToken) return next(new Error("User is unauthorized"));
    const { accountId } = Token.verifyAccessToken(accessToken);
    session[accountId] = socket.id;
    next();
  });

  io.on("connection", (socket) => {
    //Notify when replying
    socket.emit("connected", "You have connected");
    socket.on("reply", (data) => {
      console.log(session);
      socket.to(session[data.to]).emit("notify", data.value);
    });
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  // app.use(express.static(path.join(__dirname, "public")));
  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`App currently is listening at http://localhost:${port}`);
  });
});