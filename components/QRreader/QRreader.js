import {
  Html5QrcodeScanner,
  Html5QrcodeScannerConfig,
  QrcodeSuccessCallback,
  QrcodeErrorCallback,
} from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";
/**@param {({config: Html5QrcodeScannerConfig, onScanSuccess: QrcodeSuccessCallback, onScanFailure?: QrcodeErrorCallback})} */
export default function QRreader({
  config,
  onScanSuccess,
  onScanFailure,
  ...props
}) {
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      true
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    // return async () => {
    //   console.log("run this clear");
    //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    //     stream.getVideoTracks().forEach((track) => {
    //       if (track.readyState == "live") track.stop();
    //     });
    //     html5QrcodeScanner.clear();
    //   });
    // };
  }, [config]);
  return <div id={qrcodeRegionId} {...props} />;
}
