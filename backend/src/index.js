import express from "express";
import dotenv from "dotenv";
import dns from "dns";

import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();
//a Node.js function that tells Node.js which DNS servers to use when resolving domain names through its DNS resolver APIs.
dns.setServers(["8.8.8.8","1.1.1.1"]);

const app = express();

const PORT = process.env.PORT;

app.use("/api/auth",authRoute);

app.listen(PORT,()=>{
  console.log(`server run on ==> http://localhost:${PORT}`);
  connectDB();
});