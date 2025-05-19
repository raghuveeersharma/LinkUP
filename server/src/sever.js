import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  connectDB();
});
