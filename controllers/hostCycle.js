const express = require("express");
const hostedCycle = require("../models/hostedCycles");

module.exports.hostCyclePage = async (req, res) => {
  if (req.user.username !== "admin") res.render("users/hostCycle");
  else res.redirect("/");
};

module.exports.hostCycle = async (req, res) => {
  if (req.user.isAdministrator) return res.redirect("/");
  const { hostFrom, hostTo, manufacturer } = req.body;
  const newHostedCycle = await hostedCycle({
    userID: req.user._id,
    hostFrom: hostFrom,
    hostTo: hostTo,
    manufacturer: manufacturer,
    reviewed: false,
  });
  newHostedCycle.image.url = req.file.path;
  newHostedCycle.image.filename = req.file.filename;
  newHostedCycle.save();
  res.redirect("/");
};
