const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    firm: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
      }
    ]
    
  },{ timestamps: true });

module.exports = mongoose.model("Vendor", VendorSchema); // Export the model
