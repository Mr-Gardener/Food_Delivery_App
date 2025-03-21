

 import express from 'express';
 import mongoose from 'mongoose';
 import dotenv from 'dotenv';
 import cors from 'cors';
 import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
 import authenticate from './middleware/authenticate.js';
 import User from './models/User.js';
 import Restaurant from './models/Restaurant.js';
 import Order from './models/Order.js';
 import upload from './middleware/multer.js';
 import multer from 'multer';
 import { v2 as cloudinary } from 'cloudinary';
 
 
 
 dotenv.config();
 
 const app = express();

  // Enable CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,  // Allow cookies and headers
    methods: "GET,POST,PUT,DELETE", // Allowed methods
}));

 app.use(express.json());
 
 // MongoDB Connection
 mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
 
     // Helper function to calculate total price
     const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    };   
 
     // User Registration Route
 app.post('/api/auth/register', async (req, res) => {
     const { name, email, password, role } = req.body;
 
     if (!name || !email || !password) {
         return res.status(400).json({ error: 'Name, email, and password are required' });
     }
 
     try {
         const existingUser = await User.findOne({ email });
         if (existingUser) return res.status(400).json({ error: 'User already exists' });
 
         const hashedPassword = await bcrypt.hash(password, 10);
         const newUser = new User({ name, email, password: hashedPassword, role });
         await newUser.save();
 
         res.status(201).json({ message: 'User registered successfully' });
     } catch (err) {
         console.error(err); // Log the error
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // User Login Route
 app.post('/api/auth/login', async (req, res) => {
     const { email, password } = req.body;
 
     if (!email || !password) {
         return res.status(400).json({ error: 'Email and password are required' });
     }
 
     try {
         const user = await User.findOne({ email });
         if (!user) return res.status(404).json({ error: 'User not found' });
 
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
 
         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
         res.json({ message: 'Login successful', token });
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Profile route
 app.get('/api/users/profile', authenticate, async (req, res) => {
     try {
         const user = await User.findById(req.user.id).select('-password');
 
         if (user) {
             res.json(user);
         } else {
             res.status(404).json({ message: 'User not found' });
         }
     } catch (error) {
         res.status(500).json({ message: 'Server error' });
     }
 });
 
 // Update profile
 app.put('/api/users/profile', authenticate, async (req, res) => {
     try {
         const user = await User.findById(req.user.id);
 
         if (user) {
             user.name = req.body.name || user.name;
             user.email = req.body.email || user.email;
             user.password = req.body.password || user.password;
 
             const updatedUser = await user.save();
             res.json(updatedUser);
         } else {
             res.status(404).json({ message: 'User not found' });
         }
     } catch (error) {
         res.status(500).json({ message: 'Server error' });
     }
 });
 
 
 // Restaurant Management(Add, edit, and delete restaurants)
 
 // Add a new restaurant
//  app.post('/api/restaurants', authenticate, async (req, res) => {
//      const { name, location, cuisine, menu } = req.body;
 
//      if (!name || !location || !cuisine) {
//          return res.status(400).json({ error: 'Name, location, and cuisine are required' });
//      }
 
//      try {
//          const newRestaurant = new Restaurant({ name, location, cuisine, menu });
//          await newRestaurant.save();
//          res.status(201).json({ message: 'Restaurant added successfully', newRestaurant });
//      } catch (err) {
//          console.error(err); // Log the error to terminal if not adding restaurants to debug easily
//          res.status(500).json({ error: 'Server error' });
//      }
//  });

// Add new restaurant with Cloudinary image upload
// app.post('/api/restaurants', authenticate, upload.fields([
//     { name: 'restaurantImage', maxCount: 1 },
//     { name: 'menuImages', maxCount: 10 }
// ]), async (req, res) => {
//     try {
//         const { name, location, cuisine, deliveryTime, menu } = req.body;

//         if (!name || !location || !cuisine || !deliveryTime) {
//             return res.status(400).json({ error: 'Name, location, cuisine, and delivery time are required' });
//         }

//         // ✅ Ensure correct restaurant image upload
//         const restaurantImage = req.files['restaurantImage']?.[0]?.path || '';

//         // ✅ Ensure correct menu parsing & image assignment
//         let parsedMenu = [];
//         if (menu) {
//             try {
//                 parsedMenu = JSON.parse(menu).map((item, index) => ({
//                     item: item.item,
//                     price: item.price,
//                     description: item.description,
//                     menuImage: req.files['menuImages']?.find((_, i) => i === index)?.path || ''
//                 }));
//             } catch (error) {
//                 return res.status(400).json({ error: "Invalid menu format. Must be a JSON array." });
//             }
//         }

//         // ✅ Save restaurant to database
//         const restaurant = new Restaurant({
//             name,
//             location,
//             cuisine,
//             deliveryTime,
//             restaurantImage,
//             menu: parsedMenu
//         });

//         await restaurant.save();
//         res.status(201).json({ message: 'Restaurant added successfully', restaurant });
//     } catch (err) {
//         console.error("🔥 Error in adding restaurant:", err.message);
//         res.status(500).json({ error: 'Server error. Please try again.' });
//     }
// });

app.post('/api/restaurants', (req, res, next) => {
    console.log("📢 Restaurant route hit!");
    next();
});


app.post('/api/restaurants', authenticate, upload.fields([
    { name: 'restaurantImage', maxCount: 1 },
    { name: 'menuImages', maxCount: 10 }
]), async (req, res) => {
    try {
        console.log("📢 Incoming request received!");

        console.log("✅ Request body:", JSON.stringify(req.body, null, 2));
        console.log("✅ Uploaded files:", JSON.stringify(req.files, null, 2));


        const { name, location, cuisine, rating, deliveryTime, menu } = req.body;

        if (!name || !location || !cuisine || rating === undefined || !deliveryTime) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let parsedMenu = [];
        if (menu) {
            try {
                parsedMenu = JSON.parse(menu);
            } catch (error) {
                console.log("❌ Invalid JSON in menu");
                return res.status(400).json({ error: 'Invalid JSON format in menu' });
            }
        }

        console.log("✅ Parsed menu:", parsedMenu);

        const restaurantImage = req.files['restaurantImage'] ? req.files['restaurantImage'][0].path : "";
        const menuImages = req.files['menuImages'] ? req.files['menuImages'].map(file => file.path) : [];

        console.log("✅ Restaurant image URL:", restaurantImage);
        console.log("✅ Menu images URLs:", menuImages);

        const restaurant = new Restaurant({
            name,
            location,
            cuisine,
            rating: Number(rating),
            deliveryTime: Number(deliveryTime),
            menu: JSON.stringify(parsedMenu),
            restaurantImage,
            menuImages
        });

        console.log("🟢 Saving restaurant to database...");
        await restaurant.save();
        console.log("✅ Restaurant saved successfully");

        res.status(201).json({ message: "Restaurant added successfully", restaurant });
    } catch (err) {
        console.error("❌ Error in adding restaurant:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


 
 // Get all restaurants
 app.get('/api/restaurants', async (req, res) => {
     try {
         const restaurants = await Restaurant.find();
         console.log("Fetched Restaurants:", restaurants);
         res.json(restaurants);
     } catch (err) {
        console.error("Error fetching restaurants:", error);
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Update restaurant details
 app.put('/api/restaurants/:id', authenticate, async (req, res) => {
     const { id } = req.params;
     const updates = req.body;
 
     try {
         const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, { new: true });
         if (!updatedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
         res.json({ message: 'Restaurant updated successfully', updatedRestaurant });
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Delete a restaurant
 app.delete('/api/restaurants/:id', authenticate, async (req, res) => {
     const { id } = req.params;
 
     try {
         const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
         if (!deletedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
         res.json({ message: 'Restaurant deleted successfully' });
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Get restaurant details
 app.get('/api/restaurants/:id', async (req, res) => {
     const { id } = req.params;
 
     try {
         const restaurant = await Restaurant.findById(id);
         if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
         res.json(restaurant);
     } catch (err) {

         res.status(500).json({ error: 'Server error' });
     }
 });
 
 
 // Food Search and Ordering System Enhancements
 
 // Search menu items across restaurants
 app.get('/api/menu/search', async (req, res) => {
     const { query } = req.query;
     if (!query) return res.status(400).json({ error: 'Search query is required' });
 
     try {
         const results = await Restaurant.find({
             'menu.item': { $regex: query, $options: 'i' }
         }, 'name menu');
         res.json(results);
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Place order endpoint
app.post('/api/orders', authenticate, async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Items are required to place an order' });
    }

    try {
        const totalPrice = calculateTotalPrice(items);
        const newOrder = new Order({
            user: req.user.id,
            items,
            totalPrice
        });

        await newOrder.save();

        // Return the full order details
        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder  // Sends back the complete order object
        });

    } catch (err) {
        console.error("❌ Order Placement Error:", err);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
});

 
 // Order preview endpoint
 app.post('/api/orders/preview', authenticate, async (req, res) => {
     const { items } = req.body;
     if (!items || items.length === 0) return res.status(400).json({ error: 'Items are required' });
 
     const totalPrice = calculateTotalPrice(items);
     res.json({ items, totalPrice });
 });
 
 // Restaurant Menu Management

 // Add a new menu item
 app.post('/api/restaurants/:id/menu', authenticate, upload.single('image'), async (req, res) => {
     const { id } = req.params;
     const { item, price, description } = req.body;
 
     if (!item || !price || !description || !req.file) {
         return res.status(400).json({ error: 'Item, price, description, and image are required' });
     }
 
     try {
         const restaurant = await Restaurant.findById(id);
         if (!restaurant) {
             return res.status(404).json({ error: 'Restaurant not found' });
         }
 
         const imageUrl = req.file.path;
 
 
         // Push new menu item to restaurant menu
         restaurant.menu.push({ item, price, description, image: imageUrl });
         await restaurant.save();
         
         res.json({ message: 'Menu item added with image', restaurant });
     } catch (err) {
         console.error('Server error:', err);  // Log the error to terminal if not adding menu to debug easily
         res.status(500).json({ error: 'Server error', details: err.message });
     }
 });
 
 
 // Update menu item image
 app.put('/api/restaurants/:restaurantId/menu/:itemId', authenticate, upload.single('image'), async (req, res) => {
     const { restaurantId, itemId } = req.params;
 
     try {
         const restaurant = await Restaurant.findById(restaurantId);
         if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
 
         const menuItem = restaurant.menu.id(itemId);
         if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
 
         // Upload new image if provided
         if (req.file) {
             menuItem.image = req.file.path;
         }
 
         // Save the updated restaurant
         await restaurant.save();
         res.json({ message: 'Menu item updated with image', menuItem });
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 
 // Get a specific restaurant’s menu
 app.get('/api/restaurants/:id/menu', async (req, res) => {
     const { id } = req.params;
 
     try {
         const restaurant = await Restaurant.findById(id);
         if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
         res.json(restaurant.menu);
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Order Status Management
 
 // Update order status
 app.put('/api/orders/:orderId/status', authenticate, async (req, res) => {
     const { orderId } = req.params;
     const { status } = req.body;
 
     if (!status) return res.status(400).json({ error: 'Status is required' });
 
     try {
         const order = await Order.findById(orderId);
         if (!order) return res.status(404).json({ error: 'Order not found' });
 
         order.status = status;
         await order.save();
 
         res.json({ message: 'Order status updated', order });
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 // Get order history
 app.get('/api/orders/history', authenticate, async (req, res) => {
     try {
         const orders = await Order.find({ user: req.user.id });
         res.json(orders);
     } catch (err) {
         res.status(500).json({ error: 'Server error' });
     }
 });
 
 
 
 // Your routes
 app.get('/', (req, res) => {
     res.send('Backend is running!');
 });
 
 const PORT = process.env.PORT || 5000;
 
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

