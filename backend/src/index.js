import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();
// a Node.js function that tells Node.js which DNS servers to use when 
// resolving domain names through its DNS resolver APIs.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const PORT = process.env.PORT;



const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => {
  console.log(`server run on ==> http://localhost:${PORT}`);
  connectDB();
});