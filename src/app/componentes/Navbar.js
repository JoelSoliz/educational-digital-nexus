import React from "react";

const Navbar = () => {
    return (
      <nav className="bg-cyan-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                        </div>
                        <div className="ml-4">
                            {/* Aquí puedes agregar tu barra de búsqueda */}
                            <input type="text" placeholder="Buscar" className="px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-96" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        {/* Botón de Iniciar Sesión */}
                        <button className="cursor-pointer hover:bg-lime-200 bg-green-300 text-blue-500 px-4 py-2 rounded-lg shadow-md mr-4">Iniciar Sesión</button>
                        {/* Otros botones o elementos aquí */}
                    </div>
                </div>
            </div>
        </nav>
    );
  }

export default Navbar;