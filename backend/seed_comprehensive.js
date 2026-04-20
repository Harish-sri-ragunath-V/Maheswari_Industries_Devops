const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const subSubCategories = [
    // Living Room
    {
        category: 'Living', subcategory: 'Sofas', ss: 'Fabric Sofas', imgs: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550254421-4603972a9497?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Living', subcategory: 'Sofas', ss: 'Wooden Sofas', imgs: [
            'https://www.woodenstreet.com/image/data/wooden-sofa/winchester-wooden-sofa-honey-finish-1.jpg',
            'https://www.woodenstreet.com/image/data/wooden-sofa/marriott-wooden-sofa-honey-finish-1.jpg',
            'https://www.woodenstreet.com/image/data/wooden-sofa/aden-3-seater-wooden-sofa-honey-finish-1.jpg',
            'https://www.woodenstreet.com/image/data/wooden-sofa/alanis-3-seater-wooden-sofa-honey-finish-1.jpg',
            'https://www.woodenstreet.com/image/data/wooden-sofa/oscar-3-seater-wooden-sofa-honey-finish-1.jpg'
        ]
    },
    {
        category: 'Living', subcategory: 'Sofas', ss: 'L-Shaped Sofas', imgs: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616627781431-23b776ec441f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1567016376408-012b8e301184?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Living', subcategory: 'Sofas', ss: 'Sofa Cum Beds', imgs: [
            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
            'https://www.at-home.co.in/cdn/shop/files/Amaze_676.jpg?v=1701333748',
            'https://www.at-home.co.in/cdn/shop/files/Amaze_677.jpg?v=1701333748',
            'https://www.at-home.co.in/cdn/shop/files/Amaze_678.jpg?v=1701333748',
            'https://www.at-home.co.in/cdn/shop/files/Amaze_679.jpg?v=1701333748'
        ]
    },
    {
        category: 'Living', subcategory: 'Sofas', ss: 'Recliners', imgs: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1491926626787-62db157af940?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1598300042247-d31765641753?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Living', subcategory: 'Seating', ss: 'Lounge Chairs', imgs: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519947486511-16199f57d722?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Living', subcategory: 'Tables', ss: 'Coffee Tables', imgs: [
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80',
            'https://www.orangetree.in/cdn/shop/files/LinnCoffeeTableLifestyle1.jpg?v=1722850270',
            'https://images.unsplash.com/photo-1572973413229-7977468160db?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Bedroom', subcategory: 'Beds', ss: 'King Size Beds', imgs: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616627781431-23b776ec441f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1632349389531-1557da0e0266?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505693395921-87470d11f69b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        category: 'Bedroom', subcategory: 'Storage', ss: 'Wardrobes', imgs: [
            'https://buildhub.in/storage/wardrobe/3-door/16-products/03-bg-15.jpg',
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616627781431-23b776ec441f?auto=format&fit=crop&w=800&q=80',
            'https://www.at-home.co.in/cdn/shop/products/StarkWardrobe.jpg?v=1626343516',
            'https://www.at-home.co.in/cdn/shop/products/StarkWardrobe2.jpg?v=1626343516'
        ]
    },
    {
        category: 'Dining', subcategory: 'Dining Sets', ss: '6 Seater', imgs: [
            'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
            'https://www.royaloakindia.com/media/catalog/product/d/t/dt30451-8s.jpg',
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=80'
        ]
    }
];

// Fallback image generator for other categories ensuring realistic look
const getFurnitureImg = (cat, index) => {
    const fallbackIds = [
        '1524758631624-e2822e304c36', // Living
        '1555041469-a586c61ea9bc', // Sofa
        '1505693416388-ac5ce068fe85', // Bed
        '1533090481720-856c6e3c1fdc', // Table
        '1592078615290-033ee584e267', // Chair
        '1518455027359-f3f8164ba6bd', // Desk
        '1595428774223-ef52624120d2'  // Cabinet
    ];
    const id = fallbackIds[index % fallbackIds.length];
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
};

const products = [];
subSubCategories.forEach(cat => {
    cat.imgs.forEach((img, i) => {
        products.push({
            title: `Premium ${cat.ss} Style ${i + 1}`,
            category: cat.category,
            subcategory: cat.subcategory,
            subSubcategory: cat.ss,
            price: 18000 + (i * 4500),
            img: img,
            desc: `High-quality ${cat.ss} from Maheswari Industries. Durable build and elegant finish.`,
            isNew: i === 0,
            sizes: ['Standard']
        });
    });
});

// Adding remaining subcategories with curated fallback logic
const allSubSubCategories = [
    { c: 'Living', s: 'Seating', ss: 'Accent Chairs' },
    { c: 'Living', s: 'Seating', ss: 'Rocking Chairs' },
    { c: 'Living', s: 'Seating', ss: 'Bean Bags' },
    { c: 'Living', s: 'Tables', ss: 'Side Tables' },
    { c: 'Living', s: 'Tables', ss: 'Nesting Tables' },
    { c: 'Living', s: 'Tables', ss: 'Console Tables' },
    { c: 'Bedroom', s: 'Beds', ss: 'Queen Size Beds' },
    { c: 'Bedroom', s: 'Beds', ss: 'Single Beds' },
    { c: 'Bedroom', s: 'Beds', ss: 'Bunk Beds' },
    { c: 'Bedroom', s: 'Storage', ss: 'Chest of Drawers' },
    { c: 'Bedroom', s: 'Storage', ss: 'Dressing Tables' },
    { c: 'Bedroom', s: 'Mattresses', ss: 'Memory Foam' },
    { c: 'Bedroom', s: 'Mattresses', ss: 'Spring Mattress' },
    { c: 'Dining', s: 'Dining Sets', ss: '4 Seater' },
    { c: 'Dining', s: 'Dining Sets', ss: '8 Seater' },
    { c: 'Dining', s: 'Dining Furniture', ss: 'Dining Tables' },
    { c: 'Dining', s: 'Dining Furniture', ss: 'Dining Chairs' },
    { c: 'Dining', s: 'Dining Furniture', ss: 'Bar Stools' },
    { c: 'Dining', s: 'Kitchen', ss: 'Kitchen Cabinets' },
    { c: 'Dining', s: 'Kitchen', ss: 'Crockery Units' },
    { c: 'Storage', s: 'Living Storage', ss: 'TV Units' },
    { c: 'Storage', s: 'Living Storage', ss: 'Bookshelves' },
    { c: 'Storage', s: 'Living Storage', ss: 'Shoe Racks' },
    { c: 'Storage', s: 'Cabinets', ss: 'Sideboards' },
    { c: 'Storage', s: 'Cabinets', ss: 'Bar Cabinets' },
    { c: 'Study', s: 'Work', ss: 'Desks' },
    { c: 'Study', s: 'Work', ss: 'Chairs' }
];

allSubSubCategories.forEach(cat => {
    for (let i = 1; i <= 5; i++) {
        products.push({
            title: `Designer ${cat.ss} v${i}`,
            category: cat.c,
            subcategory: cat.s,
            subSubcategory: cat.ss,
            price: 12000 + (Math.random() * 20000),
            img: getFurnitureImg(cat.c, i + products.length),
            desc: `Elegant ${cat.ss} for your home.`,
            isNew: i === 1,
            sizes: ['Standard']
        });
    }
});

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        for (const p of products) {
            const product = new Product({
                ...p,
                rating: 0,
                reviews: 0,
                originalPrice: p.price + 5000
            });
            await product.save();
        }

        console.log(`Successfully seeded ${products.length} products with high-quality furniture images.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
