const mongoose = require("mongoose");

const ProgramsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  hour: {
    type: Number,
  },
});

const ProgramsModel = mongoose.model("Program", ProgramsSchema);

module.exports = ProgramsModel;
