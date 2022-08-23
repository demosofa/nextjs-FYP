require("dotenv").config();
const next = require("next");
const express = require("express");
const path = require("path");

const db = require("./helpers/db");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

db.connect();
nextApp.prepare().then(() => {
  const app = express();
  // app.use(express.static(path.join(__dirname, "public")));
  // //add middleware for parsing url encoded and json
  // app.use(express.urlencoded({ extended: true }));
  // app.use(express.json());

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
