/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy token names keep existing views readable while using the
        // PayPerCase desktop palette.
        yogurt:    '#f7f5fc',
        blueberry: '#4c1d95',
        whipped:   '#c4b5fd',
        crust:     '#ffab91',
        darkberry: '#1f1633',

        primary: {
          DEFAULT: '#4c1d95',
          dark:    '#311055',
          hover:   '#5b21b6',
          soft:    '#ede9fe',
          soft2:   '#f5f1ff',
        },
        surface: {
          main: '#f7f5fc',
          card: '#ffffff',
          soft: '#fbfaff',
          cream: '#fdf8f3',
        },
        hairline: {
          DEFAULT: '#e9e4f5',
          light:   '#f2eefb',
          input:   '#d8d0ea',
        },

        // Violet-tinted neutrals so every existing gray utility follows the
        // desktop theme rather than a cool stock gray.
        gray: {
          50:  '#fbfaff',
          100: '#f2eefb',
          200: '#e9e4f5',
          300: '#d8d0ea',
          400: '#9a92ad',
          500: '#6b6280',
          600: '#3f3356',
          700: '#1f1633',
          800: '#1a1130',
          900: '#110b20',
        },
        red: {
          50:  '#feeceb',
          100: '#fddbd8',
          200: '#f7b6b0',
          300: '#f19089',
          400: '#e6675d',
          500: '#d92d20',
          600: '#b42318',
          700: '#912018',
        },
        green: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        yellow: {
          50:  '#fff8e1',
          100: '#fff1c2',
          200: '#ffe082',
          600: '#b45309',
          700: '#8a6420',
        },
        orange: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
        },
        blue: {
          50:  '#f5f1ff',
          100: '#ede9fe',
          500: '#7c3aed',
          600: '#5b21b6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '"IBM Plex Sans Thai"',
          'Tahoma',
          'system-ui',
          'sans-serif',
        ],
        tahoma: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs:   ['11px',   { lineHeight: '1.5' }],
        sm:   ['12.5px', { lineHeight: '1.55' }],
        base: ['13px',   { lineHeight: '1.6' }],
        lg:   ['14px',   { lineHeight: '1.5' }],
        xl:   ['16px',   { lineHeight: '1.45' }],
        '2xl': ['20px',  { lineHeight: '1.3' }],
        '3xl': ['26px',  { lineHeight: '1.25' }],
      },
      boxShadow: {
        soft: 'rgba(49, 16, 85, 0.06) 0 1px 3px',
        lift: 'rgba(49, 16, 85, 0.08) 0 8px 24px, rgba(49, 16, 85, 0.04) 0 2px 6px',
      },
    },
  },
  plugins: [],
}
