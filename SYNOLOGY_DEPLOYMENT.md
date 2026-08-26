# AL YAZI MANDI - Synology Deployment Guide

## Quick Start (Web Station)

### Step 1: Access Your Synology NAS
1. Open your browser and go to: `https://abucrypt.sg4.quickconnect.to/`
2. Login with your Synology account credentials

### Step 2: Prepare Files for Upload
1. Zip the app files (all .html, .js, .css, and .png files in the root directory)
2. Or download the pre-packaged `alyazi-mandi-app.zip` if provided

### Step 3: Create Web Directory in Synology
1. Open **File Station** from the Synology desktop
2. Navigate to: `web` folder (or create if it doesn't exist)
3. Create a new folder: `alyazi-mandi` (or any name you prefer)
4. Upload all app files into this folder:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `kitchen.html`
   - `al-yazi-mandi-logo.png`
   - `al-yazi-mandi-logo-inverted.png`

### Step 4: Configure Web Station
1. Open **Web Station** from Package Center (install if needed)
2. Click on **HTTP Backend**
3. Create/Configure a virtual host:
   - **Hostname**: `alyazi-mandi` (or your domain)
   - **Document Root**: Select the folder you created in Step 3
   - **HTTP Port**: 80 (or 8080)
4. Click **Save**

### Step 5: Access Your App
- **Local Network**: `http://[NAS-IP-or-name]:80/`
- **Remote (QuickConnect)**: `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`

## Features Available
✅ Restaurant POS system with menu management  
✅ Table-based ordering  
✅ KOT (Kitchen Order Ticket) printing  
✅ Payment processing (Cash, UPI, Card)  
✅ Sales reports  
✅ User management with roles  
✅ Image management for menu items  
✅ Fully offline-capable (uses localStorage)  

## Data Persistence
- All data is stored in **browser localStorage**
- Data is preserved between sessions on the same browser/device
- To backup: Export data from "Sales reports" > Export Excel
- To reset: Clear browser cache/cookies

## Optional: Enable HTTPS/SSL
1. In **Web Station**, select your virtual host
2. Click **Edit** → **SSL Certificate**
3. Use Let's Encrypt (free) or upload your certificate
4. Enable HTTPS redirect

## Troubleshooting

### App not loading?
- Check File Station - all files in correct folder
- Verify Web Station virtual host is enabled
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for errors

### Images not showing?
- Ensure PNG files are in the same directory as HTML
- Check browser console for 404 errors
- Verify file permissions in Synology

### Can't access remotely?
- Enable QuickConnect in Synology Control Panel
- Make sure port 443 is not blocked by ISP/firewall
- Wait a few minutes after enabling QuickConnect

## Advanced: Docker Deployment
If you prefer containerization, a Dockerfile is available.

## Support
For issues or custom configurations, refer to Synology's official documentation:
https://www.synology.com/en-global/support/download

---
**App Version**: 1.0  
**Last Updated**: 2026-08-23  
**Compatibility**: All Synology NAS models with DSM 6+
