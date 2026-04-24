# HostelMate - Quick Start Guide

## 🚀 Before Presentation

### 1. Update MongoDB Connection
Edit `config.env`:
```
ATLAS_URI=mongodb://127.0.0.1:27017/hostelmate
PORT=5050
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
```bash
node seed.js
```

### 4. Start Server
```bash
npm start
```

### 5. Open Application
```
http://localhost:5050
```

## 🔐 Login Credentials

**Admin Account:**
- Email: `admin@hostel.com`
- Password: `123`

**Student Account:**
- Email: `student@hostel.com`
- Password: `123`

**Student Account 2:**
- Email: `amit@hostel.com`
- Password: `123`

## 📋 Demo Flow

### Student Demo:
1. Login as Student
2. View Dashboard (mess menu, pending complaints)
3. Submit a new complaint
4. View mess menu
5. Check lost & found items
6. Post a lost item

### Admin Demo:
1. Login as Admin
2. View Dashboard (complaint statistics)
3. Post a notice
4. Manage complaints (resolve/delete)
5. Update mess menu
6. Take attendance
7. View lost & found items

## ✅ Features to Highlight

- **Role-Based Access Control**: Students and Admins see different interfaces
- **Real-time Updates**: All data synced with MongoDB
- **Responsive Design**: Works on all screen sizes
- **Native MongoDB Driver**: Using official MongoDB driver (not Mongoose)
- **ES Modules**: Modern JavaScript architecture
- **RESTful API**: Clean API endpoints

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB (Native Driver)
- ES Modules

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## 📁 Project Structure

```
HostelMatetemp/
├── db/
│   └── connection.js       # MongoDB connection
├── routes/
│   └── hostel.js          # API routes
├── public/
│   ├── assets/            # Images, icons
│   ├── css/               # Stylesheets
│   ├── scripts/           # Frontend JS
│   └── *.html             # HTML pages
├── config.env             # Environment variables
├── server.js              # Main server file
├── seed.js                # Database seeding script
└── package.json           # Dependencies
```

## 🔧 Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `mongod`
- Check connection string in `config.env`

**Port already in use?**
- Change PORT in `config.env`
- Update frontend scripts if changing port

**Database empty?**
- Run `node seed.js` again

## 📞 Support

For issues, check:
1. MongoDB is running
2. Dependencies are installed
3. config.env is properly configured
4. Port 5050 is available
