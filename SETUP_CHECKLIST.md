# Synology Setup - Quick Checklist

## ✅ Pre-Deployment Checklist

- [ ] Have access to: https://abucrypt.sg4.quickconnect.to/
- [ ] Web Station is installed (Package Center)
- [ ] Have admin login credentials
- [ ] Downloaded all app files
- [ ] Have file upload capability

---

## 📋 Installation Checklist

### Step 1: Create Directories
- [ ] Open File Station
- [ ] Navigate to volume/home
- [ ] Create folder: `web` (if doesn't exist)
- [ ] Inside `web`, create folder: `alyazi-mandi`

### Step 2: Upload Files
- [ ] Upload `index.html` to `/web/alyazi-mandi/`
- [ ] Upload `app.js` to `/web/alyazi-mandi/`
- [ ] Upload `styles.css` to `/web/alyazi-mandi/`
- [ ] Upload `kitchen.html` to `/web/alyazi-mandi/`
- [ ] Upload `al-yazi-mandi-logo.png` to `/web/alyazi-mandi/`
- [ ] Upload `al-yazi-mandi-logo-inverted.png` to `/web/alyazi-mandi/`
- [ ] Verify all 6 files are present

### Step 3: Configure Web Station
- [ ] Open Web Station from Package Center
- [ ] Go to "HTTP Backend" or "General" tab
- [ ] Click "+" or "Create" to add Virtual Host
- [ ] Set Hostname: `alyazi-mandi`
- [ ] Set Port: `80`
- [ ] Set Document Root: `/web/alyazi-mandi`
- [ ] Set Backend: `nginx` (default)
- [ ] Enable checkbox: ☑ Enable this virtual host
- [ ] Click "Apply" or "OK"

### Step 4: Test Access
- [ ] Access via QuickConnect: https://abucrypt.sg4.quickconnect.to/alyazi-mandi/
- [ ] OR Local IP: http://[NAS-IP]/alyazi-mandi/
- [ ] Page loads without errors
- [ ] Logo visible in top-left
- [ ] Menu items displayed
- [ ] Images are showing

### Step 5: First Login
- [ ] Login with: `Restaurant Owner` / `admin123`
- [ ] Settings button accessible
- [ ] Can navigate menu categories
- [ ] Can add items to order

---

## 🔒 Security Setup (Optional)

- [ ] Change default password (Settings → Users)
- [ ] Enable HTTPS (Web Station → Manage Certificate)
- [ ] Set up Let's Encrypt SSL (free)
- [ ] Enable backup (Control Panel → Data Protection)

---

## 🎯 Final Verification

| Check | Status |
|-------|--------|
| App loads on browser | ⬜ |
| Logo displays correctly | ⬜ |
| Menu items show images | ⬜ |
| Can select menu category | ⬜ |
| Can add items to ticket | ⬜ |
| Settings panel opens | ⬜ |
| Login works | ⬜ |
| Responsive on mobile | ⬜ |

---

## 📞 Troubleshooting Quick Links

| Problem | Quick Fix |
|---------|-----------|
| 404 Error | Check files in `/web/alyazi-mandi/` |
| Images missing | Re-upload PNG files |
| Won't load | Restart Web Station |
| Slow access | Enable compression in Web Station |
| Can't access remote | Check QuickConnect enabled |

---

## 🚀 Go Live Checklist

- [ ] App accessible from internet
- [ ] Database backed up (export sales)
- [ ] Users created (Settings → Users)
- [ ] Menu items configured (Settings → Menu)
- [ ] Payment methods set (Settings → UPI accounts)
- [ ] WhatsApp numbers saved (Settings → Workflow)
- [ ] Test order → KOT → Payment flow
- [ ] Printer configured (if needed)

---

## 📱 Access Your App

**Once deployed, access at:**

```
🌍 Remote: https://abucrypt.sg4.quickconnect.to/alyazi-mandi/
🏠 Local:  http://192.168.1.100/alyazi-mandi/
📱 Mobile: Same as above URLs (fully responsive)
```

---

**Status: Ready for Deployment** ✨
