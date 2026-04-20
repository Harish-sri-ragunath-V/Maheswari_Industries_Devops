const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    body: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    status: { type: String, enum: ['pending', 'accepted', 'responded', 'declined'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
