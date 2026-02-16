import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './index.tsx',
        './App.tsx',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0a0d10',
                    primary: '#047857', // Dark Green (Emerald-700)
                    secondary: '#111827', // Deep Navy for contrast
                    cyan: '#0891b2', // Legible Cyan
                    lime: '#afff45',
                    orange: '#f59e0b',
                    gray: {
                        100: '#f8f9fa',
                        200: '#e9ecef',
                        800: '#343a40',
                        900: '#212529',
                    }
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
                brand: ['Fredoka', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
            perspective: {
                '1000': '1000px',
            }
        },
    },
    plugins: [],
};

export default config;
