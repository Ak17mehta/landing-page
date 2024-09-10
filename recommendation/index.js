const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const generateContent = require("./gemini.js"); // Path to gemini.js
const cors = require("cors");




const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Serve static files from the 'public' folder (your frontend)
app.use(express.static(path.join(__dirname, "public")));

// API route to handle user prompts and generate content
app.post("/api/generate-content", generateContent); // Use the function from gemini.js

// Define the port
// const PORT = process.env.PORT || 3000;
const PORT = 5000; // Change the port to 5000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
