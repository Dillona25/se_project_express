const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "cold", "warm"],
  },
  imageURL: {
    type: String,
    // required: true,
    // validate: {
    //   validator(value) {
    //     return validator.isURL(value);
    //   },
    //   message: "You must enter a valid URL",
    // },
    //? Getting error with postman POST req whenever I try to use validation. Also get error of app crash every other save
  },
});

module.exports = mongoose.model("clothingItems", clothingItemSchema);
