/** @type {import('tailwindcss').Config} */
export default {
  // Тука му кажуваме на Tailwind каде да ги бара твоите класи во проектот
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Можеш да додадеш дополнителни сопствени бои или фонтови доколку сакаш
    },
  },
  plugins: [],
}