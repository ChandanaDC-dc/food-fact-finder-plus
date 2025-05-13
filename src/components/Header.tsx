
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSelector from "./LanguageSelector";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ showBack = false, title }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="bg-app-green text-white p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-app-green-light">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-bold">{title || t("appName")}</h1>
      </div>
      <LanguageSelector />
    </header>
  );
};

export default Header;
