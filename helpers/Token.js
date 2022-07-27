import jwt from "jsonwebtoken";

export default class Token {
  constructor(payload) {
    this.accessToken = jwt.sign(payload, process.env.ACCESS_TOKKEN_SECRET, {
      expiresIn: "30s",
    });
    this.refreshToken = jwt.sign(payload, process.env.ACCESS_REFESH_TOKKEN, {
      expiresIn: "1d",
    });
  }
  static verifyToken(tokken) {
    return jwt.verify(tokken, process.env.ACCESS_TOKKEN_SECRET);
  }
  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.ACCESS_REFESH_TOKKEN);
  }
}
