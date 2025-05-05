import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from './routes/route';
import contentRoutes from './routes/contentRoute';

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
