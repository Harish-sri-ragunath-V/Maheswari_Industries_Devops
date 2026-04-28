# 🏆 Maheswari Industries
## Furniture Showroom Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)

> A modern, fully responsive, and feature-rich e-commerce website for premium handcrafted furniture with an intuitive admin dashboard.

---

## ✨ Key Features

### 👥 Customer Experience
| Feature | Description |
|---------|-------------|
| 🏠 **Hero Section** | Animated welcome with gradient effects |
| 🛍️ **Product Catalog** | Search, filter by category, and browse furniture |
| 📷 **Gallery** | Beautiful showcase of furniture collections |
| 💬 **Enquiry System** | Ask questions about specific products |
| 🛒 **Shopping Cart** | Add items, manage quantities, checkout |
| 👤 **User Accounts** | Register, login, and manage profile |
| 📧 **Newsletter** | Stay updated with new offerings |

### 🛠️ Admin Powers
| Feature | Description |
|---------|-------------|
| 🔐 **Secure Dashboard** | Accessible via profile dropdown or `/admin.html` |
| ➕ **Product Management** | Add/edit products with image uploads |
| 🖼️ **Gallery Control** | Upload and organize furniture showcase images |
| 📧 **Message Hub** | View and respond to customer enquiries |
| 👥 **User Directory** | Track registered customers |
| 📊 **Analytics** | Dashboard with key statistics |

### 🎯 Technical Excellence
```
✅ Fully Responsive (Mobile, Tablet, Desktop)
✅ Modern UI with Gradients & Animations
✅ MongoDB Backend with Local Storage Fallback
✅ Secure Authentication System
✅ Outfit Typography for Premium Feel
✅ Cross-Browser Compatible
```

---

## 📂 Project Structure

```
Maheswari_Industries_Devops/
│
├── 📁 frontend/                    # Client-Side Application
│   ├── 📄 index.html               # Home Page & Main Store
│   ├── 📄 admin.html               # Admin Dashboard
│   ├── 📄 cart.html                # Shopping Cart Interface
│   ├── 📄 orders.html              # Order Tracking
│   ├── 📄 product-detail.html      # Product Details View
│   ├── 📁 css/                     # Stylesheets & Design
│   ├── 📁 js/                      # Frontend Logic & Handlers
│   └── 📁 img/                     # Static Assets (Logo, Icons)
│
└── 📁 backend/                     # Server & Database Layer
    ├── Node.js Express Server
    └── MongoDB Models & Schema
```

---

## 🚀 Getting Started

### Default Credentials

#### 👤 Regular User
```
Username: user
Password: user123
```

#### 🔑 Admin User
```
Username: admin
Password: admin123
```

---

## 📖 User Guides

### 🛒 For Customers

**1️⃣ Browse & Discover**
```
→ Explore product collections on homepage
→ Use search bar for specific items
→ Filter by furniture categories
```

**2️⃣ View Gallery**
```
→ Scroll to furniture gallery section
→ Click images for detailed view
→ Get inspiration from collections
```

**3️⃣ Product Enquiry**
```
→ Click "Enquire" on any product
→ Fill details & ask questions
→ Admin responds with information
```

**4️⃣ Shopping Cart**
```
→ Click cart icon to view items
→ Adjust product quantities
→ Proceed to checkout
```

**5️⃣ Account Management**
```
→ Click "Sign Up" to register
→ Click "Login" to access account
→ Manage profile & orders
```

### 🎛️ For Admin

#### 🔓 Access Dashboard
1. Click lock icon in header OR click "Admin" button
2. Enter: `admin` / `admin123`
3. Redirect to admin dashboard ✓

#### ➕ Add Products
1. Navigate to **Products** tab
2. Click **Add Product** button
3. Fill product details (name, price, description)
4. **Upload image from computer** (local file required)
5. Click **Save** ✓

#### 🖼️ Manage Gallery
1. Go to **Gallery** tab
2. Click **Upload Image** button
3. Enter image title
4. Select image from computer
5. Public gallery auto-updates ✓

