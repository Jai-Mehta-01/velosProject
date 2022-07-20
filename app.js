if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// const crypto = require('crypto');       //for generating random string for secret key
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./models/users");

const ejsMate = require("ejs-mate");
const session = require("express-session");
const dotenv = require("dotenv");

const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const MongoStore = require("connect-mongo"); // for storing session in mongodb-atlas

//Routing
const userRoutes = require("./routes/users");
const cycleRoutes = require("./routes/cycles");
const adminRoutes = require("./routes/admin");
const hostCycleRoutes = require("./routes/hostCycle");
const otpAPIRoutes = require("./routes/otpAPI");
//////////

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/velos";
const secret = process.env.SECRET || "thisismysecret";
const cors = require("cors");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("ERROR!!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));
app.use(express.static("public")); //to serve static html, css, javascript files from a directory
//named public
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
  }),
  name: "session",
  cookie: {
    httpOnly: true,
    // secure: true, //this is only used when we deploy so that ppl use https ,s for secure and
    //localhost is not secure
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  secret,
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://calm-hollows-55509.herokuapp.com/auth/google/profile",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleID: profile.id,
          email: profile._json.email,
          username: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/profile",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.use(async (req, res, next) => {
  if (req.user && req.user.secretKey == null) {
    const sk = crypto.randomBytes(20).toString("hex");
    const cuser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { secretKey: sk }
    );
  }
  next();
});

app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routing
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", hostCycleRoutes);
app.use("/", otpAPIRoutes);
app.use("/", cycleRoutes);
////////

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}!`);
});
