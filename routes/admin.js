const express = require("express");
const admin = require("../controllers/admin");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const { isAdmin, isLoggedIn } = require("../middleware");
const upload = multer({ storage });

router
  .route("/adminCycle")
  .get(isLoggedIn, isAdmin, admin.adminCycleUploadPage)
  .post(isLoggedIn, isAdmin, upload.single("image"), admin.adminCycleUpload);

router
  .route("/adminUpdate")
  .get(isLoggedIn, isAdmin, admin.adminUpdateCycleAvailabilityPage)
  .post(isLoggedIn, isAdmin, admin.adminUpdateCycleAvailability);

router
  .route("/adminReview")
  .get(isLoggedIn, isAdmin, admin.adminHostedCycleReviewPage);

router
  .route("/adminReview/:id/approve")
  .post(isLoggedIn, isAdmin, admin.adminHostedCycleApprove);

router
  .route("/adminReview/:id/reject")
  .post(isLoggedIn, isAdmin, admin.adminHostedCycleReject);

module.exports = router;
