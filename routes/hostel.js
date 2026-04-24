import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Students
router.get("/students", async (req, res) => {
  try {
    const students = await db.collection("users").find({ role: "student" }).toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mess Menu
router.get("/mess", async (req, res) => {
  try {
    const menu = await db.collection("mess").find().toArray();
    const menuObj = {};
    menu.forEach(m => { menuObj[m.day] = m; });
    res.json(menuObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/mess", async (req, res) => {
  try {
    const { day, b, l, d } = req.body;
    const updateFields = { day };
    if (b !== undefined) updateFields.b = b;
    if (l !== undefined) updateFields.l = l;
    if (d !== undefined) updateFields.d = d;
    
    await db.collection("mess").updateOne(
      { day },
      { $set: updateFields },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complaints
router.get("/complaints", async (req, res) => {
  try {
    const { role, email } = req.query;
    let complaints;
    if (role === "admin") {
      complaints = await db.collection("complaints").find().toArray();
    } else {
      complaints = await db.collection("complaints").find({ studentEmail: email }).toArray();
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/complaints", async (req, res) => {
  try {
    const complaint = { ...req.body, date: new Date().toLocaleDateString() };
    await db.collection("complaints").insertOne(complaint);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/complaints/:id", async (req, res) => {
  try {
    await db.collection("complaints").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/complaints/:id", async (req, res) => {
  try {
    await db.collection("complaints").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attendance
router.get("/attendance/:date", async (req, res) => {
  try {
    const attendance = await db.collection("attendance").findOne({ date: req.params.date });
    res.json(attendance || { records: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/attendance", async (req, res) => {
  try {
    const { date, records } = req.body;
    await db.collection("attendance").updateOne(
      { date },
      { $set: { date, records } },
      { upsert: true }
    );
    res.json({ success: true, message: "Attendance Saved!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notices
router.get("/notices", async (req, res) => {
  try {
    const notices = await db.collection("notices").find().sort({ _id: -1 }).toArray();
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/notices", async (req, res) => {
  try {
    const notice = { ...req.body, date: new Date().toLocaleDateString() };
    await db.collection("notices").insertOne(notice);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/notices/:id", async (req, res) => {
  try {
    await db.collection("notices").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lost & Found
router.get("/lostfound", async (req, res) => {
  try {
    const items = await db.collection("lostfound").find().sort({ _id: -1 }).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/lostfound", async (req, res) => {
  try {
    const item = { ...req.body, date: new Date().toLocaleDateString() };
    await db.collection("lostfound").insertOne(item);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/lostfound/:id", async (req, res) => {
  try {
    await db.collection("lostfound").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;