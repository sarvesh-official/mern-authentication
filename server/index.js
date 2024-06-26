import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserRouter } from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://mern-authentication-gamma.vercel.app",
      "http://localhost:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization,Set-Cookie",
  })
);
app.use(express.json());

app.use(cookieParser());

app.use("/auth", UserRouter);

mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT, () => {
  console.log("Server is Running in Port 5000");
});
