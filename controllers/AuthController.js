import UnitOfWork from "./services/UnitOfWork";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { setCookieToken, Token } from "../helpers";
import { convertTime } from "../shared";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";

class AuthController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  login = async (req, res) => {
    const { username, password } = req.body;
    const check = await this.unit.Account.getOne({ username }).lean();
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
    const auth = Token.signToken({ role: check.role, username });
    return res.status(200).json(auth);
  };

  logout = async (req, res) => {
    Cookies(req, res).set("accessToken").set("refreshToken");
    return res.status(200).end();
  };

  register = async (req, res) => {
    const { account, userInfo } = req.body;
    const isExisted = await this.unit.Account.getOne({
      username: account.username,
    }).lean();
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
    const auth = Token.signToken({
      role: created.role,
      username: account.username,
    });
    return res.status(200).json(auth);
  };

  refresh = async (req, res) => {
    try {
      setCookieToken(req, res);
      return res.status(200).end();
    } catch (error) {
      return res.redirect(401, "http://localhost:3000/login");
    }
  };

  forgot = async (req, res) => {
    try {
      const { username, email } = req.body;
      await this.unit.Account.getOne({ username })
        .populate("user")
        .lean()
        .then(async ({ _id, hashPassword, user }) => {
          if (user.email === email) {
            const secret = process.env.SECRET_KEY + hashPassword;
            const token = Token.signToken({ _id, email }, secret, {
              expiresIn: "15m",
            });
            const resetLink = `${process.env.NEXT_PUBLIC_DOMAIN}/reset_password/${_id}/${token}`;
            let testAccount = await createTestAccount();
            let transporter = createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
              },
            });
            let info = await transporter.sendMail({
              from: `"Fred Foo 👻" <${testAccount.user}>`, // sender address
              to: user.email, // list of receivers
              subject: "Hello ✔", // Subject line
              text: "Hello world?", // plain text body
              html: `<b>Please click this link for starting reset password process <a href=${resetLink}>This is the link for starting reset password</a></b>`, // html body
            });
            console.log("Preview URL: %s", getTestMessageUrl(info));
          }
        });
      return res.status(200).json("Success send reset link to ur email");
    } catch (error) {
      console.log(error);
      return res.status(500).json("Fail to check account existent");
    }
  };

  resetLink = async (req, res) => {
    try {
      const { id, token } = req.query;
      await this.unit.Account.getById(id)
        .select("hashPassword")
        .lean()
        .then(({ hashPassword }) => {
          const secret = process.env.SECRET_KEY + hashPassword;
          const { _id, email } = Token.verifyToken(token, secret);
          if (id === _id) return res.status(200).json({ id, email });
          else throw new Error("Fail to validate account");
        });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  reset = async (req, res) => {
    try {
      const { id, token } = req.query;
      const { pwd } = req.body;
      await this.unit.Account.getById(id)
        .select("hashPassword")
        .lean()
        .then(async ({ hashPassword }) => {
          const secret = process.env.SECRET_KEY + hashPassword;
          const { _id } = Token.verifyToken(token, secret);
          if (id === _id) {
            const validPass = await bcrypt.compare(pwd, hashPassword);
            if (!validPass) {
              let newHashPassword = await bcrypt.hash(pwd, 10);
              await this.unit.Account.updateById(id, {
                $set: { hashPassword: newHashPassword },
              });
              return res.redirect("/login");
            } else throw new Error("Fail to set new password account");
          } else throw new Error("Fail to set new password account");
        });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
}

export default new AuthController();
