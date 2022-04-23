// isNaN(this.input) && !isFinite(this.input)
export default class Validate {
  constructor(
    string,
    config = {
      enoughLength: 8,
      passwordLength: 8,
    }
  ) {
    this.input = string;
    this.config = config;
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
  isEnoughLength() {
    if (this.input.length > this.config.length)
      throw new Error("this is too long");
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
  isPassWord() {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${this.config.passwordLength},}$`
    );
    if (!regex.test(this.input))
      throw new Error("this input is not like password");
    return this;
  }
}
