const mongoose = require("mongoose");
const https = require("https");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
    // Living Room - Sofas
    { title: 'Modern Fabric Sectional Sofa', category: 'Sofa', price: 42000, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=60', desc: 'Comfortable fabric sectional sofa for modern living rooms.', isNew: true },
    { title: 'Classic Wooden 3-Seater Sofa', category: 'Sofa', price: 35000, img: 'https://images.unsplash.com/photo-1550226129-c9066669925e?auto=format&fit=crop&w=800&q=60', desc: 'Handcrafted solid wood sofa with detailed carvings.', isSale: true },
    { title: 'L-Shaped Premium Velvet Sofa', category: 'Sofa', price: 58000, img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=60', desc: 'Luxury L-shaped sofa in deep velvet upholstery.', isNew: true },
    { title: 'Versatile Sofa Cum Bed', category: 'Sofa', price: 28000, img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=60', desc: 'Space-saving sofa that easily converts into a bed.', isSale: true },
    { title: 'Power Recliner Leather Chair', category: 'Sofa', price: 25000, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=60', desc: 'Single leather recliner with motorized footrest.' },

    // Seating
    { title: 'Mid-Century Lounge Chair', category: 'Seating', price: 15000, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=60', desc: 'Iconic mid-century design with comfortable seating.' },
    { title: 'Emerald Green Accent Chair', category: 'Seating', price: 12500, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=60', desc: 'Bold accent chair to brighten any room corner.' },
    { title: 'Wooden Rocking Chair', category: 'Seating', price: 9500, img: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=60', desc: 'Traditional rocking chair for ultimate relaxation.', isSale: true },
    { title: 'Giant Bean Bag Chair', category: 'Seating', price: 4500, img: 'https://images.unsplash.com/photo-1598300042247-d31765641753?auto=format&fit=crop&w=800&q=60', desc: 'Extra large, comfortable bean bag for casual seating.' },

    // Living Room - Tables
    { title: 'Marble Top Coffee Table', category: 'Living', price: 18000, img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=60', desc: 'Elegant marble top table with gold-finish legs.', isNew: true },
    { title: 'Rustic Wood Side Table', category: 'Living', price: 6500, img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=60', desc: 'Compact side table made from reclaimed wood.' },
    { title: 'Trio Nesting Tables', category: 'Living', price: 8500, img: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=60', desc: 'Set of 3 nesting tables for versatile use.', isSale: true },

    // Bedroom
    { title: 'Royal King Size Bed', category: 'Bedroom', price: 55000, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60', desc: 'Grand king size bed with upholstered headboard.', isNew: true },
    { title: 'Minimalist Queen Bed', category: 'Bedroom', price: 42000, img: 'https://images.unsplash.com/photo-1505693395921-87470d11f69b?auto=format&fit=crop&w=800&q=60', desc: 'Simple and sleek queen size bed.' },
    { title: 'Twin Bunk Bed', category: 'Bedroom', price: 32000, img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60', desc: 'Sturdy wooden bunk bed.', isSale: true },

    // Storage
    { title: '3-Door Solid Wood Wardrobe', category: 'Storage', price: 48000, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=60', desc: 'Spacious 3-door wardrobe.' },
    { title: '6-Drawer Chest', category: 'Storage', price: 19500, img: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=60', desc: 'Classic wooden chest.' },
    { title: 'Elegance Dressing Table', category: 'Storage', price: 14000, img: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&w=800&q=60', desc: 'Beautiful vanity table.' },
    { title: 'Wall-Mounted TV Unit', category: 'Storage', price: 15500, img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=60', desc: 'Modern floating TV unit.' },
    { title: 'Tall Oak Bookshelf', category: 'Storage', price: 12000, img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=60', desc: '5-tier open bookshelf.' },

    // Dining
    { title: 'Compact 4-Seater Dining Set', category: 'Dining', price: 28000, img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=60', desc: 'Perfect dining set for small families.' },
    { title: 'Luxury 6-Seater Oak Set', category: 'Dining', price: 45000, img: 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=800&q=60', desc: 'Solid oak dining table.', isNew: true },
    { title: 'Grand 8-Seater Banquet Set', category: 'Dining', price: 68000, img: 'https://images.unsplash.com/photo-1622394924250-983696ea8238?auto=format&fit=crop&w=800&q=60', desc: 'Massive dining table.', isSale: true },
    { title: 'Bar Stool - Industrial Style', category: 'Dining', price: 4500, img: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60', desc: 'Height-adjustable metal and wood bar stool.' },

    // Study
    { title: 'Executive Study Desk', category: 'Study', price: 18500, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=60', desc: 'Spacious desk with drawers.', isNew: true },
    { title: 'Compact Writing Desk', category: 'Study', price: 8500, img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60', desc: 'Small desk perfect for limited spaces.' }
];

const downloadImage = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${res.statusCode}`));
                return;
            }
            const data = [];
            res.on("data", (chunk) => data.push(chunk));
            res.on("end", () => resolve(Buffer.concat(data)));
        }).on("error", reject);
    });
};

const seedProductsWithBuffers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");

        await Product.deleteMany({});
        console.log("Cleared existing products.");

        console.log(`Downloading and seeding ${products.length} products...`);

        for (const p of products) {
            try {
                process.stdout.write(`Processing: ${p.title}... `);
                const buffer = await downloadImage(p.img);

                const product = new Product({
                    ...p,
                    img: buffer,
                    imgType: 'image/jpeg',
                    rating: 4.0 + Math.random(),
                    reviews: Math.floor(Math.random() * 150) + 20,
                    originalPrice: p.originalPrice || Math.floor(p.price * 1.3)
                });

                await product.save();
                console.log("Success ✅");
            } catch (e) {
                console.log(`Failed ❌ (${e.message})`);
            }
        }

        console.log("All products seeded successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProductsWithBuffers();
