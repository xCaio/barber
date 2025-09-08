import React from "react";
import Card from "../components/Card";

const NossosServicos = () => {
const services = [
    {
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      title: "Barba Completa",
      subtitle: 
        "Aparar, modelar e finalizar sua barba com produtos premium e técnicas tradicionais.",
        price: "R$10",
        duration: "20 min.",
    },
    {
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      title: "Combo Completo",
      subtitle: 
        "Corte + barba + sobrancelhas. O pacote completo para ficar impecável.",
        price: "R$45",
        duration: "50 min.",
    },
    {
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      title: "Tratamento Premium",
      subtitle: 
        "Hidratação capilar, massagem relaxante e produtos de alta qualidade.",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://images.unsplash.com/photo-1527512950678-b88a241e9f4b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pigmentação",
      subtitle: 
        "Pigmentação profissional para barba e cabelo, garantindo intensidade e durabilidade.",
        price: "R$20",
        duration: "45 min.",
    },
    {
      image: "https://www.gazetadigital.com.br/storage/webdisco/2022/12/28/1200x900/1c85c7b72de5987786bacfa560472814.jpg",
      title: "Platinado / Descoloração",
      subtitle: 
        "Transforme seu visual com descoloração ou platinado feito por um profissional experientes.",
        price: "R$70",
        duration: "1h 30 min.",
    },
  ];

  return (
    <section id="servicos" className="pt-12 bg-primary w-full px-4">
      <div className="flex flex-col text-center mb-10">
        <h2 className="text-4xl sm:text-4xl md:text-6xl font-bold text-secondary pb-4">
          Nossos Serviços
        </h2>
        <p className="text-lg sm:text-2xl md:text-4xl font-bold text-text">
          Oferecemos uma gama completa de serviços para cuidar do seu estilo com
          maestria
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {services.map((service, index) => (
          <Card key={index} item={service} />
        ))}
      </div>
    </section>
  );
};

export default NossosServicos;