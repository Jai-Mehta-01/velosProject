const Cycle = require("../models/cycles");
const RentHistory = require("../models/rented_history");
const hostedCycle = require("../models/hostedCycles");
module.exports.adminCycleUploadPage = async (req, res) => {
  res.render("admin/adminCycle");
};

module.exports.adminCycleUpload = async (req, res) => {
  const { manufacturer, price } = req.body;
  const newCycle = await Cycle({
    manufacturer: manufacturer,
    price: price,
    availability: true,
  });
  newCycle.image.url = req.file.path;
  newCycle.image.filename = req.file.filename;
  newCycle.save();
  res.redirect("/");
};

module.exports.adminUpdateCycleAvailabilityPage = async (req, res) => {
  res.render("admin/adminUpdate");
};

module.exports.adminUpdateCycleAvailability = async (req, res) => {
  const { id, endTime } = req.body;
  const rented_history = await RentHistory.findByIdAndUpdate(
    { _id: id },
    { returned: true, endTime: endTime, endDate: Date.now() }
  );
  await rented_history.save();
  const cycleID = rented_history.cycleID;
  const cycles = await Cycle.findByIdAndUpdate(
    { _id: cycleID },
    { availability: true }
  );
  cycles.save();
  res.redirect("/catalogue");
};

module.exports.adminHostedCycleReviewPage = async (req, res) => {
  const hostedCycles = await hostedCycle.find({ reviewed: false });
  res.render("admin/adminReview", { hostedCycles });
};

module.exports.adminHostedCycleApprove = async (req, res) => {
  const { id } = req.params;
  const hostedCycles = await hostedCycle.findByIdAndUpdate(
    { _id: id },
    { reviewed: true }
  );
  hostedCycles.save();
  const newCycle = await Cycle({
    manufacturer: hostedCycles.manufacturer,
    price: 10,
    availability: true,
    hosted: true,
    image: {
      url: hostedCycles.image.url,
      filename: hostedCycles.image.filename,
    },
  });
  newCycle.save();
  res.redirect("/catalogue");
};
module.exports.adminHostedCycleReject = async (req, res) => {
  const { id } = req.params;
  await hostedCycle.findByIdAndRemove({ _id: id });
  res.redirect("/catalogue");
};
