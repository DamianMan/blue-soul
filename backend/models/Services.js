const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
  },
  url: { type: String },
});

const Service = mongoose.model("Service", ServicesSchema);

module.exports = Service;
