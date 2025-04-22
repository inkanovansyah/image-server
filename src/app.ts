import express from "express";
import path from "path";
import imageRoutes from "./routes/imageRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3100;

app.use(express.json());
app.use("/fileimage", express.static(path.join(__dirname, "uploads")));
app.use("/api/images", imageRoutes);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
