
import React, { useState } from "react";
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

  // Mock scanner for demo
  const handleStartScan = () => {
    // In a real app, this would access the device camera
    // For demo purposes, we'll use a mock barcode after a delay
    setTimeout(() => {
      onScan("3017620422003"); // Example barcode for Nutella
    }, 2000);
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
            {isScanning ? (
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
              disabled={isScanning}
            >
              <Barcode size={18} />
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
