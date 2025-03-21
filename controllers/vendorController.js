const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");
dotEnv.config()

const secretKey = process.env.JWT_SECRET

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Normalize email and username to prevent case sensitivity issues
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();

        // Check if email or username already exists
        const existingVendor = await Vendor.findOne({ 
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
        });

        if (existingVendor) {
            return res.status(400).json({ message: "Email or Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new vendor
        const newVendor = new Vendor({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully", newVendor });
        console.log("Vendor registered successfully", newVendor);
    } catch (error) {
        res.status(500).json({ message: "Error registering vendor", error: error.message });
        console.error("❌ Error registering vendor:", error.message);
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Normalize email (to prevent case sensitivity issues)
        const normalizedEmail = email.trim().toLowerCase();
        
        // Find vendor by email
        const vendor = await Vendor.findOne({ email: normalizedEmail });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({vendorId: vendor._id}, secretKey, {expiresIn: "1h"})
        
        res.status(200).json({ message: "Vendor logged in successfully", vendor, token });
        console.log(email, "this is token:", token) //Debugging
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
        console.error("Error logging in:", error.message);
    }
};

const getAllVendors = async (req, res) => {
    try {
        // 🔍 Fetch all vendors and populate "firm" field
        const vendors = await Vendor.find().populate("firm");

        // ✅ Check if vendors exist
        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: "No vendors found" });
        }

        res.status(200).json({ message: "Vendors retrieved successfully", vendors });
    } catch (error) {
        console.error("❌ Failed to get all vendors:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors
};
