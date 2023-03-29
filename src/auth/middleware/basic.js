"use strict";

const base64 = require("base-64");
const { users } = require("../models/index.js");

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).send("Invalid Login");
  }
  console.log(
    "🚀 ~ file: basic.js:8 ~ module.exports= ~ req.headers.authorization:",
    req.headers.authorization
  );

  let basic = req.headers.authorization.split(" ")[1];
  console.log("🚀 ~ file: basic.js:16 ~ module.exports= ~ basic:", basic);
  let [username, pass] = base64.decode(basic).split(":");
  console.log(
    "🚀 ~ file: basic.js:18 ~ module.exports= ~ username, pass:",
    username,
    pass
  );

  try {
    req.user = await users.authenticateBasic(username, pass);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send("Invalid Login");
  }
};
