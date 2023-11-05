import {
	Html5Qrcode,
	Html5QrcodeCameraScanConfig,
	Html5QrcodeError,
	Html5QrcodeResult
} from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const qrcodeRegionId = 'html5qr-code-full-region';

/**
 * @param {{
 * 	config: Html5QrcodeCameraScanConfig;
 * 	onScanSuccess: (
 * 		decodedText: string,
 * 		result: Html5QrcodeResult,
 * 		html5Qrcode: Html5Qrcode
 * 	) => void;
 * 	onScanFailure?: (
 * 		errorMessage?: string,
 * 		error?: Html5QrcodeError,
 * 		html5Qrcode?: Html5Qrcode
 * 	) => void;
 * }}
 */
export default function QRreader({
	config = { fps: 10, qrbox: { width: 250, height: 250 } },
	onScanSuccess,
	onScanFailure,
	...props
}) {
	const onScanSuccessRef = useRef(onScanSuccess);
	const onScanFailureRef = useRef(onScanFailure);

	useEffect(() => {
		onScanSuccessRef.current = onScanSuccess;
	}, [onScanSuccess]);
	useEffect(() => {
		onScanFailureRef.current = onScanFailure;
	}, [onScanFailure]);

	useEffect(() => {
		const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
		html5Qrcode.start(
			{ facingMode: 'environment' },
			config,
			(text, result) => {
				onScanSuccessRef.current(text, result, html5Qrcode);
			},
			(message, error) => {
				onScanFailureRef.current?.(message, error, html5Qrcode);
			}
		);

		return () => {
			html5Qrcode
				.stop()
				.then(() => {
					html5Qrcode.clear();
				})
				.catch((error) => {
					onScanFailureRef.current(error.message);
				});
		};
	}, [config]);

	return <div id={qrcodeRegionId} {...props} />;
}
