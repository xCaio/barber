import React from "react";
import logo from "../assets/logo.png";
import logoHome from "../assets/logoHome.png";
import bgImage from "../assets/background.jpg";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
const Home = () => {
  return (
    <section
      className="bg-cover bg-center h-full w-full"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex justify-center pt-31">
        <img src={logoHome} alt=" Logo da Pagina"/>
      </div>
      <div className="flex justify-center text-text text-3xl pb-16 pt-2">
        <h2 className="w-3xl text-center">Tradição, qualidade e estilo em cada corte. Onde a arte da barbearia encontra a excelencia</h2>
      </div>

      <div className="flex justify-center pb-52">
        <Button/>
        <ButtonSecondary/>
      </div>
    </section>
  );
};

export default Home;
