
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Barcode } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  isScanning: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, isScanning }) => {
  const { t } = useTranslation();
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
    }
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access not supported by browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // For demo purposes, simulate barcode detection after 3 seconds
        setTimeout(() => {
          if (cameraActive) {
            stopCamera();
            onScan("3017620422003"); // Example barcode for Nutella
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback to mock scan in case of camera access error
      handleMockScan();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleMockScan = () => {
    // For demo purposes when camera is not available
    setTimeout(() => {
      onScan("3017620422003"); // Example barcode for Nutella
    }, 2000);
  };

  const handleStartScan = () => {
    if (hasCamera) {
      startCamera();
    } else {
      handleMockScan();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {!showManualInput ? (
        <>
          <div className="w-full max-w-sm h-64 bg-black/10 rounded-lg relative overflow-hidden mb-4 flex items-center justify-center border-2 border-app-green">
            {cameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
            ) : isScanning ? (
              <>
                <div className="scanning-animation absolute w-full h-2 bg-app-green/50"></div>
                <p className="text-app-green text-lg font-semibold">{t("scanning")}</p>
              </>
            ) : (
              <Camera className="w-16 h-16 text-app-green" />
            )}
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button 
              onClick={handleStartScan} 
              className="bg-app-green hover:bg-app-green-light flex gap-2 items-center"
              disabled={isScanning || cameraActive}
            >
              <Camera size={18} />
              {t("scanFood")}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowManualInput(true)} 
              className="border-app-green text-app-green hover:bg-app-green/10"
            >
              {t("enterBarcode")}
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleManualSubmit} className="w-full max-w-sm flex flex-col gap-3">
          <Input
            placeholder="123456789012"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="text-center"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowManualInput(false)}
              className="flex-1"
            >
              {t("back")}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-app-green hover:bg-app-green-light"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BarcodeScanner;
