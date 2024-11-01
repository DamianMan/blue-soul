const mongoose = require("mongoose");

const schoolModel = new mongoose.Schema(
  {
    nameGroup: {
      type: String,
      required: true,
    },
    fullNameTeacher: {
      type: String,
      required: true,
    },
    tokenGroup: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolModel);

module.exports = School;
