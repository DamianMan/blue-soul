const mongoose = require("mongoose");

const studentModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    isId: {
      type: Boolean,
    },
    tokenGroup: {
      type: String,
      required: true,
    },
    isPassport: {
      type: Boolean,
    },
    numDocument: {
      type: String,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentModel);

module.exports = Student;
