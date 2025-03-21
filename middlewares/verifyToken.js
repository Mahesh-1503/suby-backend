const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const secretKey = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if(!token){ // if token is missing, return an error
        res.status(401).json({message: "Failed", error: "Token is required"})
    }

    try {
        const decoded = jwt.verify(token, secretKey) // verify token and decode it
        const vendor = await Vendor.findById(decoded.vendorId);// find vendor by ID

        if(!vendor){ // If vendor does not exist, return an error
            return res.status(404).json({error: "Vendor not found"})
        }
        req.vendorId = vendor._id; // attach vendor ID to request for later use
        next(); //Move to the next middleware or route
    } catch (error) {
        console.log(error.message)//Debugging
        return res.status(500).json({error: "invalid token"})
    }
}

module.exports = verifyToken