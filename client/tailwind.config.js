/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                electric: '#007BFF',
                neonYellow: '#FFD700',
                gold: {
                    50: '#FFF8F0',
                    100: '#FFEFD6',
                    200: '#FFE0B2',
                    300: '#FFCC80',
                    400: '#FFB74D',
                    500: '#D4945A',
                },
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [],
}
