const jwt = require("jsonwebtoken");

class Token {
  constructor(payload) {
    this.accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    this.refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  }
  static signToken(payload, options = undefined) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
  }
  static verifyToken(token, options = undefined) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, options);
  }
  static verifyAccessToken(tokken) {
    return jwt.verify(tokken, process.env.ACCESS_TOKEN_SECRET);
  }
  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  }
}

module.exports = Token;
