# HostelMate 🏠

A full-stack hostel management system built for college campuses. HostelMate streamlines day-to-day hostel operations — from mess menus and attendance to complaints and leave requests — all in one clean web interface.

**🔗 Live Demo:** [hostelmate-ivory.vercel.app](https://hostelmate-ivory.vercel.app)

---

## Features

**Student Portal**
- 🍽️ View weekly mess menu
- 📋 Submit and track complaints
- 📅 Apply for leave
- 🔍 Report lost & found items
- 🏠 View room assignment
- 📢 View hostel notices

**Admin Portal**
- 👥 Manage all students
- ✅ Mark daily attendance
- 📣 Post announcements and notices
- 🔧 Resolve or delete complaints
- 🍛 Update mess menu

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Vercel |

---

## Getting Started (Run Locally)

### Prerequisites
- Node.js installed
- A MongoDB Atlas account with a cluster

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/HostelMate.git
cd HostelMate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `config.env` file in the root directory:
```
ATLAS_URI=your_mongodb_connection_string_here
```

### 4. Seed the database (first time setup)
```bash
node seed.js
```

### 5. Start the server
```bash
npm start
```

Visit `http://localhost:5050` in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | student@hostel.com | 123 |
| Admin | admin@hostel.com | 123 |

---

## Project Structure

```
HostelMate/
├── public/                 # Frontend (HTML, CSS, JS, assets)
│   ├── css/
│   ├── scripts/
│   ├── assets/
│   └── *.html
├── routes/
│   └── hostel.js           # All API routes
├── db/
│   └── connection.js       # MongoDB connection
├── server.js               # Express server entry point
├── seed.js                 # Database seeder
├── vercel.json             # Vercel deployment config
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Authenticate user |
| GET | `/api/students` | Get all students |
| GET/POST | `/api/mess` | View or update mess menu |
| GET/POST | `/api/complaints` | View or submit complaints |
| PUT/DELETE | `/api/complaints/:id` | Resolve or delete complaint |
| GET/POST | `/api/notices` | View or post notices |
| DELETE | `/api/notices/:id` | Delete a notice |
| GET/POST | `/api/attendance` | View or mark attendance |
| GET/POST | `/api/lostfound` | View or report lost & found items |
| DELETE | `/api/lostfound/:id` | Delete a lost & found item |

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push the project to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `ATLAS_URI` as an Environment Variable in Vercel project settings
4. Deploy

---

## Author

**Aayush Chougule**  
[GitHub](https://github.com/aayush2006chougule) 

---

## License

This project is open source and available under the [MIT License](LICENSE).
