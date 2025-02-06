"use client";

import { useContext, useState, useEffect } from "react";
import { useSearchParams, redirect } from "next/navigation";

import { UserContext } from "@/contexts/userContext";
import { v4 as uuidv4 } from "uuid";
import Identicon from "identicon.js";

const App = () => {
  const { user, setUser } = useContext(UserContext);

  // currently getting called on every keystroke :(
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      let path = "/lobby";

      return redirect(path);
    }
  }, [user]);

  const [userName, setUsername] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
