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
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
    {
      image: "https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg",
      title: "Corte Masculino",
      subtitle: 
        "Corte personalizado com acabamento perfeito, adaptado ao seu estilo e formato de rosto",
        price: "R$25",
        duration: "45 min.",
    },
  ];

  return (
    <section className="pt-12 bg-primary w-full px-4">
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