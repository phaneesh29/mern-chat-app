import express from "express";
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors"
import { PORT, ORIGIN_DOMAIN } from "./constant.js";
import { app, server } from './utils/socket.js'
import { connectDB } from "./db/db.config.js";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

connectDB()

const __dirname = path.resolve();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ORIGIN_DOMAIN);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json({ limit: "1mb" }))
app.use(cookieParser());
app.use(cors({
    origin: ORIGIN_DOMAIN,
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`);
})