import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "./db/connection.js";
import hostel from "./routes/hostel.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", hostel);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default app;