
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Search, Info } from "lucide-react";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 pt-8 bg-app-green-light/10">
        <div className="max-w-md mx-auto space-y-6">
          {/* Logo and App Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-app-green rounded-lg p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.8 9.7-6 11.5-2.2-1.8-6-7.9-6-11.5a6 6 0 0 1 6-6"></path>
                <path d="M12 2a6 6 0 0 0-6 6c0 3.6 3.8 9.7 6 11.5"></path>
                <circle cx="12" cy="8" r="2"></circle>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-app-green">Food Fact Finder Plus</h1>
          </div>

          {/* Main Action: Scan Food */}
          <Card 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/scan')}
          >
            <div className="flex flex-col items-center">
              <div className="bg-app-green rounded-full p-4 mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold">{t('scanFood')}</h2>
              <p className="text-gray-500 text-sm text-center mt-2">
                Scan a barcode to view detailed nutritional information
              </p>
            </div>
          </Card>

          {/* Search Products */}
          <Card 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <div className="flex flex-col items-center">
              <div className="bg-app-green rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold">{t('search')}</h2>
              <p className="text-gray-500 text-sm text-center mt-2">
                Search for products in our database
              </p>
            </div>
          </Card>

          {/* About */}
          <Card 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/about')}
          >
            <div className="flex flex-col items-center">
              <div className="bg-app-green rounded-full p-4 mb-4">
                <Info className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-gray-500 text-sm text-center mt-2">
                Learn more about Food Fact Finder Plus
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
