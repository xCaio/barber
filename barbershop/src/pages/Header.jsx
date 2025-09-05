import React, { useState } from "react";
import logo from "../assets/logo.png";
import Button from "../components/Button";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <header class="bg-primary text-text font-bold shadow-2xs p-5">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <img src={logo} alt="Logo do site" width="100" />

        <button className="sm:hidden cursor-pointer" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </button>

        <nav class="hidden sm:flex items-center space-x-10">
          <a href="#" class="hover:underline">
            Serviços
          </a>
          <a href="#" class="hover:underline">
            Sobre
          </a>
          <a href="#" class="hover:underline">
            Contato
          </a>
          <Button />
        </nav>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-primary transform transition-transform duration-300 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden`}
      >
        <div className="p-5 flex flex-col space-y-4">
          {/* BOTÃO FECHAR */}
          <button className="self-end mb-4 cursor-pointer" onClick={toggleSidebar}> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <a href="#" className="block hover:underline">
            Serviços
          </a>
          <a href="#" className="block hover:underline">
            Sobre
          </a>
          <a href="#" className="block hover:underline">
            Contato
          </a>
          <Button />
        </div>
      </div>

      {/* Overlay que fecha ao clicar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-20"
          onClick={toggleSidebar}
        />
      )}
    </header>
  );
};

export default Header;
