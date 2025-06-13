const mongoose = require("mongoose");
const Schema = mongoose.Schema();
const Course = new Schema({
  courseTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keyBenifits: {
    type: String,
  },
  courseLevel: {
    type: String,
    default: "Beginner",
  },
  category:{
    type: String,
    required: true,
  }
});
