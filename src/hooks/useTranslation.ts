
import { useLanguageStore } from "../store/languageStore";
import { getTranslation, TranslationKey } from "../utils/translations";

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();
  
  const t = (key: TranslationKey) => {
    return getTranslation(key, currentLanguage.code);
  };
  
  return { t };
};
