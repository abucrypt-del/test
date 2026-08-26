# Synology Web Station Configuration - Step by Step Guide

## ✅ Prerequisites
- Access to your Synology at: https://abucrypt.sg4.quickconnect.to/
- Admin/Super Admin privileges
- Web Station package installed (if not, install from Package Center)

---

## 📝 STEP 1: Install Web Station (if not already installed)

1. **Login to your Synology** → https://abucrypt.sg4.quickconnect.to/
2. Click **Package Center** (icon with gift box)
3. Search for **"Web Station"**
4. Click **Install** (wait for completion)
5. Once installed, click **Open**

---

## 📂 STEP 2: Upload App Files to Synology

### Method A: Using File Station (Recommended)

1. **Open File Station** from the desktop
   
2. **Navigate to the web directory**:
   - Click on the **home icon** or **volume** in left sidebar
   - Look for a folder called `web`
   - If it doesn't exist, create it:
     - Right-click → **New** → **Folder**
     - Name it: `web`

3. **Create app folder**:
   - Double-click `web` folder to enter it
   - Right-click → **New** → **Folder**
   - Name it: `alyazi-mandi`

4. **Upload your app files**:
   - Double-click to open `alyazi-mandi` folder
   - Drag & drop OR click **Upload** button
   - Select and upload these 6 files:
     ```
     ✓ index.html
     ✓ app.js
     ✓ styles.css
     ✓ kitchen.html
     ✓ al-yazi-mandi-logo.png
     ✓ al-yazi-mandi-logo-inverted.png
     ```

5. **Verify upload**:
   - All 6 files should appear in the folder
   - Right-click each file → **Properties** → Verify size matches

---

## 🌐 STEP 3: Configure Web Station Virtual Host

### Part A: Basic Setup

1. **Open Web Station** (from Package Center or main menu)

2. **Click on the "HTTP Backend" tab** (or "General" tab in some DSM versions)

3. **Look for "Virtual Host" or "Web Services"** section

4. **Click the "+" button** or **"Create"** to add new virtual host

### Part B: Configure Virtual Host

**Fill in these fields**:

| Field | Value |
|-------|-------|
| **Hostname** | `alyazi-mandi` (or your-domain.com if you have one) |
| **Port** | `80` (HTTP) or `443` (HTTPS) |
| **Document Root** | `/web/alyazi-mandi` |
| **Backend** | `nginx` or default option |
| **Status** | ✅ **Enable** (checkbox) |

**Example Screenshot Description**:
```
┌─ Web Station - Virtual Host ─────────────────────────┐
│                                                       │
│ Hostname: [alyazi-mandi________________]             │
│ Port: [80_____________]                              │
│ Document Root: [/web/alyazi-mandi_________]          │
│ Backend: [nginx________________▼]                    │
│ ☑ Enable this virtual host                           │
│                                                       │
│ [Cancel] [Apply]                                     │
└─────────────────────────────────────────────────────┘
```

5. **Click "Apply" or "OK"** to save

---

## 🔗 STEP 4: Access Your App

### Local Network (LAN):
```
http://[NAS-IP]:80/
```
Example: `http://192.168.1.100/`

Find your NAS IP:
- Control Panel → Network → General → IPv4 Address

### Remote Access (QuickConnect):
```
https://abucrypt.sg4.quickconnect.to/alyazi-mandi/
```

### Via hostname (if configured):
```
http://alyazi-mandi.local/
```

---

## 🔐 STEP 5: Enable HTTPS/SSL (Optional but Recommended)

### If using QuickConnect (HTTPS enabled by default):
1. Virtual host settings automatically use HTTPS
2. Your app is already secure at: `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`

### If using local access with custom domain:

1. **In Web Station Virtual Host settings**:
   - Check: ☑ **Enable HTTPS**
   - Certificate: **Use Synology's self-signed cert** OR
   - Click **Manage Certificate** → **Let's Encrypt** (free)

