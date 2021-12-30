const mongoose = require("mongoose");
const Joi = require("joi");

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 50,
  },
  subTitle: {
    type: String,
    min: 5,
  },
  content: {
    type: String,
    min: 5,
  },
});

const Journal = new mongoose.model("Journal", journalSchema);

function validateJournal(journal) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(50).only(),
    subTitle: Joi.string().required().min(5).max(50).only(),
    content: Joi.string().required().min(5),
  });
  return schema.validate(journal);
}

exports.Journal = Journal;
exports.validate = validateJournal;
exports.journalSchema = journalSchema;
