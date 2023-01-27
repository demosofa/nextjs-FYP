import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  Html5QrcodeError,
  Html5QrcodeResult,
} from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";
/**@param {({config: Html5QrcodeCameraScanConfig, onScanSuccess: (decodedText: string, result: Html5QrcodeResult, html5Qrcode: Html5Qrcode) => void, onScanFailure?: (errorMessage: string, error: Html5QrcodeError, html5Qrcode: Html5Qrcode) => void})} */
export default function QRreader({
  config = { fps: 10, qrbox: { width: 250, height: 250 } },
  onScanSuccess,
  onScanFailure,
  ...props
}) {
  useEffect(() => {
    const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
    html5Qrcode.start(
      { facingMode: "environment" },
      config,
      (text, result) => {
        onScanSuccess(text, result, html5Qrcode);
      },
      (message, error) => {
        onScanFailure(message, error, html5Qrcode);
      }
    );
    return () => {
      html5Qrcode
        .stop()
        .then(() => {
          html5Qrcode.clear();
        })
        .catch((error) => {});
    };
  }, [config]);
  return <div id={qrcodeRegionId} {...props} />;
}
