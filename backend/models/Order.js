const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: { type: String, default: "pending" }, // pending, shipped, out for delivery, delivered, cancelled
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