#### 📧 Handle Messages
1. Open **Messages** tab
2. View all customer enquiries
3. Mark status:
   - ✅ **Accepted** - Confirmed enquiry
   - 💬 **Responded** - Already replied
   - ❌ **Declined** - Not relevant
4. Access customer contact info

#### 👥 Review Users
1. Go to **Users** tab
2. View all registered customers
3. Track user information & registration dates

---

## 🎨 Customization Guide

### 🏢 Update Business Details
Edit footer in `index.html` and `admin.html`:
```
✏️ Contact information
✏️ Business address
✏️ Phone numbers & email
✏️ Social media links
```

### 🎨 Change Color Scheme
Edit CSS variables in `frontend/css/style.css`:
```css
:root {
    --primary: #8B4513;           /* Saddle Brown */
    --accent: #D4A574;            /* Tan Accent */
    --font-main: 'Outfit', sans-serif;
}
```

### 📦 Add New Categories
Update in these files:
```
→ index.html (product filters dropdown)
→ admin.html (add product form)
```

---

## 📱 Responsive Design

| Device | Width | Optimization |
|--------|-------|--------------|
| 🖥️ Desktop | 1024px+ | Full layout |
| 📱 Tablet | 768px - 1023px | Medium layout |
| 📱 Mobile | < 768px | Compact layout |
| 📱 Small Mobile | < 480px | Minimal layout |

---

## 🔒 Security & Best Practices

⚠️ **Current Implementation:**
```
⚡ Demo/local application using browser localStorage
⚡ Passwords stored in plain text (demo only)
⚡ Client-side authentication
```

🛡️ **Production Recommendations:**
```
✓ Use encrypted backend authentication
✓ Implement secure password hashing (bcrypt, argon2)
✓ Store data on secure server, not localStorage
✓ Use HTTPS only
✓ Implement proper authorization checks
✓ Add rate limiting & CSRF protection
✓ Regular security audits
```

---

## 💡 Optimization Tips

| Tip | Benefit |
|-----|---------|
| 📸 **High-Quality Images** | Better product presentation |
| 📝 **Clear Descriptions** | Improved customer experience |
| ⚡ **Quick Response Time** | Higher customer satisfaction |
| 🏷️ **Descriptive Titles** | Better gallery organization |
| 🔄 **Regular Updates** | Keep contact info current |

---

## 🐛 Troubleshooting

### 📸 Images Not Showing?
```
→ Check file format (JPG, PNG, GIF, WebP supported)
→ Open browser console (F12) for errors
→ Refresh page and retry
→ Verify image upload completed
```

### 💾 Data Not Saving?
```
→ Check browser storage capacity
→ Clear browser cache
→ Try incognito/private browsing mode
→ Verify localStorage is enabled
```

### 🔐 Can't Login to Admin?
```
→ Verify credentials: admin / admin123
→ Check cookies/storage enabled
→ Try different browser
→ Clear browser cache and cookies
```

---

## 📊 Tech Stack

```
Frontend:     Vanilla JavaScript + HTML5 + CSS3
Backend:      Node.js + Express
Database:     MongoDB
Storage:      Browser LocalStorage (fallback)
Typography:  Outfit Font Family
Styling:     Custom CSS with Gradients & Animations
```

---

## 📄 Project Information

| Aspect | Details |
|--------|---------|
| 📌 Version | 2.0 |
| 📅 Last Updated | April 2026 |
| 👨‍💻 Developer | Harish Sri Ragunath V |
| 🏢 Client | Maheswari Industries |
| 📜 License | Free to Modify & Use |

---

## 🤝 Support & Contribution

For local modifications:
1. Edit HTML, CSS, or JavaScript files
2. Refresh browser to see changes
3. Data persists in browser storage
4. Test across different devices

---

<div align="center">

### 🌟 Built with ❤️ for Maheswari Industries

**Made to Showcase Premium Furniture with Modern Technology**

</div>
