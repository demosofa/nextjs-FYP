import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "../../components";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function VnPay({ order, ...props }) {
  const [input, setInput] = useState({
    bankCode: "",
    orderId: order._id,
    amount: order.total,
    orderDescription: `Payment for order ${order._id}`,
    orderType: "fashion",
    language: "vn",
  });
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    retryAxios(axios);
    try {
      await axios.post(`${LocalApi}/createVNPayUrl`, input);
    } catch (error) {
      dispatch(addNotification({ message: error.message, type: "error" }));
    }
  };
  return (
    <Form {...props} onSubmit={handleSubmit}>
      <Form.Item>
        <Form.Title htmlFor="bank_code">Ngân hàng</Form.Title>
        <select
          defaultValue=""
          onChange={(e) =>
            setInput((prev) => ({ ...prev, bankCode: e.target.value }))
          }
          name="bank_code"
          id="bank_code"
          className="form-control"
        >
          <option value="">Không chọn</option>
          <option value="NCB"> Ngan hang NCB</option>
          <option value="AGRIBANK"> Ngan hang Agribank</option>
          <option value="SCB"> Ngan hang SCB</option>
          <option value="SACOMBANK">Ngan hang SacomBank</option>
          <option value="EXIMBANK"> Ngan hang EximBank</option>
          <option value="MSBANK"> Ngan hang MSBANK</option>
          <option value="NAMABANK"> Ngan hang NamABank</option>
          <option value="VNMART"> Vi dien tu VnMart</option>
          <option value="VIETINBANK">Ngan hang Vietinbank</option>
          <option value="VIETCOMBANK"> Ngan hang VCB</option>
          <option value="HDBANK">Ngan hang HDBank</option>
          <option value="DONGABANK"> Ngan hang Dong A</option>
          <option value="TPBANK"> Ngân hàng TPBank</option>
          <option value="OJB"> Ngân hàng OceanBank</option>
          <option value="BIDV"> Ngân hàng BIDV</option>
          <option value="TECHCOMBANK"> Ngân hàng Techcombank</option>
          <option value="VPBANK"> Ngan hang VPBank</option>
          <option value="MBBANK"> Ngan hang MBBank</option>
          <option value="ACB"> Ngan hang ACB</option>
          <option value="OCB"> Ngan hang OCB</option>
          <option value="IVB"> Ngan hang IVB</option>
          <option value="VISA"> Thanh toan qua VISA/MASTER</option>
        </select>
      </Form.Item>
      {JSON.stringify(input)}
      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}
