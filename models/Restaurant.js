import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating from 0 to 5
    deliveryTime: { type: Number, required: true },
    restaurantImage: { type: String },
    menu: [
        {
            item: { type: String },
            price: { type: Number},
            description: { type: String },
            menuImages: { type: String } // <-- If menu items have their own images
        }
    ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

// import mongoose from 'mongoose';

// const restaurantSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     cuisine: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 5,
//     },
//     deliveryTime: {
//       type: Number,
//       required: true,
//     },
//     menu: {
//       type: String, // Storing as JSON string
//       default: "[]", // Default empty menu
//     },
//     restaurantImage: {
//       type: String, // Cloudinary URL
//       default: "",
//     },
//     menuImages: {
//       type: [String], // Array of Cloudinary URLs
//       default: [],
//     },
//   },
//   { timestamps: true }
// );


// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// export default Restaurant;