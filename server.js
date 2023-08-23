const express = require("express");
const bodyParser = require("body-parser");
const i18n = require("i18n");
const { cresteUser, createTask } = require("./routes/index");
const app = express();

i18n.configure({
  locales: ["en", "fr"],
  defaultLocale: "fr",
  directory: __dirname + "/locales",
  queryParameter: "lang",
  register: global,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.init);

app.use(
  "/user",
  (req, res, next) => {
    i18n.setLocale(req, "fr");
    next();
  },
  cresteUser.route
);
app.use(
  "/task",
  (req, res, next) => {
    req.setLocale(req, "fr");
    next();
  },
  createTask.route
);

require("dotenv").config();
const dotenv = require("dotenv");

dotenv.config();

app.listen(3000, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
