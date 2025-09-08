import React from "react";
import imgCortes from "../assets/imgCortes.png";

const Sobre = () => {
  return (
    <section id="sobre" className="pt-12 bg-primary w-full">
      <div className="flex flex-col md:flex-row items-start px-4 md:px-10 pt-10 gap-8">
        <div className="flex-1">
          <h2 className="text-4xl text-center sm:text-4xl md:text-6xl font-bold text-secondary pb-6">
            Sobre nossa Barbearia
          </h2>
          <p className="text-lg text-center sm:text-xl md:text-2xl mx-auto font-bold text-text pb-8 max-w-full md:max-w-xl break-words">
            Há mais de 8 anos, a Barbearia Garcia tem sido sinônimo de tradição
            e excelência no cuidado masculino. Nossa paixão pela arte da
            barbearia se reflete em cada detalhe: desde o ambiente acolhedor até
            o atendimento personalizado que cada cliente recebe. Combinamos
            técnicas tradicionais com tendências modernas, utilizando apenas
            produtos premium para garantir resultados excepcionais.
          </p>
          <div className="flex flex-col items-center space-y-6">
            {/* WRAPPER */}
            <div className="flex justify-between items-baseline w-full max-w-md">
              <div className="flex flex-col items-center w-min">
                <span className="text-xl md:text-3xl font-bold text-secondary">
                  8+
                </span>
                <p className="text-sm md:text-xl text-text font-bold text-center whitespace-nowrap">
                  Anos de experiência
                </p>
              </div>
              <div className="flex flex-col items-center w-min">
                <span className="text-xl md:text-3xl font-bold text-secondary">
                  2000+
                </span>
                <p className="text-sm md:text-xl text-text font-bold text-center whitespace-nowrap">
                  Clientes Satisfeitos
                </p>
              </div>
            </div>

            <div className="flex justify-between items-baseline w-full max-w-md">
              <div className="flex flex-col items-center w-min">
                <span className="text-xl md:text-3xl font-bold text-secondary">
                  1
                </span>
                <p className="text-sm md:text-xl text-text font-bold text-center whitespace-nowrap">
                  Barbeiro Especialista
                </p>
              </div>
              <div className="flex flex-col items-center w-min">
                <span className="text-xl md:text-3xl font-bold text-secondary">
                  100%
                </span>
                <p className="text-sm md:text-xl text-text font-bold text-center whitespace-nowrap">
                  Dedicação Profissional
                </p>
              </div>
            </div>
            {/* WRAPPER */}
          </div>
        </div>

        <div className="flex justify-center sm:justify-center mx-auto md:justify-end py-6">
          <img
            src={imgCortes}
            alt="Foto dos cortes"
            className="w-full sm:max-w-sm md:max-w-md h-auto mx-auto lg:pr-24"
          />
        </div>
      </div>
    </section>
  );
};

export default Sobre;
