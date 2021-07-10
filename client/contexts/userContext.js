import { createContext, useEffect, useRef, useState } from "react";

export const userContext = createContext();

export default function User({ children }) {
  const [user, setUser] = useState();
  const userRef = useRef();
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  return (
    <userContext.Provider value={{ userRef, setUser }}>
      {children}
    </userContext.Provider>
  );
}
