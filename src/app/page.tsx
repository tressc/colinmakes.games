"use client";

import { useContext, useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";

import { UserContext } from "@/contexts/userContext";
import { LanguageContext } from "@/contexts/languageContext";
import { v4 as uuidv4 } from "uuid";
import Identicon from "identicon.js";

const App = () => {
  const { user, setUser } = useContext(UserContext);
  const { language, languageOptions } = useContext(LanguageContext);
  const searchParams = useSearchParams();

  useEffect(() => {
    // if user exists, redirect to redirectPath or default to /lobby
    if (user) {
      let redirectPath = "/lobby";
      if (searchParams.has("forwardPath")) {
        redirectPath = searchParams.get("forwardPath") || "/lobby";
      }
      let isNotFirstParam = false;
      for (const key of searchParams.keys()) {
        if (key !== "forwardPath") {
          redirectPath += isNotFirstParam ? "&" : "?";
          redirectPath += `${key}=${searchParams.get(key)}`;
          isNotFirstParam = true;
        }
      }
      return redirect(redirectPath);
    }
  }, [user, searchParams]);

  const [userName, setUsername] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // set username & icon on the user context
    event.preventDefault();
    const svg = new Identicon(uuidv4(), {
      size: 420,
      format: "svg",
    }).toString();
    setUser({ name: userName, svg });
    setUsername("");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="min-w-4xl w-4xl rounded-md border border-black p-1"
          placeholder={
            language === languageOptions.english
              ? "Enter your username"
              : "ユーザーネームを入力してください"
          }
        />
        <button
          type="submit"
          className="mt-4 rounded-md border border-black bg-white p-1 text-black hover:text-gray-500"
        >
          {language === languageOptions.english ? "enter" : "入る"}
        </button>
      </form>
    </div>
  );
};

export default App;
