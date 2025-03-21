// import mongoose from 'mongoose';

// const restaurantSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     location: { type: String, required: true },
//     cuisine: { type: String, required: true },
//     rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating from 0 to 5
//     deliveryTime: { type: Number, required: true },
//     image: { type: String },
//     menu: [
//         {
//             item: { type: String, required: true },
//             price: { type: Number, required: true },
//             description: { type: String },
//             image: { type: String } // <-- If menu items have their own images
//         }
//     ]
// });

// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// export default Restaurant;


const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    menu: {
      type: String, // Storing as JSON string
      default: "[]", // Default empty menu
    },
    restaurantImage: {
      type: String, // Cloudinary URL
      default: "",
    },
    menuImages: {
      type: [String], // Array of Cloudinary URLs
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
