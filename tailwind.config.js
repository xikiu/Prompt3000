/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './entrypoints/**/*.{html,ts,tsx}',
    './components/**/*.{html,ts,tsx}',
    './src/**/*.{html,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
        'card-soft': '0 4px 12px -2px rgba(0, 0, 0, 0.6)',
        'modal': '0 12px 36px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sound-wave': 'soundWave 1.2s ease-in-out infinite alternate',
        'modal-open': 'pillModalOpen 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-close': 'pillModalClose 0.16s cubic-bezier(0.4, 0, 1, 1) forwards',
        'modal-stagger-1': 'modalContentCascade 0.22s cubic-bezier(0.16, 1, 0.3, 1) 0.04s both',
        'modal-stagger-2': 'modalContentCascade 0.24s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both',
        'modal-stagger-3': 'modalContentCascade 0.26s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
        'modal-stagger-4': 'modalContentCascade 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both',
        'modal-stagger-5': 'modalContentCascade 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'pill-reappear': 'pillReappear 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        soundWave: {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        },
        pillModalOpen: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.85) translateY(12px)',
            filter: 'blur(4px)',
          },
          '65%': {
            transform: 'scale(1.015) translateY(-1px)',
            filter: 'blur(0px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
            filter: 'blur(0px)',
          },
        },
        pillModalClose: {
          '0%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
            filter: 'blur(0px)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.92) translateY(8px)',
            filter: 'blur(2px)',
          },
        },
        modalContentCascade: {
          '0%': {
            opacity: '0',
            transform: 'translateY(6px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pillReappear: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.92)',
          },
          '60%': {
            transform: 'scale(1.03)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
