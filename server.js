const express = require("express");
const bodyParser = require("body-parser");
const i18n = require("i18n");
const { cresteUser, createTask } = require("./routes/index");
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

i18n.configure({
  locales: ["en", "fr"],
  defaultLocale: "en",
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
    const lang = req.query.lang;
    if (i18n.getLocales().includes(lang)) {
      i18n.setLocale(req, lang);
    } else {
      i18n.setLocale(req, "en");
    }
    next();
  },
  cresteUser.route
);
app.use(
  "/task",
  (req, res, next) => {
    const lang = req.query.lang;
    if (i18n.getLocales().includes(lang)) {
      i18n.setLocale(req, lang);
    } else {
      i18n.setLocale(req, "en");
    }
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