2. **Set HTTP to HTTPS redirect**:
   - Enable: ☑ **Redirect HTTP to HTTPS**

---

## ✅ STEP 6: Test Your App

1. **Open browser** and go to:
   - `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`

2. **You should see**:
   ```
   AL YAZI MANDI RESTRAUNT
   "What are we serving?"
   Menu categories (All items, Mandi, Chicken Mandi, BBQ, Extras)
   Menu items with images
   ```

3. **First login**:
   - Username: `Restaurant Owner`
   - Password: `admin123`
   - Change this in Settings → Users

---

## 🐛 Troubleshooting

### ❌ App not loading? "404 Not Found"

**Solution 1**: Check file path
- File Station → Navigate to `/web/alyazi-mandi/`
- Verify all 6 files are there
- If missing, upload them again

**Solution 2**: Verify virtual host
- Web Station → Check virtual host is **Enabled** ☑
- Document Root shows: `/web/alyazi-mandi`
- Click **Apply** again

**Solution 3**: Restart Web Station
- Web Station → Menu (top-right) → **Restart**
- Wait 30 seconds and refresh browser

### ❌ Images not showing?

**Solution**: Check image files uploaded
- File Station → Open `/web/alyazi-mandi/`
- Verify these files exist:
  - ✓ `al-yazi-mandi-logo.png`
  - ✓ `al-yazi-mandi-logo-inverted.png`
- File size should be ~35KB each
- If missing, upload them

### ❌ Can't access from outside (remote)?

**Solution**: 
1. Control Panel → External Access → Enable QuickConnect
2. Wait 5-10 minutes for QuickConnect to register
3. Try: `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`

### ❌ Browser shows warning "Not secure"

**Normal for self-signed certificates**
- Click **Advanced** → **Proceed anyway**
- To fix: Install Let's Encrypt certificate in Web Station

---

## 🎯 Important Settings in Web Station

### Performance:
- **PHP settings**: Not needed (app is HTML/JS only)
- **Compression**: Enable for faster loading
- **Caching**: Enable browser caching

### Security:
- Enable HTTPS (SSL/TLS)
- Set strong admin password in Control Panel
- Keep DSM updated

### Backup:
- Control Panel → Data Protection → Scheduled Backup
- Synology will backup app files automatically

---

## 📱 Access Your App

| Method | URL | Access From |
|--------|-----|------------|
| **QuickConnect** | `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/` | Anywhere |
| **Local IP** | `http://192.168.x.x/alyazi-mandi/` | Same network |
| **Hostname** | `http://alyazi-mandi.local/` | Same network (if mDNS enabled) |

---

## 🎉 Success Indicators

✅ Page loads without errors  
✅ Logo appears in top-left  
✅ Menu items display with images  
✅ Can click on menu items  
✅ Settings button works  
✅ Can login as "Restaurant Owner"  

---

## 🔄 Common Issues Solved

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 Not Found | Files in wrong folder | Upload to `/web/alyazi-mandi/` |
| Blank page | Missing index.html | Check file is uploaded |
| Images broken | Wrong path/missing files | Verify PNG files in folder |
| Can't login | Browser cache | Clear cache: Ctrl+Shift+Del |
| Slow loading | Large file size | Enable compression in Web Station |

---

## 📞 Additional Help

**Get your NAS IP address**:
1. Control Panel → Network → General
2. Look for "IPv4 Address" (e.g., 192.168.1.100)

**Access Control Panel**:
- https://abucrypt.sg4.quickconnect.to/ → Control Panel (gear icon)

**Synology Support**:
- https://www.synology.com/en-global/support

---

## ✨ What's Next?

Once your app is live:
1. **Change admin password**: Settings → Users
2. **Add menu items**: Settings → Menu & pricing
3. **Configure payments**: Settings → Printers → UPI accounts
4. **Set up WhatsApp**: Settings → Workflow settings
5. **Customize images**: Settings → Menu & pricing → Image column

**Your restaurant POS is now online!** 🎉
