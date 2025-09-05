import { useState } from "react";
import Header from "./pages/Header";
import Home from "./pages/Home";
import NossosServicos from "./pages/NossosServicos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";

function App() {
  const [count, setCount] = useState(0);

  return <>
    <Header/>
    <Home/>
    <NossosServicos/>
    <Sobre/>
    <Contato/>
  </>;
}

export default App;
