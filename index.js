const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const users = require("./routers/users");
const auth = require("./routers/auth");
const blogs = require("./routers/blogs");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/blogs", blogs);
if (!config.get("jwtPrivateToken")) {
  console.log("FATAL ERROR : Secret Token not provided");
  process.exit(1);
}
mongoose.connect("mongodb://localhost:27017/cs50JournalDB", (err) => {
  if (err) {
    console.log("database not connected");
  } else {
    console.log("Database is connected");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
