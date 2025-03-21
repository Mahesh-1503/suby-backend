const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); //destination folder where uploaded images will be stord
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname) // Generating a unique filename
    }
});
const upload = multer({storage: storage});

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
    const image = req.file? req.file.filename: undefined;
    const Vendor = await Vendor.findById(req.vendorId)
    if(!vendor){
        res.status(404).json({message: "Vendor not found."})
    }
    const firm = new Firm({
        firmName, area, category, region, offer, image, vendor: vendor._id
    })

    await firm.save()
    return res.status(200).json({message: "Firm added successfully", firm})
    } catch (error) {
        console.error("Failed to add firm", error.message)//Debugging
        res.status(500).json("Internal server error", error.message)
    }

}

module.exports = {addFirm: [upload.single('image'), addFirm]}