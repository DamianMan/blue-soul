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
  namesActivities: {
    type: Array,
  },
  foods: {
    type: Array,
  },
  drinks: {
    type: Array,
  },
  mainImage: { type: String },
  images: {
    type: Array,
  },
  url: { type: String },
});

const Service = mongoose.model("Service", ServicesSchema);

module.exports = Service;
