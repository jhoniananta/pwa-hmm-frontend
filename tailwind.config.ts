import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        ungu: '#262C63',
        oren: '#DA1515',
        kuning: '#FABC29',
        navy: '#262C63',
        hijau: '#4CBC9A',
        merah: '#FF4550',
        background: '#F3F3F3',
        abu: {
          1: '#F5F5F5',
          2: '#D7E7FF',
          3: '#A098AE',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', ...fontFamily.sans], // ← override default
        poltawski: ['var(--font-poltawski)', ...fontFamily.serif],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
        '4xs': '0.375rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.table-admin': {
          '*': {
            '*': {
              '*': {
                fontSize: theme('fontSize.xs'),
              },
            },
          },
        },
        '@media (min-width: 780px)': {
          '.table-admin': {
            '*': {
              '*': {
                '*': {
                  fontSize: theme('fontSize.sm'),
                },
              },
            },
          },
        },
      });
    }),
  ],
} satisfies Config;

export default config;
