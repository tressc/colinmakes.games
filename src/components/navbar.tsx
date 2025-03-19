"use client";

import { useContext } from "react";
import { LanguageContext } from "@/contexts/languageContext";

const Navbar: React.FC = () => {
  const { languageOptions, setLanguage } = useContext(LanguageContext);

  const onClick = (
    language: (typeof languageOptions)[keyof typeof languageOptions],
  ) => {
    setLanguage(language);
  };

  return (
    <div className="flex w-svw justify-end p-3 text-white">
      <div
        onClick={() => onClick(languageOptions.english)}
        className="mr-2 pr-2 hover:cursor-pointer hover:text-blue-500"
      >
        ENG
      </div>
      <div
        onClick={() => onClick(languageOptions.japanese)}
        className="pl-2 hover:cursor-pointer hover:text-blue-500"
      >
        日本語
      </div>
    </div>
  );
};

export default Navbar;
