import React from "react";

const Card = ({item}) => {
  return (
    <div className="py-4">
    <div className="card w-80 sm:w-72 md:w-64 h-96 bg-card rounded-xl p-4">
        <div className="space-y-2">
          <img className="rounded-xl" src={item.image} alt="Imagem do serviço" />
          <h3 className="text-2xl font-bold text-secondary">{item.title}</h3>
          <p className="text-text">{item.subtitle}</p>
          <div className="flex justify-between px-1">
          <p>{item.price}</p>
          <p>{item.duration}</p>
          </div>
        </div>
    </div>
    </div>
  );
};

export default Card;
