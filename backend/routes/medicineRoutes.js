const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMedicine");

const {
    getMedicines,
    getMedicine,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    toggleVisibility
} = require("../controllers/medicineController");

// ===============================
// GET
// ===============================

// Get medicines by vendor
router.get("/vendor/:vendorId", getMedicines);

// Get single medicine
router.get("/single/:id", getMedicine);

// ===============================
// POST
// ===============================

router.post(
    "/",
    upload.single("image"),
    addMedicine
);

// ===============================
// UPDATE
// ===============================

router.put(
    "/:id",
    upload.single("image"),
    updateMedicine
);

router.put(
    "/visibility/:id",
    toggleVisibility
);

// ===============================
// DELETE
// ===============================

router.delete("/:id", deleteMedicine);

module.exports = router;