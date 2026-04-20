const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { connectDB } = require("./db");
const User = require("./models/User");
const Image = require("./models/Image");
const Product = require("./models/Product");
const Message = require("./models/Message");
const Order = require("./models/Order");
require("dotenv").config();

// ============================================================
// 📱 WHATSAPP INTEGRATION — Import WhatsApp notification module
// ============================================================
const { sendOrderNotification } = require("./whatsapp");
// ============================================================

const app = express();
app.use(cors());
app.use(express.json());

// In-memory cache for products and metadata
let cachedProducts = null;
let cachedCategories = null;

async function refreshProductCache() {
  try {
    const Product = require("./models/Product");
    const products = await Product.find();
    cachedProducts = products.map(p => ({
      ...p._doc,
      id: p._id,
      img: (() => {
        if (!p.img) return null;
        if (typeof p.img === 'string') return p.img;
        if (Buffer.isBuffer(p.img)) return p.img.toString("base64");
        if (p.img.buffer && Buffer.isBuffer(p.img.buffer)) return p.img.buffer.toString("base64");
        try { return p.img.toString("base64"); } catch (e) { return null; }
      })()
    }));

    // Refresh categories cache
    const catSet = new Set();
    cachedProducts.forEach(p => {
      if (p.category) catSet.add(p.category);
    });
    cachedCategories = Array.from(catSet).sort();

    console.log("Cache refreshed: Products and Categories");
  } catch (err) {
    console.error("Error refreshing cache:", err);
  }
}

async function cleanupLighting() {
  try {
    const Product = require("./models/Product");
    const result = await Product.deleteMany({ category: { $regex: /^lighting$/i } });
    if (result.deletedCount > 0) {
      console.log(`Cleanup: Deleted ${result.deletedCount} products from 'Lighting' category`);
      await refreshProductCache();
    }
  } catch (err) {
    console.error("Error cleaning up 'Lighting' category:", err);
  }
}

// Manual Cache Refresh
app.get("/refresh-cache", async (req, res) => {
  await refreshProductCache();
  res.json({ message: "Cache refreshed successfully", productsCount: cachedProducts?.length || 0 });
});

// Serve static files from the root directory
// Serve static files from the frontend and root directories
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend'))); // Prefer frontend files
app.use(express.static(path.join(__dirname, '../')));
// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// For admin and other root html files
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

// Connect to Database
connectDB().then(async () => {
  await cleanupLighting();
  await refreshProductCache();
});

const upload = multer();

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await user.save();
    res.json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Invalid email or password" });
    }

    if (bcrypt.compareSync(password, user.password)) {
      res.json({
        status: "success",
        role: user.role,
        user_id: user._id,
        name: user.name,
        cart: user.cart,
        wishlist: user.wishlist
      });
    } else {
      res.status(401).json({ status: "fail", message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout (Optional server-side handling)
app.post("/logout", (req, res) => {
  res.json({ status: "success", message: "Logged out" });
});

// User specific data
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/users/:id/cart", async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { cart }, { returnDocument: 'after' });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/:id/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/users/:id/wishlist", async (req, res) => {
  try {
    const { wishlist } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { wishlist }, { returnDocument: 'after' });
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Order Endpoints
app.post("/orders", async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    await order.save();

    // Clear user's cart in DB after successful order
    await User.findByIdAndUpdate(userId, { cart: [] });

    // ── 📱 WHATSAPP NOTIFICATION ─────────────────────────────
    // Fetch the user's name to include in the WhatsApp message
    const user = await User.findById(userId).select("name");
    sendOrderNotification({
      customerName: shippingAddress.fullName || (user && user.name) || "Customer",
      phone: shippingAddress.phone,
      items: items,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      shippingAddress
    });
    // ─────────────────────────────────────────────────────────

    res.json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload Image
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const newImage = new Image({
      image: req.file.buffer,
      uploaded_by: user_id
    });

    await newImage.save();
    res.json({ message: "Image Uploaded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    const formattedImages = images.map(img => {
      const data = img.image;
      let base64 = null;
      if (Buffer.isBuffer(data)) base64 = data.toString("base64");
      else if (data.buffer && Buffer.isBuffer(data.buffer)) base64 = data.buffer.toString("base64");
      else {
        try { base64 = data.toString("base64"); } catch (e) { base64 = null; }
      }
      return { id: img._id, image: base64 };
    }).filter(i => i.image !== null);
    res.json(formattedImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Product Endpoints
app.get("/products", async (req, res) => {
  try {
    if (!cachedProducts) {
      await refreshProductCache();
    }
    res.json(cachedProducts || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const formatted = {
      ...product._doc,
      id: product._id,
      img: (() => {
        if (!product.img) return null;
        if (typeof product.img === 'string') return product.img;
        if (Buffer.isBuffer(product.img)) return product.img.toString("base64");
        if (product.img.buffer && Buffer.isBuffer(product.img.buffer)) return product.img.buffer.toString("base64");
        try { return product.img.toString("base64"); } catch (e) { return null; }
      })()
    };
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all unique categories
app.get("/categories", async (req, res) => {
  try {
    if (!cachedCategories) {
      await refreshProductCache();
    }
    res.json(cachedCategories || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get subcategories by category
app.get("/subcategories/:category?", async (req, res) => {
  try {
    const categoryName = req.params.category;
    if (!categoryName) return res.json([]); 
    
    if (!cachedProducts) await refreshProductCache();
    const targetCat = categoryName.toLowerCase();
    const subcats = new Set();
    cachedProducts.forEach(p => {
      if (p.category && p.category.toLowerCase() === targetCat && p.subcategory) {
        subcats.add(p.subcategory);
      }
    });
    res.json(Array.from(subcats).sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/images/:id", async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { title, category, subcategory, price, desc, originalPrice } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const newProduct = new Product({
      title,
      category,
      subcategory,
      price: Number(price),
      originalPrice: Number(originalPrice || 0),
      desc: desc || title,
      img: req.file.buffer,
      imgType: req.file.mimetype
    });

    await newProduct.save();
    await refreshProductCache();
    res.json({ message: "Product added successfully", product_id: newProduct._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, category, subcategory, price, desc, originalPrice, status } = req.body;
    const updateData = {
      title,
      category,
      subcategory,
      price: Number(price),
      originalPrice: Number(originalPrice || 0),
      desc: desc || title,
      status: status || 'In-stock'
    };

    if (req.file) {
      updateData.img = req.file.buffer;
      updateData.imgType = req.file.mimetype;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    await refreshProductCache();
    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    await refreshProductCache();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rate a product
app.post("/products/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value. Must be between 1 and 5." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate new average rating
    const currentRating = product.rating || 0;
    const currentReviews = product.reviews || 0;

    const newReviews = currentReviews + 1;
    const newRating = ((currentRating * currentReviews) + Number(rating)) / newReviews;

    product.rating = Number(newRating.toFixed(1));
    product.reviews = newReviews;

    await product.save();
    await refreshProductCache();

    res.json({
      message: "Rating submitted successfully",
      rating: product.rating,
      reviews: product.reviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Message Endpoints
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json({ message: "Message sent", id: message._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/messages/:id", async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User Endpoints (Admin only)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));