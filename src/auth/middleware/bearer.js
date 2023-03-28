"use strict";

const { users } = require("../models/index.js");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next("Invalid Login");
    }

    //  console.log(
    //   "🚀 ~ file: bearer.js:13 ~ module.exports= ~ req.headers.authorization:",
    //   req.headers.authorization
    // );

    const token = req.headers.authorization.split(" ")[1];

    console.log("🚀 ~ file: bearer.js:18 ~ module.exports= ~ token:", token);
    const validUser = await users.authenticateToken(token);
    // console.log(
    //   "🚀 ~ file: bearer.js:14 ~ module.exports= ~ validUser:",
    //   validUser
    // );

    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    console.log(
      "🚀 ~ file: bearer.js:23 ~ module.exports= ~ e:",
      Object.keys(e)
    );

    res.status(403).send("Invalid Login");
  }
};
