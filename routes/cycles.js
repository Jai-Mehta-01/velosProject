const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const { catalogue, booked } = require("../controllers/cycle");

router.route("/catalogue").get(catalogue);

router.route("/booked/:id").post(isLoggedIn, booked);

module.exports = router;
