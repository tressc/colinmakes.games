"use client";
import { useState, createContext, Dispatch, SetStateAction } from "react";
// import Identicon from "identicon.js";

interface User {
  name: string;
  svg: string;
}

const UserContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
