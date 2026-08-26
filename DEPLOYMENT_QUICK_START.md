# AL YAZI MANDI - Restaurant POS System
## Deployment Quick Guide for Synology

### 📦 What You're Getting
A complete restaurant POS system with:
- Menu management with image customization
- Table-based order management
- Kitchen Order Tickets (KOT)
- Payment processing (Cash, UPI, Card)
- Sales reports & analytics
- User management
- Fully offline-capable

### 🚀 Easiest Method: Web Station (3 minutes)

1. **Access your Synology**: https://abucrypt.sg4.quickconnect.to/
2. **Open File Station** → Navigate to `web` folder → Create `alyazi-mandi` folder
3. **Upload these files** to that folder:
   ```
   index.html
   app.js
   styles.css
   kitchen.html
   al-yazi-mandi-logo.png
   al-yazi-mandi-logo-inverted.png
   ```
4. **Open Web Station** → Create virtual host pointing to that folder
5. **Access at**: `https://abucrypt.sg4.quickconnect.to/alyazi-mandi/`

### 🐳 Alternative: Docker Method

If you have Docker enabled on Synology:

```bash
# SSH into your Synology, then:
cd /path/to/app
docker-compose up -d
```

Access at: `http://your-nas-ip:8080`

### 📱 First Login
- **User**: Restaurant Owner
- **Password**: admin123
- **Role**: Super Admin (change in Settings > Users)

### 💾 Data Backup
- All data stored in browser localStorage
- Export sales: Settings > Sales reports > Export Excel
- Data persists per browser/device

### 🎯 Next Steps
1. Change default password (Settings > Users)
2. Add your restaurant details (Settings > Print customization)
3. Configure payment methods (Settings > Printers)
4. Add WhatsApp integration (Settings > Workflow)
5. Customize menu images (Settings > Menu & pricing)

### 📞 Support Files
- `SYNOLOGY_DEPLOYMENT.md` - Detailed deployment guide
- `Dockerfile` - For Docker deployment
- `docker-compose.yml` - For easy Docker orchestration

---
**Ready to go live!** 🎉
