import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const CameraView = ({ onScanSuccess }) => {
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);
  const isScannerRunningRef = useRef(false);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    const startScanner = async () => {
      try {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250
          },
          (decodedText) => {
            if (isScannerRunningRef.current) {
              onScanSuccess(decodedText);

              // 🛑 Stop scanner safely after successful scan
              html5QrCodeRef.current
                .stop()
                .then(() => {
                  isScannerRunningRef.current = false;
                })
                .catch((err) => {
                  console.error("Failed to stop scanner", err);
                });
            }
          },
          (error) => {
            // Optionally log errors here if needed
          }
        );
        isScannerRunningRef.current = true;
      } catch (error) {
        console.error("Camera start error:", error);
        alert("Could not access the camera. Please allow permissions.");
      }
    };

    startScanner();

    // 🧹 Cleanup
    return () => {
      if (html5QrCodeRef.current && isScannerRunningRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            isScannerRunningRef.current = false;
          })
          .catch((err) => {
            console.warn("Cleanup: Scanner not running.", err);
          });
      }
    };
  }, [onScanSuccess]);

  return <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: 400, margin: "0 auto" }} />;
};
export default CameraView;
