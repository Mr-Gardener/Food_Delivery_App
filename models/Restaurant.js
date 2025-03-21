// import mongoose from 'mongoose';

// const restaurantSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     location: { type: String, required: true },
//     cuisine: { type: String, required: true },
//     rating: { type: Number, default: 0, min: 0, max: 5 },
//     deliveryTime: { type: Number, required: true },
//     restaurantImage: { type: String, default: "" }, // Cloudinary image URL
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Restaurant', restaurantSchema);

import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String, default: "" } // Cloudinary URL for menu images
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    deliveryTime: { type: Number, required: true },
    restaurantImage: { type: String, default: "" }, // Cloudinary image URL
    menu: { type: [menuItemSchema], default: [] } // New menu field added
  },
  { timestamps: true }
);

export default mongoose.model('Restaurant', restaurantSchema);
