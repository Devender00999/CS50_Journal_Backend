const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
  content: {
    type: String,
    required: true,
    unique: true,
    min: 5,
  },
});

const Blog = new mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(50).only(),
    content: Joi.string().required().min(5),
  });
  return schema.validate(blog);
}

exports.Blog = Blog;
exports.validate = validateBlog;
exports.blogSchema = blogSchema;
