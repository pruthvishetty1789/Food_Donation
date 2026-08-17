const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/Authentication');

const {
  getDonationsUsingStatus,
  getDonationUsingId,
  getTotalDonations,
  deliverdDonationsCount,
  createDonation,
  getTotalFoodSaved,
  getTopDonors,
  getMyDonations,
  addDonationToUser,
  getMatchNgos,
  getAcceptedDonations,
  completeDonation,
  getMyAcceptedAndDeliveredDonations,
  submitFeedback,
  getFeedbackDetails,
  generateDeliveryOTP,
  verifyDeliveryOTP,
  getNgoDashboardData,
  getalldonations,
  getAcceptedDonationsByDonor
} = require('../controllers/Donation');

console.log("✅ Donation routes loaded");

// -------------------- TEST ROUTE --------------------
router.post("/match-test", (req, res) => {
  console.log("✅ match-test route hit");
  res.json({
    success: true,
    message: "Match test route works"
  });
});

// -------------------- BASE ROUTES --------------------
router.post("/create", authMiddleware, createDonation);

router.get("/totaldonations", authMiddleware, getTotalDonations);
router.get("/totaldeliveredfood", authMiddleware, deliverdDonationsCount);
router.get("/totalfoodsaved", authMiddleware, getTotalFoodSaved);
router.get("/topdonors", authMiddleware, getTopDonors);

router.get("/my-donations", authMiddleware, getMyDonations);
router.get("/accepted", authMiddleware, getAcceptedDonations);
router.get("/my-accepted-delivered", authMiddleware, getMyAcceptedAndDeliveredDonations);
router.get("/alldonations", authMiddleware, getalldonations);
router.get("/accepteddonationsbydonor", authMiddleware, getAcceptedDonationsByDonor);

router.get("/ngo-dashboard", authMiddleware, getNgoDashboardData);

// -------------------- MATCH NGO ROUTE --------------------
router.post(
  "/match-ngos",
  authMiddleware,
  (req, res, next) => {
    console.log("✅ match-ngos route reached");
    console.log("Body:", req.body);
    next();
  },
  getMatchNgos
);

// -------------------- DONATION ACTION ROUTES --------------------
router.put("/:donationId/assign", authMiddleware, addDonationToUser);

router.patch("/:donationId/complete", authMiddleware, completeDonation);

router.post("/:donationId/feedback", authMiddleware, submitFeedback);

router.get("/:donationId/feedback", authMiddleware, getFeedbackDetails);

router.post("/:donationId/generate-otp", authMiddleware, generateDeliveryOTP);

router.post("/:donationId/verify-otp", authMiddleware, verifyDeliveryOTP);

router.get("/donation/:ListId", authMiddleware, getDonationUsingId);

// -------------------- KEEP THIS LAST --------------------
router.get("/:status", authMiddleware, getDonationsUsingStatus);

module.exports = router;