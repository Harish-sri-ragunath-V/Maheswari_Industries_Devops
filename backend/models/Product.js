const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    subSubcategory: { type: String },
    price: { type: Number, required: true },
    img: { type: mongoose.Schema.Types.Mixed, required: true }, // Store Buffer for uploads or String for URLs
    imgType: { type: String }, // MIME type
    desc: { type: String },
    sizes: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    status: { type: String, enum: ['In-stock', 'Out-of-stock'], default: 'In-stock' },
    isNew: { type: Boolean, default: true },
    isSale: { type: Boolean, default: false },
    originalPrice: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
