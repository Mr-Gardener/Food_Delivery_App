// import mongoose from 'mongoose';

// const restaurantSchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     cuisine: String,
//     menu: [
//         {
//             item: String,
//             price: Number,
//             description: String,
//             image: String
//         }
//     ]
// });

// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// export default Restaurant;

import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating from 0 to 5
    deliveryTime: { type: Number, required: true },
    image: { type: String },
    menu: [
        {
            item: String,
            price: Number,
            description: String,
            image: String,
        }
    ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
