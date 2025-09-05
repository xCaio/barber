1. Introdução ao Projeto

Barbearia Garcia Landing Page
Este projeto é uma landing page moderna, responsiva e otimizada, feita com React e inicializada com Vite. A estilização foi implementada com TailwindCSS, garantindo agilidade no desenvolvimento e facilidade para manutenção futura.

A landing page tem como objetivo principal apresentar a Barbearia Garcia, seus serviços, equipe e localização, com foco em conversão de visitantes em clientes — seja através de agendamento online ou contato direto.

2. Tecnologias Utilizadas

React: Biblioteca JavaScript para construção de interfaces de usuário.

Vite: Ferramenta de build rápida e moderna, ideal para desenvolvimento com React.

TailwindCSS: Framework utilitário CSS para estilização responsiva e eficiente.

3. Estrutura do Projeto
barbearia-garcia/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/           # Imagens e ícones da barbearia
│   ├── components/       # Componentes reutilizáveis (Header, Footer, Hero, ... )
│   ├── pages/            # Componentes de página (Main landing)
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Entrada da aplicação
├── tailwind.config.js    # Configurações do TailwindCSS
├── package.json
└── vite.config.js        # Configurações do Vite

4. Estrutura dos Arquivos e Boas Práticas

src/components/: organize componentes reutilizáveis como Button.jsx, ButtonSecondary.jsx, Card.jsx, etc.

tailwind.config.js: personalize a paleta de cores, fontes e espaçamentos de acordo com a identidade visual da Barbearia Garcia:

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'home-bg': "url('../src/assets/background.jpg')"
      },
    },
  },
  plugins: [],
};

5. Teste Final
Chegando ao último passo:

- Ao rodar npm run dev, confirme visualmente no navegador:
    - Responsividade: use o DevTools (F12) para testar em diferentes dispositivos—desktop, tablet, mobile.  
    - Componentes interativos: botões, links, formulários devem funcionar normalmente.
    - Estilo consistente com a identidade visual da barbearia.
    - Performance: carregamento rápido e fluidez no scroll e interações.