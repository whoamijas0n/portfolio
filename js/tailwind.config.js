/* ==========================================================================
   Configuración personalizada de Tailwind CSS — Cyberpunk Dark Red
   ========================================================================== */

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary:       '#dc2626',
                'primary-dark':'#991b1b',
                'red-neon':    '#ff2a2a',
                'red-core':    '#c0392b',
                dark:          '#040406',
                'dark-card':   '#080810',
                'dark-panel':  '#0c0c18',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow':       'pulse 5s cubic-bezier(0.4,0,0.6,1) infinite',
                'float':            'float 6s ease-in-out infinite',
                'infinite-scroll':  'infinite-scroll 40s linear infinite',
                'spin-slow':        'spin 8s linear infinite',
                'ping-slow':        'ping 3s cubic-bezier(0,0,0.2,1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-18px)' },
                },
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to:   { transform: 'translateX(-100%)' },
                },
            },
        }
    }
};
