const express = require("express");
const Cycle = require("../models/cycles");
const RentHistory = require("../models/rented_history");

module.exports.catalogue = async (req, res) => {
  const cycles = await Cycle.find({});
  res.render("catalogue", { cycles });
};

module.exports.booked = async (req, res) => {
  if (!req.user._id) {
    return res.redirect("/login");
  }
  const { id } = req.params;
  const cycles = await Cycle.findByIdAndUpdate(
    { _id: id },
    { availability: false }
  );
  await cycles.save();
  const cycleID = cycles._id;
  const { startDate, startTime, endTime } = req.body;
  const transaction = await RentHistory({
    userID: req.user._id,
    cycleID: cycleID,
    startDate: startDate,
    startTime: startTime,
    endTime: endTime,
    returned: false,
  });
  await transaction.save();
  res.redirect("/catalogue");
};
