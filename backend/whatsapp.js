// ============================================================
// 📱 WHATSAPP INTEGRATION MODULE
// File: backend/whatsapp.js
// ============================================================

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Use the bundled Chromium from puppeteer@21 (compatible with whatsapp-web.js)
const puppeteer = require("puppeteer");
const CHROME_PATH = puppeteer.executablePath();

// ── ADMIN PHONE NUMBER ──────────────────────────────────────
// 🔧 Admin WhatsApp Number: +91 6380442089
// Format: CountryCode + PhoneNumber + @c.us (no + or spaces)
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP || "916380442089@c.us";
// ────────────────────────────────────────────────────────────

// Track readiness so we don't try to send before connected
let isClientReady = false;

// ── CLIENT SETUP ─────────────────────────────────────────────
// FIX: Uses a pre-cached WhatsApp Web HTML from GitHub instead of
// loading web.whatsapp.com live (which causes ERR_CONNECTION_TIMED_OUT
// in headless Chrome environments).
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./.wwebjs_auth"
    }),

    // ── 🔧 PUPPETEER: Uses bundled Chromium from puppeteer@21 ────
    puppeteer: {
        headless: true,
        executablePath: CHROME_PATH,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--disable-extensions"
        ]
    }
    // ──────────────────────────────────────────────────────────
});

// ── QR CODE: Scan with WhatsApp → Linked Devices ────────────
client.on("qr", (qr) => {
    console.log("\n📱 [WhatsApp] =============================================");
    console.log("📱 [WhatsApp] Scan this QR code with your phone:");
    console.log("📱 [WhatsApp] =============================================\n");
    qrcode.generate(qr, { small: true });
    console.log("\n➡  Open WhatsApp on your phone");
    console.log("➡  Tap ⋮ Menu (3 dots) → Linked Devices → Link a Device");
    console.log("➡  Point camera at the QR above\n");
});

// ── READY ─────────────────────────────────────────────────────
client.on("ready", () => {
    isClientReady = true;
    console.log("✅ [WhatsApp] Client is ready! Notifications will be sent to +91 6380442089");
});

// ── AUTHENTICATED ──────────────────────────────────────────────
client.on("authenticated", () => {
    console.log("🔐 [WhatsApp] Authenticated — session saved. No QR needed next time.");
});

// ── AUTH FAILURE ───────────────────────────────────────────────
client.on("auth_failure", (msg) => {
    isClientReady = false;
    console.error("❌ [WhatsApp] Auth failed:", msg);
});

// ── DISCONNECTED ───────────────────────────────────────────────
client.on("disconnected", (reason) => {
    isClientReady = false;
    console.warn("⚠️  [WhatsApp] Disconnected:", reason);
});

// ── LOADING SCREEN ─────────────────────────────────────────────
client.on("loading_screen", (percent, message) => {
    console.log(`⏳ [WhatsApp] Loading... ${percent}% — ${message}`);
});

// ── SEND ORDER NOTIFICATION ────────────────────────────────────
/**
 * Sends WhatsApp order notifications to both admin AND customer.
 * Called automatically from POST /orders in server.js
 *
 * @param {Object} orderData
 */
async function sendOrderNotification(orderData) {
    if (!isClientReady) {
        console.warn("⚠️  [WhatsApp] Client not ready yet — notification skipped.");
        return;
    }

    const { customerName, phone, items, totalAmount, paymentMethod, shippingAddress } = orderData;

    // Format each item in the order
    const itemList = items
        .map((item, i) =>
            `  ${i + 1}. ${item.title} × ${item.qty}  →  ₹${(item.price * item.qty).toLocaleString("en-IN")}`
        )
        .join("\n");

    // ── MESSAGE FOR ADMIN ──────────────────────────────────────
    const adminMessage =
`🛒 *New Order — Sri Maheswari Industries*

👤 *Customer:* ${customerName}
📞 *Phone:* ${phone}
📍 *Address:* ${shippingAddress.address}, ${shippingAddress.city} — ${shippingAddress.pincode}

🪑 *Items Ordered:*
${itemList}

💰 *Total:* ₹${totalAmount.toLocaleString("en-IN")}
💳 *Payment:* ${paymentMethod}

🕐 *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

✅ Login to admin dashboard to update order status.`;

    // ── MESSAGE FOR CUSTOMER ───────────────────────────────────
    const customerMessage =
`✅ *Order Confirmed — Sri Maheswari Industries*

Thank you for your order, ${customerName}! 🎉

🪑 *Items Ordered:*
${itemList}

💰 *Order Total:* ₹${totalAmount.toLocaleString("en-IN")}
💳 *Payment Method:* ${paymentMethod}

📍 *Delivery Address:*
${shippingAddress.address}
${shippingAddress.city} — ${shippingAddress.pincode}

🕐 *Order Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

You can track your order status through our website. We will notify you once your order is out for delivery.
Thank you for shopping with Sri Maheswari Industries! 🙏`;

    try {
        // Send notification to ADMIN
        await client.sendMessage(ADMIN_WHATSAPP_NUMBER, adminMessage);
        console.log("✅ [WhatsApp] Order notification sent to admin (+91 6380442089)");

        // Send confirmation to CUSTOMER
        // Format customer phone number for WhatsApp: remove special chars and add @c.us
        const customerWhatsAppNumber = phone.replace(/\D/g, "").slice(-10);
        const fullCustomerNumber = `91${customerWhatsAppNumber}@c.us`;
        
        await client.sendMessage(fullCustomerNumber, customerMessage);
        console.log(`✅ [WhatsApp] Order confirmation sent to customer (+91${customerWhatsAppNumber})`);
    } catch (err) {
        console.error("❌ [WhatsApp] Failed to send message:", err.message);
    }
}

// ── INITIALIZE ─────────────────────────────────────────────────
console.log("⏳ [WhatsApp] Starting client... (may take 20–30 seconds)");
client.initialize();

// ============================================================
// Exports
// ============================================================
module.exports = { client, sendOrderNotification, isClientReady: () => isClientReady };
