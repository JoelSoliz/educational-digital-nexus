import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#1b1425]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src="/logo.webp" alt="Logo" className="h-12 w-auto" />
            </div>
            <div className="ml-8">
              <input
                type="text"
                placeholder="Buscar"
                className="px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#66b72e] w-96"
              />
            </div>
          </div>
          <div className="flex items-center">
            <p className="cursor-pointer text-[#fffffe] hover:text-[#66b72e] ">
              Iniciar sesión
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
