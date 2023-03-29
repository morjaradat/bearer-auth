"use strict";

const bcrypt = require("bcrypt");
const base64 = require("base-64");

const jwt = require("jsonwebtoken");

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  });

  //hooks
  model.beforeCreate(async (user) => {
    console.log("beforeCreate 1");
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password)
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });

    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      console.log("🚀 ~ file: users.js:27 ~ valid:", valid);
      return user;
    }
    throw new Error("Invalid User");
  };

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    console.log("🚀 ~ file: users.js:35 ~ token:", token);
    // token.username = base64.decode(token.username);
    // console.log("🚀 ~ file: users.js:36 ~ token.username:", token.username);
    try {
      const parsedToken = jwt.verify(
        token,
        process.env.SECRET,
        function (err, decoded) {
          // console.log("🚀 ~ file: users.js:43 ~ decoded:", decoded);
          console.log(" 🚀 ~ in expiry check");
          if (err) {
            // handle error
            throw new Error(
              `name: Token Expired Error
                  message: jwt time is expired
                  expiredAt: ${Date.now()}`
            );
          } else if (decoded.exp < Date.now() / 1000) {
            // token has expired
            console.log(
              "🚀 ~ file: users.js:47 ~ decoded.exp < Date.now() / 1000:",
              decoded.exp < Date.now() / 1000
            );
            throw new Error(
              `name: Token Expired Error
                  message: jwt time is expired
                  expiredAt: ${Date.now()}
            `
            );
          } else {
            // token is valid
            console.log("🚀 ~ file: users.js:55 ~ valid: true");
            console.log("🚀 ~ file: users.js:55 ~ decoded after: ", decoded);
            return decoded;
          }
        }
      );
      console.log("🚀 ~ file: users.js:66 ~ parsedToken:", parsedToken);
      const user = await this.findOne({
        where: { username: parsedToken.username },
      });
      // console.log("🚀 ~ file: users.js:70 ~ user:", user);
      if (user) {
        user.token = token;
        // console.log("🚀 ~ file: users.js:73 ~  user:", user);
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      // console.log("🚀 ~ file: users.js:77 ~ e:", e);
      throw new Error(e);
    }
  };

  return model;
};

module.exports = userSchema;
