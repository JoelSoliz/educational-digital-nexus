"use client";
import { useEffect } from "react";
import useAuth from "@/context/authContext";
import { redirect } from "next/navigation";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const { user } = useAuth();

    useEffect(() => {
      if (!user?.displayName) {
        return redirect("/");
      }
    }, [user]);

    if (!user?.displayName) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default isAuth;
