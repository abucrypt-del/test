# How to Configure Document Root in Synology DSM 7/8

## ✅ Step 1: Go Back to Web Portal Settings

1. **Open Web Station**
2. Click **"Web Portal"** in left sidebar
3. You should see your created portal: **"alyazi-mandi"**
4. **Click on it** to edit it

---

## ✅ Step 2: Look for Document Root or Edit

The form should now show additional fields:

```
Portal Name:      alyazi-mandi
Hostname:         alyazi-mandi
Port:             80 / 443
Document Root:    [________________]  ← FILL THIS
```

**In Document Root field, enter:**
```
/volume1/web/alyazi-mandi
```

---

## 🔍 If You Don't See Document Root Field

Follow this alternative method:

### Method A: Use Web Service Instead

1. **Click "Web Service"** (left sidebar)
2. **Click "+"** to add new service
3. Fill in:
   ```
   Service Name:    alyazi-mandi
   Root Path:       /volume1/web/alyazi-mandi/
   Port:            80
   Backend:         nginx
   ```
4. **Click Apply**

---

### Method B: Create Files in Default Location

Synology Web Station's default document root is:
```
/volume1/web/
```

**So upload your files to:**
```
/volume1/web/alyazi-mandi/
```

1. **Open File Station**
2. **Navigate to:** `/volume1/` (or volume name)
3. **Create folder:** `web` (if doesn't exist)
4. **Create subfolder inside:** `alyazi-mandi`
5. **Upload all 6 files** into `alyazi-mandi` folder

---

## 📁 Correct File Structure

After setup, your files should be at:

```
/volume1/
└── web/
    └── alyazi-mandi/
        ├── index.html
        ├── app.js
        ├── styles.css
        ├── kitchen.html
        ├── al-yazi-mandi-logo.png
        └── al-yazi-mandi-logo-inverted.png
```

---

## ✅ Complete Setup Checklist

- [ ] Files uploaded to `/volume1/web/alyazi-mandi/`
- [ ] All 6 files present
- [ ] Web Portal created with hostname: `alyazi-mandi`
- [ ] Document root set to: `/volume1/web/alyazi-mandi`
- [ ] Portal is **Enabled** ✓
- [ ] Refresh browser
- [ ] Clear browser cache (Ctrl+Shift+Del)

---

## 🧪 Test Your Setup

1. **Open browser**
2. Go to: `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`
3. **You should see:**
   - AL YAZI MANDI logo
   - Menu items with images
   - Login screen

---

## 🐛 Still Not Working?

### Check 1: Verify Files Exist
```
File Station → Navigate to /volume1/web/alyazi-mandi/
Look for: index.html ✓
```

### Check 2: Check Web Station Status
```
Web Station → Overview
Default server status: Normal ✓
Web portal status: Normal ✓
```

### Check 3: Restart Web Station
```
Web Station → (top menu) → Restart
Wait 30 seconds
Refresh browser
```

### Check 4: Check Browser Cache
```
Press: Ctrl + Shift + Delete
Clear cache and cookies
Refresh page
```

---

## 📋 Document Root Paths in Synology

| Volume | Default Path |
|--------|--------------|
| Volume 1 | `/volume1/web/` |
| Volume 2 | `/volume2/web/` |
| Home folder | `/home/user/web/` |

Check which volume your Synology uses (usually Volume 1).

---

## ✨ Once Working

Once you see your app loading:

1. **Default login:**
   - Username: Restaurant Owner
   - Password: admin123

2. **Change password immediately** (Settings → Users)

3. **Start using your POS system!**

---

## 🚨 Common Mistakes

❌ Wrong path: `/web/alyazi-mandi/` (missing `/volume1`)  
✅ Correct path: `/volume1/web/alyazi-mandi/`

❌ Files in wrong folder: `/volume1/alyazi-mandi/`  
✅ Correct location: `/volume1/web/alyazi-mandi/`

❌ Missing index.html: App won't load  
✅ Verify: All 6 files are there

---

Let me know which volume you're using, and I can give you the exact path! 📁
