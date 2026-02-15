/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    'green': '#10b981', // emerald-500
                    'green-dark': '#065f46', // emerald-800
                    'green-deep': '#022c22', // emerald-950
                    'green-rich': '#047857', // emerald-700 - A lighter, more visible green for primary actions/backgrounds
                    'yellow': '#fbbf24', // amber-400
                    'yellow-vibrant': '#facc15', // yellow-400
                    'cream': '#fdfaf6',
                    'dark': '#0f172a', // slate-900
                    'dark-hover': '#334155', // slate-700
                    'accent': '#f43f5e', // rose-500
                },
            },
            backgroundImage: {
                'premium-gradient': 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
                'yellow-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                'brand-gradient': 'linear-gradient(to right, #022c22, #047857)', // Enhanced visibility: Deep to Emerald-700
            },
            maxWidth: {
                '8xl': '1735px',
                '9xl': '96rem',
                '10xl': '120rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

