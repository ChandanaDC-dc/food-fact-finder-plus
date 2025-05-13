
import { create } from 'zustand';

type Language = {
  code: string;
  name: string;
};

interface LanguageState {
  currentLanguage: Language;
  availableLanguages: Language[];
  setLanguage: (code: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: { code: 'en', name: 'English' },
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'zh', name: '中文' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ],
  setLanguage: (code: string) => set((state) => ({
    currentLanguage: state.availableLanguages.find(lang => lang.code === code) || state.currentLanguage
  })),
}));
