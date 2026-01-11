/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                felt: {
                    DEFAULT: '#1a5f3e',
                    dark: '#0f3d28',
                    light: '#2d7a4e'
                },
                gold: {
                    DEFAULT: '#d4af37',
                    light: '#e5c76b'
                },
                card: {
                    cream: '#f5f0e6',
                    red: '#c41e3a',
                    black: '#1a1a1a'
                },
                wood: {
                    DEFAULT: '#5c4033',
                    dark: '#3b2616'
                }
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
                card: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            animation: {
                'card-flip': 'cardFlip 0.6s ease-out forwards',
                'card-fly': 'cardFly 0.4s ease-out forwards',
            },
            keyframes: {
                cardFlip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                cardFly: {
                    '0%': { transform: 'scale(1) translateY(0)' },
                    '50%': { transform: 'scale(1.1) translateY(-20px)' },
                    '100%': { transform: 'scale(1) translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
