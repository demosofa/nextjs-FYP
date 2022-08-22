require("dotenv").config();
const next = require("next");
const express = require("express");
const path = require("path");

const db = require("./helpers/db");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

db.connect();
app.prepare().then(() => {
  const server = express();
  // server.use(express.static(path.join(__dirname, "public")));
  //add middleware for parsing url encoded and json
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.all("*", (req, res) => {
    return handler(req, res);
  });

  server.listen(port, () => {
    console.log(`Example server listening at http://localhost:${port}`);
  });
});
