// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'home-bg': "url('/background.jpg')", // se estiver em public
        'home-bg': "url('../src/assets/background.jpg')"
      },
    },
  },
  plugins: [],
};
