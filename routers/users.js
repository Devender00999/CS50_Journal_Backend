const { User, validate } = require("../models/users");
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

// Route for registering users
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error["details"][0]["message"]);
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already Registered.");
  }
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  const token = user.generateToken();
  res.header("x-auth-token", token);
  return res.send(_.pick(user, ["_id", "name", "email"]));
});

// Router for single user

router.get("/me", (req, res) => {
  const token = req.header("x-auth-token");
  const user = jwt.decode(token, config.get("jwtPrivateToken"));
  res.send(user);
});
module.exports = router;
