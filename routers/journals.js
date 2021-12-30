const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/users");
const { Journal, validate } = require("../models/journals");
const _ = require("lodash");
const Joi = require("joi");

// Route for getting all journals of a user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user.journals);
});

// Route for adding data
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);
  let journal = user.journals.find(
    (journal) => req.body.title === journal.title
  );
  if (journal)
    return res.status(400).send("journal with same title already exists.");
  journal = new Journal(_.pick(req.body, ["title", "subTitle", "content"]));
  user.journals.push(journal);
  await user.save();
  res.send(journal);
});

// Route for getting a single journal of a user
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const journal = user.journals.find(
    (journal) => journal._id.toString() === req.params.id
  );
  if (!journal) return res.status(400).send("No journal found with given id.");
  res.send(journal);
});

// Route for deleting a journal
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const journal = user.journals.find(
    (journal) => journal._id.toString() === req.params.id
  );
  if (!journal) return res.status(400).send("No journal found with given id.");
  const newJournals = user.journals.filter(
    (journal) => journal._id.toString() !== req.params.id
  );
  user.journals = newJournals;
  await user.save();
  res.send(user.journals);
});

// Route for updating a route
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);
  const journal = user.journals.find(
    (journal) => journal._id.toString() === req.params.id
  );
  if (!journal) return res.status(400).send("No journal found with given id.");
  const isTitleAlreadyExists = user.journals.find(
    (journal) =>
      req.body.title === journal.title &&
      journal._id.toString() !== req.params.id
  );
  if (isTitleAlreadyExists)
    return res.status(400).send("journal with same title already exists.");
  journal.title = req.body.title;
  journal.subTitle = req.body.subTitle;
  journal.content = req.body.content;
  user.save();
  res.send(journal);
});
module.exports = router;
