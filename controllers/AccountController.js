import UnitOfWork from "./services/UnitOfWork";
import bcrypt from "bcrypt";
import { Token, setCookie } from "../helpers";

class AccountController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  async login(req, res) {
    const { username, password } = req.body;
    const check = await this.unit.Account.getOne(username, "username");
    if (!check)
      return res
        .status(300)
        .json({ message: "there is no account with this username" });
    const validPass = await bcrypt.compare(password, check.hashpassword);
    if (!validPass)
      return res.status(300).json({ message: "Invalid password" });
    const { accessToken, refreshToken } = new Token({
      accountId: check._id,
      userId: check.userId,
      role: check.role,
    });
    setCookie(res, "refreshToken", refreshToken, { httpOnly: true, age: "1d" });
    return res.status(200).json({ accessToken });
  }

  async logout(req, res) {
    setCookie(res, "refreshToken", "deleted", { httpOnly: true, maxAge: -1 });
    return res.status(200).end();
  }

  async register(req, res) {
    const { account, userInfo } = req.body;
    const isExisted = await this.unit.Account.getOne(
      account.username,
      "username"
    );
    if (isExisted)
      return res.status(300).json({
        message: "There is already existed account with this username",
      });
    const user = await this.unit.User.create({ ...userInfo });
    if (!user) return res.status(500).json({ message: "Fail to Register" });
    let hashPassword = await bcrypt.hash(account.password, 10);
    const created = await this.unit.Account.create({
      username: account.username,
      hashpassword: hashPassword,
      email: userInfo.email,
      userId: user._id,
    });
    if (!created)
      return res.status(500).json({ message: "Fail to Create Account" });
    const { accessToken, refreshToken } = new Token({
      accountId: created._id,
      userId: user._id,
      role: created.role,
    });
    setCookie(res, "refreshToken", refreshToken, { httpOnly: true, age: "1d" });
    return res.status(200).json({ accessToken });
  }
}

export default new AccountController();
