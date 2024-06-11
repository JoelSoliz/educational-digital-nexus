"use client";
import useAuth from "@/context/authContext";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { googleSignIn, signOut, user } = useAuth();

  return (
    <nav className="bg-[#1b1425]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a className="flex-shrink-0" href="/">
              <img src="/logo.webp" alt="Logo" className="h-8 lg:h-12 w-auto" />
            </a>
            <div className="hidden sm:block sm:ml-8">
              <input
                type="text"
                placeholder="Buscar"
                className="px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#66b72e]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user?.displayName ? (
              <>
                <Link
                  href="/upload-content"
                  className="cursor-pointer text-[#fffffe] hover:text-[#66b72e]"
                >
                  Subir PDF
                </Link>
                <Link
                  href="/evaluation"
                  className="cursor-pointer text-[#fffffe] hover:text-[#66b72e]"
                >
                  Evaluar
                </Link>
                <p
                  className="cursor-pointer text-[#fffffe] hover:text-[#66b72e]"
                  onClick={signOut}
                >
                  Cerrar sesión
                </p>
                <img
                  className="rounded-full w-10 hover:scale-105 cursor-pointer"
                  alt={`Foto de usuario ${user?.displayName}`}
                  src={user?.photoURL}
                />
              </>
            ) : (
              <p
                className="cursor-pointer text-[#fffffe] hover:text-[#66b72e]"
                onClick={googleSignIn}
              >
                Iniciar sesión
              </p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
