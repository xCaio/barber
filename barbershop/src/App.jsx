import { useState } from "react";
import Header from "./pages/Header";
import Home from "./pages/Home";
import NossosServicos from "./pages/NossosServicos";

function App() {
  const [count, setCount] = useState(0);

  return <>
    <Header/>
    <Home/>
    <NossosServicos/>
  </>;
}

export default App;
