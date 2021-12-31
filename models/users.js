const mongoose = require("mongoose");
const Joi = require("joi");
const jsonwebtoken = require("jsonwebtoken");
const config = require("config");
const { journalSchema } = require("./journals");

// user schema to store user details
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32,
  },
  journals: [journalSchema],
});

// attaching a method to generate token
userSchema.methods.generateToken = function () {
  const token = jsonwebtoken.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("jwtPrivateToken")
  );
  return token;
};
const User = new mongoose.model("User", userSchema);

// validating user object to match the shcema
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required().min(5).max(50).only(),
    password: Joi.string().required().min(8).max(32),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
