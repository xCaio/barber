import RevealOnScroll from './RevealOnScroll';

export default function Card({ item, index = 0 }) {
  return (
    <RevealOnScroll delay={index * 90} direction="up" className="w-full">
      <div className="service-card py-2 sm:py-4 cursor-pointer w-full border border-transparent rounded-2xl">
        <div className="bg-card rounded-xl p-3 sm:p-4 flex flex-col h-full border border-gray-800/60">
          <div className="overflow-hidden rounded-xl mb-3 sm:mb-4">
            <img
              src={item.image}
              alt={item.title}
              className="service-card-image w-full h-40 sm:h-48 object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary mb-1.5 sm:mb-2 leading-tight">
            {item.title}
          </h3>
          <p className="text-text text-sm sm:text-base flex-grow mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            {item.subtitle}
          </p>
          <div className="flex justify-between items-center text-sm sm:text-base text-text font-bold pt-2 border-t border-gray-800/80 gap-2">
            <span className="text-secondary shrink-0">{item.price}</span>
            <span className="text-right">{item.duration}</span>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
