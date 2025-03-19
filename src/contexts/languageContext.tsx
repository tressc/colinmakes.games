"use client";
import { useState, createContext, Dispatch, SetStateAction } from "react";

const languageOptions = {
  english: "ENG",
  japanese: "JPN",
} as const;

type LanguageOptions = (typeof languageOptions)[keyof typeof languageOptions]; // Restrict to "ENG" | "JPN"

const LanguageContext = createContext<{
  language: string;
  setLanguage: Dispatch<SetStateAction<LanguageOptions>>;
  languageOptions: { [key in keyof typeof languageOptions]: LanguageOptions };
}>({
  language: "ENG",
  setLanguage: () => {},
  languageOptions: languageOptions,
});

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<LanguageOptions>("ENG");

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, languageOptions }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
