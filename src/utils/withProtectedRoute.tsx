"use client";
import { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { redirect } from "next/navigation";

const withProtectedRoute = (Component: React.FC) => {
  // wrapper for protected routes
  // if no user, redirects to landing page
  const ProtectedComponent = (props: any) => {
    const { user } = useContext(UserContext);

    useEffect(() => {
      if (!user) {
        return redirect(`/`);
      }
    }, [user]);

    return user ? <Component {...props} /> : null;
  };
  return ProtectedComponent;
};

export default withProtectedRoute;
