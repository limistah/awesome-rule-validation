const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors("*"));

app.use("/", indexRouter);

process.on("unhandledRejection", (reason) => {
  console.log(reason);
});

app.use((err, req, res, next) => {
  res.status(500).json(err);
});

module.exports = app;
