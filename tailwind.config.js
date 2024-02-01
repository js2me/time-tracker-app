const defaultTheme = require('tailwindcss/defaultTheme');

const rem = (px) => `${px / 16}rem`;
const px = (px) => `${px}px`;

const range = (from, to, step) => {
  const arr = [from];
  let last_el = arr[arr.length - 1];
  while (last_el < to) {
    arr.push(last_el + step);
    last_el = arr[arr.length - 1];
  }
  return arr;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx,css,scss,svg}',
  ],
  prefix: '',
  theme: {
    fontFamily: {
      sans: [
        '"Open Sans", sans-serif',
        {
          fontOpticalSizing: 'auto',
          fontWeight: '500',
          fontStyle: 'normal',
          fontVariationSettings: '"wdth" 100',
        },
      ],
      mono: [...defaultTheme.fontFamily.mono],
    },
    /*
  font-family: "Open Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
 */
    screens: {
      xs: '500px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '2560px',
      '4xl': '3440px',
      // '2xl': '1400px',
    },
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      flex: {
        0: '0',
      },
      width: {
        view: 'var(--view-width)',
      },
      maxWidth: {
        view: 'var(--view-width)',
      },
      borderWidth: {
        DEFAULT: '1px',
        ...range(0, 8, 1).reduce((acc, spacing) => {
          acc[spacing] = px(spacing);
          return acc;
        }, {}),
      },
      spacing: {
        ...range(0, 100, 0.5).reduce((acc, spacing) => {
          acc[spacing] = rem(spacing * 4);
          return acc;
        }, {}),
      },
      scale: {
        102: '1.02',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        'custom-background': 'hsl(var(--custom-background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },
        reverse: {
          DEFAULT: 'hsl(var(--reverse))',
          foreground: 'hsl(var(--reverse-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        positive: {
          DEFAULT: 'hsl(var(--positive))',
          foreground: 'hsl(var(--positive-foreground))',
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
  plugins: [require('tailwindcss-animate')],
};
