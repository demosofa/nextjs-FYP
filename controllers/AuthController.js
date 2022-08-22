import UnitOfWork from "./services/UnitOfWork";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { setCookieToken, Token } from "../helpers";
import { convertTime } from "../utils";

class AuthController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  async login(req, res) {
    const { username, password } = req.body;
    const check = await this.unit.Account.getOne({ username });
    if (!check)
      return res
        .status(300)
        .json({ message: "there is no account with this username" });
    const validPass = await bcrypt.compare(password, check.hashPassword);
    if (!validPass)
      return res.status(300).json({ message: "Invalid password" });
    const { accessToken, refreshToken } = new Token({
      accountId: check._id,
      userId: check.user,
      role: check.role,
    });
    new Cookies(req, res)
      .set("accessToken", accessToken, {
        maxAge: convertTime("5m").milisecond,
        overwrite: true,
      })
      .set("refreshToken", refreshToken, {
        maxAge: convertTime("1d").milisecond,
        overwrite: true,
      });
    const auth = jwt.sign(check.role, process.env.SECRET_KEY);
    return res.status(200).json(auth);
  }

  async logout(req, res) {
    Cookies(req, res).set("accessToken").set("refreshToken");
    return res.status(200).end();
  }

  async register(req, res) {
    const { account, userInfo } = req.body;
    const isExisted = await this.unit.Account.getOne({
      username: account.username,
    });
    if (isExisted)
      return res.status(300).json({
        message: "There is already existed account with this username",
      });
    const user = await this.unit.User.create({ ...userInfo });
    if (!user) return res.status(500).json({ message: "Fail to Register" });
    let hashPassword = await bcrypt.hash(account.password, 10);
    const created = await this.unit.Account.create({
      username: account.username,
      hashPassword,
      user: user._id,
    });
    if (!created)
      return res.status(500).json({ message: "Fail to Create Account" });
    const { accessToken, refreshToken } = new Token({
      accountId: created._id,
      userId: user._id,
      role: created.role,
    });
    new Cookies(req, res)
      .set("accessToken", accessToken, {
        maxAge: convertTime("5m").milisecond,
        overwrite: true,
      })
      .set("refreshToken", refreshToken, {
        maxAge: convertTime("1d").milisecond,
        overwrite: true,
      });
    const auth = jwt.sign(created.role, process.env.SECRET_KEY);
    return res.status(200).json(auth);
  }

  async refresh(req, res) {
    try {
      setCookieToken(req, res);
      return res.status(200).end();
    } catch (error) {
      return res.redirect(401, "http://localhost:3000/login");
    }
  }
}

export default new AuthController();
