const express = require("express");

const router = express.Router();

const customerController = require(
    "../controllers/customerController"
);


// =====================================
// Get All Customer Medicines
// =====================================

router.get(
    "/medicines",
    customerController.getMedicines
);


// =====================================
// Get Nearby Pharmacies
// =====================================

router.get(
    "/nearby-pharmacies",
    customerController.getNearbyPharmacies
);


// =====================================
// Get Single Medicine
// =====================================

router.get(
    "/medicine/:id",
    customerController.getMedicineById
);


// =====================================
// Get Medicines By Pharmacy / Vendor
// =====================================

router.get(
    "/pharmacy/:vendorId/medicines",
    customerController.getMedicinesByVendor
);
// =====================================
// Get Customer Profile
// =====================================

router.get(
    "/profile/:userId",
    customerController.getCustomerProfile
);


// =====================================
// Update Customer Profile
// =====================================

router.put(
    "/profile/:userId",
    customerController.updateCustomerProfile
);

module.exports = router;