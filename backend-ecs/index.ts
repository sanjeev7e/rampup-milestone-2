import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./src/routes/products";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes and origins
app.use(cors());

// Parse JSON bodies with increased limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Backend API" });
});

// Health check for load balancer
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Product routes
app.use("/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
