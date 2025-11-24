import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

app.use("/auth", createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));
app.use("/stalls", createProxyMiddleware({ target: process.env.STALL_SERVICE_URL, changeOrigin: true }));
app.use("/reservations", createProxyMiddleware({ target: process.env.RESERVATION_SERVICE_URL, changeOrigin: true }));

app.listen(process.env.GATEWAY_PORT, () => {
    console.log(`API Gateway is running on port ${process.env.GATEWAY_PORT}`);
});