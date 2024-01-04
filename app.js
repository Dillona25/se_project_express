require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

app.use(express.json());

app.use(routes);

app.use(cors());

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
  console.log("This is all working");
});
