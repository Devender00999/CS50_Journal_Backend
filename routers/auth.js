const { User } = require("../models/users");
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const router = express.Router();

// route for creating new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) return res.status(400).send("Email or Password is incorrect");
  const validatePassowrd = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassowrd)
    return res.status(400).send("Email or Password is incorrect");
  const token = user.generateToken();
  res.send(token);
});

// validating user request object
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().required().min(5).max(50).only(),
    password: Joi.string().required().min(8).max(32),
  });
  return schema.validate(user);
}

module.exports = router;
