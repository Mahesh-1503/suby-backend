const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db"); // Import the database connection
const vendorRoutes = require("./routes/vendorRoutes")
const bodyParser = require("body-parser");
dotenv.config();


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

connectDB(); // Call the database connection function

app.use('/vendor', vendorRoutes)

app.get("/home", (req, res) => {
  res.send("Welcome to Suby inspired by Swiggy");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
