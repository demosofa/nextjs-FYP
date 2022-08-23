import UnitOfWork from "./services/UnitOfWork";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { setCookieToken, Token } from "../helpers";
import { convertTime } from "../utils";

class AccountController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  login = async (req, res) => {
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
    Cookies(req, res).set("refreshToken", refreshToken, {
      maxAge: convertTime("1d").milisecond,
      overwrite: true,
    });
    return res.status(200).json(accessToken);
  };

  logout = async (req, res) => {
    Cookies(req, res).set("refreshToken");
    return res.status(200).end();
  };

  register = async (req, res) => {
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
    Cookies(req, res).set("refreshToken", refreshToken, {
      maxAge: convertTime("1d").milisecond,
      overwrite: true,
    });
    return res.status(200).json(accessToken);
  };
  refresh = async (req, res) => {
    try {
      const accessToken = setCookieToken(req, res);
      return res.status(200).json(accessToken);
    } catch (error) {
      return res.redirect(401, "http://localhost:3000/login");
    }
  };
}

export default new AccountController();
