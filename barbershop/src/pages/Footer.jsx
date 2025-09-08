import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card text-text px-8">
      <div className="pt-10">
        <h2 className="text-2xl text-secondary py-2">Barbearia Garcia</h2>
        <p>
          Tradição e excelência em cada corte. Sua satisfação é nossa
          prioridade.
        </p>
      </div>

      <div className="pt-5">
        <h2 className="text-2xl text-secondary py-2">Links Rápidos</h2>
        <div className="flex flex-col">
          <a href="#">Inicio</a>
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </div>
      </div>

      <div className="py-5">
        <h2 className="text-2xl text-secondary py-2">Contato Rápido</h2>
        <div className="flex flex-col">
          <p>(31) 9 9592-5295</p>
          <p>contato@barbeariagarcia.com</p>
          <p>Av. A, 343 - Mangueiras</p>
        </div>
      </div>
      <div className="py-10 border-t-2">
        <div className="flex justify-center">
          <p>© 2025 Barbearia Garcia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
