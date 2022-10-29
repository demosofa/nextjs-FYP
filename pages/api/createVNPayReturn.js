import { OrderStatus, sortObject } from "../../shared";
import models from "../../models";

export default async function VNPayReturn(req, res) {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    await models.Order.findByIdAndUpdate(req.query.vnp_TxnRef, {
      status: OrderStatus.paid,
    });
    res.redirect(307, "/success" + vnp_Params);
  } else {
    await models.Order.findByIdAndUpdate(req.query.vnp_TxnRef, {
      status: OrderStatus.cancel,
    });
    res.redirect(307, "/success" + vnp_Params);
  }
}
