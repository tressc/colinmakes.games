"use client";

import { useContext, useState, useEffect, useRef } from "react";
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
    <>
      <p>Please enter a username:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-black"
        />
        <button type="submit" className="border border-black">
          submit
        </button>
      </form>
    </>
  );
};

export default App;
