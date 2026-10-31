const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  claimEnquiry,
  getMyLeads
} = require("../controllers/enquiry.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", createEnquiry);
router.get("/public", protect, getAllEnquiries);
router.post("/:id/claim",protect, claimEnquiry);
router.get("/my-leads",protect, getMyLeads);

module.exports = router;