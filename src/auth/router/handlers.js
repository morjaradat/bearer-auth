"use strict";

const { users } = require("../models/index.js");
const base64 = require("base-64");

const jwt = require("jsonwebtoken");

async function handleSignup(req, res, next) {
  try {
    console.log(req.body);
    let userRecord = await users.create(req.body);
    let token = generateToken(userRecord.username);
    const output = {
      user: userRecord,
      token: token,
    };
    res.status(201).json(output);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

async function handleSignin(req, res, next) {
  try {
    const user = {
      user: {
        _id: req.user.id,
        username: req.user.username,
      },
      token: generateToken(req.user.username),
    };
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll();
    // console.log(
    //   "🚀 ~ file: handlers.js:41 ~ handleGetUsers ~ userRecords:",
    //   userRecords
    // );
    const list = userRecords.map((user) => {
      return {
        id: user.id,
        username: user.username,
      };
    });
    console.log("🚀 ~ file: handlers.js:46 ~ handleGetUsers ~ list:", list);
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!");
}

function generateToken(username) {
  return jwt.sign({ username: username }, process.env.SECRET, {
    expiresIn: "2d",
  });
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret,
};
