"use client";

import { useContext, useState, useEffect } from "react";
import { redirect } from "next/navigation";

import { UserContext } from "@/contexts/userContext";
import { v4 as uuidv4 } from "uuid";
import Identicon from "identicon.js";

const App = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // redirects to lobby if user exists
    if (user) {
      return redirect("/lobby");
    }
  }, [user]);

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
          className="border-blac rounded-md border p-1"
          placeholder="Enter your username"
        />
        <button
          type="submit"
          className="mt-4 rounded-md border border-black bg-white p-1 text-black"
        >
          enter
        </button>
      </form>
    </div>
  );
};

export default App;
