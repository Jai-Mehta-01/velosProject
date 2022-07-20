const express = require("express");
const router = express.Router();
const host = require("../controllers/hostCycle");
const multer = require("multer");
const { isLoggedIn } = require("../middleware");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/hostCycle")
  .get(isLoggedIn, host.hostCyclePage)
  .post(isLoggedIn, upload.single("image"), host.hostCycle);

module.exports = router;
