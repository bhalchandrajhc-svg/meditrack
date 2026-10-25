const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadVendor");
const vendorController = require("../controllers/vendorController");

// ===============================
// Vendor Registration
// ===============================
router.post(
    "/register",
    upload.fields([
        {
            name: "shop_photo",
            maxCount: 1
        },
        {
            name: "license_photo",
            maxCount: 1
        }
    ]),
    vendorController.registerVendor
);

// ===============================
// Vendor Login
// ===============================
router.post(
    "/login",
    vendorController.loginVendor
);

// ===============================
// Get Vendor Profile
// ===============================
router.get(
    "/:id",
    vendorController.getVendorProfile
);

// ===============================
// Update Vendor Profile
// ===============================
router.put(
    "/:id",
    upload.fields([
        { name: "shop_photo", maxCount: 1 },
        { name: "license_photo", maxCount: 1 }
    ]),
    vendorController.updateVendorProfile
);

// ===============================
// Change Password
// ===============================
router.put(
    "/change-password/:id",
    vendorController.changePassword
);

// ===============================
// Get All Approved Pharmacies
// ===============================

router.get(
    "/pharmacies/all",
    vendorController.getNearbyPharmacies
);

module.exports = router;
