const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Blog, validate } = require("../models/blogs");
const _ = require("lodash");
const Joi = require("joi");

// Route for getting all blogs of a user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user.blogs);
});

// Route for adding data
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);
  let blog = user.blogs.find((blog) => req.body.title === blog.title);
  if (blog) return res.status(400).send("blog with same title already exists.");
  blog = new Blog(_.pick(req.body, ["title", "content"]));
  user.blogs.push(blog);
  await user.save();
  res.send(blog);
});

// Route for getting a single blog of a user
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const blog = user.blogs.find((blog) => blog._id.toString() === req.params.id);
  if (!blog) return res.status(400).send("No blog found with given id.");
  res.send(blog);
});

// Route for deleting a blog
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const blog = user.blogs.find((blog) => blog._id.toString() === req.params.id);
  if (!blog) return res.status(400).send("No blog found with given id.");
  const newBlogs = user.blogs.filter(
    (blog) => blog._id.toString() !== req.params.id
  );
  user.blogs = newBlogs;
  await user.save();
  res.send(user.blogs);
});

// Route for updating a route
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);
  const blog = user.blogs.find((blog) => blog._id.toString() === req.params.id);
  if (!blog) return res.status(400).send("No blog found with given id.");
  const isTitleAlreadyExists = user.blogs.find(
    (blog) =>
      req.body.title === blog.title && blog._id.toString() !== req.params.id
  );
  if (isTitleAlreadyExists)
    return res.status(400).send("blog with same title already exists.");
  blog.title = req.body.title;
  blog.content = req.body.content;
  user.save();
  res.send(blog);
});
module.exports = router;
