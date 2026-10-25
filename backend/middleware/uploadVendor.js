const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// Create Upload Folders
// ===============================

const shopDir = "uploads/shop_photos";
const licenseDir = "uploads/licenses";

if (!fs.existsSync(shopDir)) {
    fs.mkdirSync(shopDir, { recursive: true });
}

if (!fs.existsSync(licenseDir)) {
    fs.mkdirSync(licenseDir, { recursive: true });
}

// ===============================
// Storage
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "shop_photo") {

            cb(null, shopDir);

        }

        else if (file.fieldname === "license_photo") {

            cb(null, licenseDir);

        }

        else {

            cb(new Error("Invalid File Field"));

        }

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// ===============================
// File Filter
// ===============================

const fileFilter = (req, file, cb) => {

    const allowedExt = /\.(jpg|jpeg|png|pdf)$/i;

    const extValid = allowedExt.test(file.originalname);

    const mimeValid = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"

    ].includes(file.mimetype);

    if (extValid && mimeValid) {

        cb(null, true);

    }

    else {

        cb(new Error("Only JPG, JPEG, PNG and PDF files are allowed"));

    }

};

// ===============================
// Export
// ===============================

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});