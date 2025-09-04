import React from "react";

const Card = ({ item }) => {
  return (
    <div className="py-4 cursor-pointer w-full max-w-sm">
      <div className="bg-card rounded-xl p-4 flex flex-col h-full">
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-secondary mb-2">
          {item.title}
        </h3>
        <p className="text-text flex-grow mb-4">{item.subtitle}</p>
        <div className="flex justify-between text-text font-bold">
          <span className="text-secondary">{item.price}</span>
          <span>{item.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
