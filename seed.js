import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI;

console.log("---------------------------------------------------");
console.log("DEBUG: The URI is:", uri); 
console.log("---------------------------------------------------");

if (!uri || uri.trim() === "") {
    console.error("❌ ERROR: The URI is empty! The code is not saving correctly.");
    process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
    try {
        console.log("⏳ Attempting to connect to MongoDB Atlas...");
        await client.connect();
        console.log("✅ CONNECTED! (Login successful)");

        const db = client.db("hostelmate");

        // Clear old data
        console.log("🧹 Clearing old data...");
        await db.collection("users").deleteMany({});
        await db.collection("mess").deleteMany({});
        await db.collection("complaints").deleteMany({});
        
        // Insert Users
        const users = [
            { name: 'Warden Suresh', email: 'admin@hostel.com', password: '123', role: 'admin' },
            { name: 'Rahul Sharma', email: 'student@hostel.com', password: '123', role: 'student', room: '304-B' },
            { name: 'Amit Verma', email: 'amit@hostel.com', password: '123', role: 'student', room: '305-A' }
        ];
        await db.collection("users").insertMany(users);
        console.log("👤 Created Users: admin@hostel.com & student@hostel.com");

        // Insert Mess
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const messMenu = days.map(day => ({ day, b: 'Idli', l: 'Rice', d: 'Roti' }));
        await db.collection("mess").insertMany(messMenu);
        console.log("🍛 Created Mess Menu");

        console.log("🎉 SUCCESS: DATABASE SEEDED!");

    } catch (err) {
        console.error("❌ FATAL ERROR:", err);
    } finally {
        await client.close();
    }
}

run();