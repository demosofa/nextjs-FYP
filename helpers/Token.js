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

// import { SignJWT, jwtVerify } from "jose";

// export default class Token {
//   constructor(payload) {
//     this.payload = payload;
//   }
//   signAccessToken() {
//     return new SignJWT(this.payload)
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("2h")
//       .sign(process.env.ACCESS_TOKKEN_SECRET);
//   }
//   signRefreshToken() {
//     return new SignJWT(this.payload)
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("15h")
//       .sign(process.env.ACCESS_REFESH_TOKKEN);
//   }
//   static verifyToken(tokken) {
//     return jwtVerify(tokken, process.env.ACCESS_TOKKEN_SECRET, {
//       algorithms: "HS256",
//     });
//   }
//   static verifyRefreshToken(token) {
//     return jwtVerify(token, process.env.ACCESS_REFESH_TOKKEN, {
//       algorithms: "HS256",
//     });
//   }
// }
