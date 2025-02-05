"use client";
import { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { redirect } from "next/navigation";

const withProtectedRoute = (Component: any) => {
  // wrapper for protected routes
  // if no user, redirects to landing page
  return (props: any) => {
    const { user } = useContext(UserContext);

    useEffect(() => {
      if (!user) {
        return redirect(`/`);
      }
    }, [user]);

    return user ? <Component {...props} /> : null;
  };
};

export default withProtectedRoute;
