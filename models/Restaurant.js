import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    image: { type: String, required: true }, // Store Cloudinary restaurant image URL
    rating: { type: Number, default: 0, min: 0, max: 5 },
    deliveryTime: { type: Number, required: true },
    menu: [
        {
            item: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String, required: true },
            image: { type: String } // Store Cloudinary menu image URL
        }
    ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

