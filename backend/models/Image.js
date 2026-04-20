const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    image: { type: Buffer, required: true },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
