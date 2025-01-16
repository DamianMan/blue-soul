const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
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
    role: { type: String },
    pushToken: { type: String },

    tripFoodDrink: {
      type: Array,
    },
    program: {
      type: Object,
    },
    dinner: {
      type: Object,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
