const mongoose = require("mongoose");

const ProgramsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  hour: {
    type: String,
  },
  description: {
    type: String,
  },
  isOptional: {
    type: Boolean,
  },
});

const ProgramsModel = mongoose.model("Program", ProgramsSchema);

module.exports = ProgramsModel;
