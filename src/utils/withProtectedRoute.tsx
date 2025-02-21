"use client";
import { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { redirect } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

const withProtectedRoute = (Component: React.FC) => {
  // wrapper for protected routes
  // if no user, redirects to landing page
  const ProtectedComponent = (props: any) => {
    const { user } = useContext(UserContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    let params = "";
    if (searchParams.toString().length) {
      params = `&${searchParams.toString()}`;
    }

    useEffect(() => {
      if (!user) {
        return redirect(`/?forwardPath=${pathname}${params}`);
      }
    }, [user, pathname, params]);

    return user ? <Component {...props} /> : null;
  };
  return ProtectedComponent;
};

export default withProtectedRoute;
