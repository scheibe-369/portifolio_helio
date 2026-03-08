/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                sora: ['Sora', 'sans-serif'],
            },
            colors: {
                primary: "#00FFFF", // Electric Cyan
                secondary: "#0066FF", // Intense Electric Blue
                dark: "#010208", // Almost Black Navy
                panel: "#080C21", // Deep Navy for cards
                accent: "#7000FF", // Neon Purple/Blue
            }
        },
    },
    plugins: [],
}
