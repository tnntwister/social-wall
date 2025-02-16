/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',    // Bluesky
                secondary: '#5865F2',   // Discord
                background: '#F3F4F6',
                text: '#1F2937',
                muted: '#6B7280',
            },
            scale: {
                '102': '1.02',
            },
            transitionDuration: {
                '200': '200ms',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'lg': '0 4px 6px rgba(0, 0, 0, 0.1)',
                'xl': '0 10px 15px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}