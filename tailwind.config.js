/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}",
          "./node_modules/flowbite/**/*.js", 
  ],
  theme: {
    colors: {
      'green': '#2BA500',
      'button-green':'#073406',
      'black': '#000000',
      'grey': '#3D3C3C',
      'white':'#ffff',
      'nav-color':'#24272C',
      'sidebar':'#323232',
      'red':'#FF0000',
      'light_gray':'#4a4a46'
    },
    extend: {},
  },
  plugins: [],
}

