import jwt from "jsonwebtoken";

export default class Token {
  constructor(payload) {
    this.accessToken = jwt.sign(payload, process.env.ACCESS_TOKKEN_SECRET, {
      expiresIn: "2h",
    });
    this.refeshToken = jwt.sign(payload, process.env.ACCESS_REFESH_TOKKEN, {
      expiresIn: "15h",
    });
  }
  static verifyToken(tokken) {
    return jwt.verify(tokken, process.env.ACCESS_TOKKEN_SECRET);
  }
  static verifyRefeshToken(token) {
    return jwt.verify(token, process.env.ACCESS_REFESH_TOKKEN);
  }
}
