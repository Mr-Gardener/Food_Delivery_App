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
    name: String, 
    location: String, 
    cuisine:String,
    rating:Number, 
    deliveryTime:Number, 
    image:String ,
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
