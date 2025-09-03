import React from "react";
import logo from "../assets/logo.png";
import Button from "../components/Button";

const Header = () => {
  return (
    <header class="bg-primary text-text font-bold shadow-2xs p-5">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <img src={logo} alt="Logo do site" width="100" />

        <input type="checkbox" id="nav-toggle" class="peer hidden" />

        <label for="nav-toggle" class="sm:hidden cursor-pointer">
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
        </label>

        <nav class="hidden peer-checked:flex sm:flex items-center space-x-10">
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
    </header>
  );
};

export default Header;
