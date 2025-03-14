import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ item: String, price: Number, quantity: Number }],
    totalPrice: Number,
    status: { type: String, default: 'pending' }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
