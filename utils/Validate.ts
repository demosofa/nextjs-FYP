export default class Validate {
  public input: string;
  constructor(input: string | number) {
    this.input = typeof input === "string" ? input : input.toString();
  }

  isEmail() {
    if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.input
      )
    )
      throw new Error("not an Email");
    return this;
  }
  isEmpty() {
    if (!this.input.length) throw new Error("please fill in empty input");
    return this;
  }
  isNumber() {
    const regex = new RegExp(
      "^(-?[1-9]+\\d*([.]\\d+)?)$|^(-?0[.]\\d*[1-9]+)$|^0$"
    );
    if (!regex.test(this.input)) throw new Error("this is not a number");
    return this;
  }
  isPhone() {
    const regex = new RegExp(
      "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
    );
    if (!regex.test(this.input)) throw new Error("this is not a phone number");
    return this;
  }
  isEnoughLength({ min, max }: { min?: number; max?: number }) {
    if (min && this.input.length < min) throw new Error("this is too short");
    if (max && this.input.length > max) throw new Error("this is too long");
    if (!min && !max) throw new Error("please provide min and max arguments");
    return this;
  }
  isNotSpecial() {
    const regex = new RegExp("[-’/`~!#*$@_%+=.,^&(){}[]|;:”<>?\\]");
    if (regex.test(this.input))
      throw new Error("this input contains special character");
    return this;
  }
  isNotCode() {
    if (/<[a-z][\s\S]*>/.test(this.input))
      throw new Error("this input contains code");
    return this;
  }
  isPassWord(pwdlength = 8) {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${pwdlength},}$`
    );
    if (!regex.test(this.input))
      throw new Error("this input is not like password");
    return this;
  }
  isVND() {
    const num = parseInt(this.input);
    if (num && num % 1000 === 0) return this;
    throw new Error("this input is not VND currency");
  }
  isAddress() {
    if (!/[!@$%^&*(),?":{}|<>]/g.test(this.input))
      throw new Error("this input is not like address");
    return this;
  }
}
