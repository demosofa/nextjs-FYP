import { sign, verify, SignOptions, VerifyOptions } from "jsonwebtoken";

export default class Token {
  public accessToken: string;
  public refreshToken: string;
  constructor(payload: string | object | Buffer) {
    this.accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    this.refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  }
  static createToken(payload: string | object | Buffer, options?: SignOptions) {
    return sign(payload, process.env.ACCESS_TOKKEN_SECRET, options);
  }
  static verifyToken(
    tokken: string,
    options?: VerifyOptions & {
      complete?: false;
    }
  ) {
    return verify(tokken, process.env.ACCESS_TOKKEN_SECRET, options);
  }
  static verifyRefreshToken(
    token: string,
    options?: VerifyOptions & {
      complete?: false;
    }
  ) {
    return verify(token, process.env.ACCESS_REFESH_TOKKEN, options);
  }
}
