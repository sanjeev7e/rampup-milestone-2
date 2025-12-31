import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes and origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Backend API" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
