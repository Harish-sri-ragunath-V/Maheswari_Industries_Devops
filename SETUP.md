# Setup & Installation Guide

## 📋 System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server needed - works locally
- No database required - uses browser storage
- No dependencies to install

## 🚀 How to Run the Website

### Option 1: Development Server (Recommended)
1. Navigate to the project folder: `d:\MENTOR\Consultany Projects\Maheswari Industries\`
2. Open a terminal in the `backend` directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` or `node server.js` to start the backend.
5. Open `frontend/index.html` in your browser.

### Option 2: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Website opens in browser with live reload

### Option 3: Using Python Server (if Python installed)
```bash
# Navigate to project directory
cd "d:\MENTOR\Consultany Projects\Maheswari Industries\backend"

# For Python 3
python -m http.server 8000

# For Python 2
python -m SimpleHTTPServer 8000
```
Then open: `http://localhost:8000`

## 📂 Project Files Overview

```
Maheswari Industries/
├── frontend/            # All client-side files
│   ├── index.html       # Landing page
│   ├── css/style.css    # Modern styles (Outfit Font)
│   └── js/script.js     # Core logic
├── backend/             # Node.js Express server
│   ├── server.js        # API entry point
│   └── models/          # Database schemas
└── SETUP.md             # This file
```

## 🔑 Initial Setup

### No configuration needed!
The website works out of the box with demo data included.

### Optional: Reset All Data
To start fresh and clear all saved data:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page

## 🎯 Quick Start

### First Visit
1. Open `index.html` in browser
2. Browse products and gallery
3. Click on products to enquire
4. Add items to cart
5. Register a new user account

### Admin Access
1. Click the lock icon in header
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Admin Dashboard" button or go to `/frontend/admin.html`

### Features to Try
- [ ] Search for products
- [ ] Filter by category
- [ ] View furniture gallery
- [ ] Submit product enquiry
- [ ] Create user account
- [ ] Add product to cart
- [ ] Submit contact form
- [ ] Login as admin
- [ ] Add new product
- [ ] Upload gallery image
- [ ] View customer messages

## 🎨 Customization

### Change Business Details
Edit these files to update company information:

**Footer Content** - In `index.html` and `frontend/admin.html`:
```html
<!-- Change contact details -->
<li><i class="fas fa-map-marker-alt"></i> Your Address</li>
<li><i class="fas fa-phone"></i> Your Phone</li>
<li><i class="fas fa-envelope"></i> Your Email</li>
```

### Change Color Scheme
In `css/style.css`, update the `:root` variables:
```css
:root {
    --primary: #8B4513;        /* Saddle Brown */
    --accent: #D4A574;         /* Tan */
    --font-main: 'Outfit', sans-serif;
    /* ... other colors ... */
}
```

### Add More Product Categories
1. Edit `index.html` - Update category dropdown in filters section
2. Edit `admin.html` - Update category select in add product modal
3. Admin can now add products in new categories

### Change Hero Image
In `css/style.css`, find `.hero` section:
```css
.hero {
    background-image: url('YOUR_IMAGE_URL');
    /* ... other properties ... */
}
```

## 📊 Initial Demo Data

### Products Included
- Solid Wood Dining Table (₹25,999)
- Mid-Century Armchair (₹8,999)
- Minimalist Coffee Table (₹4,999)
- Velvet Sofa (₹35,999)
- Modern Bookshelf (₹12,499)
- Bedside Lamp (₹2,499)

### Demo Users
- **Regular User:** user / user123
- **Admin:** admin / admin123

## 🧪 Testing the Features

### Test Product Search
1. Type in search box: "sofa"
2. Should show only velvet sofa
3. Clear search to see all products

### Test Admin Features
1. Login as admin
2. Go to admin dashboard
3. Try adding a product
4. Try uploading gallery image
5. Check messages tab

### Test Responsive Design
1. Open browser DevTools (F12)
2. Click device toolbar
3. Test on different screen sizes:
   - Mobile: 320px - 480px
   - Tablet: 768px - 1024px
   - Desktop: 1024px+

### Test User Registration
1. Click "Sign Up" button
2. Create new account with details
3. Try logging in with new credentials
4. Check if shopping cart works

## 🐛 Troubleshooting

### Website won't load
- Check if file is in correct location
- Try opening in different browser
- Clear browser cache (Ctrl+Shift+Delete)

### Images not showing
- Ensure images are uploaded from computer
- Check image file format (JPG, PNG, etc.)
- Refresh page (Ctrl+R)
- Check browser console for errors

### Can't login
- Verify correct username/password
- Check if cookies enabled
- Try incognito/private window
- Clear localStorage: `localStorage.clear()`

### Data not saving
- Check browser storage isn't full
- Enable localStorage in browser settings
- Try different browser
- Check browser extensions aren't blocking storage

## 📝 Important Notes

### Data Storage
- All data stored in browser's localStorage
- Data persists until browser cache is cleared
- Different browsers have separate storage
- Maximum storage ~5-10MB (usually enough)

### Image Uploads
- Always upload images from your computer
- Avoid very large images (>5MB)
- Supported formats: JPG, PNG, GIF, WebP
- Images converted to Base64 format

### Best Practices
1. Keep product descriptions clear and concise
2. Use high-quality product images
3. Respond to customer enquiries promptly
4. Update gallery regularly with new images
5. Keep contact information current

## 🔐 Security Notes

### For Development/Demo Only
- This is NOT production-ready
- Passwords stored in plain text
- No server-side encryption
- Use for local/demo purposes only

### For Production Use
- Implement proper backend
- Use encrypted password storage
- Add server-side validation
- Use HTTPS protocol
- Implement rate limiting
- Add spam protection

## 📞 Support

### Common Questions

**Q: Where are my images stored?**
A: In browser's localStorage as Base64 encoded data. They persist until you clear browser data.

**Q: Can I access data from another browser?**
A: No, each browser has separate storage. Data stored in Chrome won't appear in Firefox.

**Q: How do I backup my data?**
A: Use browser console: `JSON.stringify(localStorage)` to export data.

**Q: Can I use this on a mobile phone?**
A: Yes! Website is fully responsive and works on all modern phones.

**Q: What if I accidentally delete a product?**
A: Add it again. You can also restore data by not clearing browser cache.

## ✅ Verification Checklist

After setup, verify these work:
- [ ] Home page loads without errors
- [ ] Products display correctly
- [ ] Search works
- [ ] Can add product to cart
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Admin dashboard loads
- [ ] Can add new product (as admin)
- [ ] Can upload gallery image
- [ ] Can submit enquiry form
- [ ] Footer displays all info
- [ ] Mobile view is responsive

## 🎓 Learning Resources

### Understanding the Code
- HTML: Structure and content
- CSS: Styling and animations
- JavaScript: Functionality and interactions

### Key JavaScript Functions
- `renderProducts()` - Display products
- `addToCart()` - Add item to shopping cart
- `handleAuth()` - User login/register
- `addProduct()` - Admin add product
- `renderGallery()` - Display gallery

### Key CSS Classes
- `.btn` - Button styling
- `.card` - Product card styling
- `.auth-modal` - Modal dialog
- `.gallery-grid` - Gallery layout
- `.hero` - Hero section

---

**Version:** 2.0  
**Last Updated:** March 2026  
**Status:** Ready for Use ✅
