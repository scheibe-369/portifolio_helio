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
                primary: "#00D4FF",
                secondary: "#2E86C1",
                dark: "#0D1B2A",
                panel: "#0F2133",
            }
        },
    },
    plugins: [],
}
