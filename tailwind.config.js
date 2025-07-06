import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        surface: {
          DEFAULT: '#ffffff',
          variant: '#f8fafc',
          container: '#f1f5f9',
          'container-low': '#f8fafc',
          'container-high': '#e2e8f0',
          'container-highest': '#cbd5e1',
          'container-lowest': '#ffffff',
          dim: '#f1f5f9',
          bright: '#ffffff',
        },
        background: 'hsl(var(--background))',
        'on-surface': {
          DEFAULT: '#0f172a',
          variant: '#334155',
          muted: '#64748b',
        },
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-background': '#0f172a',
        'on-error': '#ffffff',
        'text-on-dark': {
          DEFAULT: '#ffffff',
          secondary: '#f1f5f9',
          muted: '#e2e8f0',
        },
        outline: {
          DEFAULT: '#d1d5db',
          variant: '#e5e7eb',
        },
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: [
          '0.75rem',
          {
            lineHeight: '1.125rem',
            letterSpacing: '0.025em',
          },
        ],
        sm: [
          '0.875rem',
          {
            lineHeight: '1.375rem',
            letterSpacing: '0.025em',
          },
        ],
        base: [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0',
          },
        ],
        lg: [
          '1.125rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0',
          },
        ],
        xl: [
          '1.25rem',
          {
            lineHeight: '1.875rem',
            letterSpacing: '-0.025em',
          },
        ],
        '2xl': [
          '1.5rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.025em',
          },
        ],
        '3xl': [
          '1.875rem',
          {
            lineHeight: '2.375rem',
            letterSpacing: '-0.025em',
          },
        ],
        '4xl': [
          '2.25rem',
          {
            lineHeight: '2.75rem',
            letterSpacing: '-0.025em',
          },
        ],
        '5xl': [
          '3rem',
          {
            lineHeight: '3.5rem',
            letterSpacing: '-0.025em',
          },
        ],
        '6xl': [
          '3.75rem',
          {
            lineHeight: '4rem',
            letterSpacing: '-0.025em',
          },
        ],
        '7xl': [
          '4.5rem',
          {
            lineHeight: '5rem',
            letterSpacing: '-0.025em',
          },
        ],
        '8xl': [
          '6rem',
          {
            lineHeight: '6.5rem',
            letterSpacing: '-0.025em',
          },
        ],
      },
      screens: {
        xs: '475px',
        '3xl': '1920px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 4px 25px -5px rgba(0, 0, 0, 0.07)',
        'elevation-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
        'elevation-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.04), 0px 2px 3px 0px rgba(0, 0, 0, 0.08)',
        'elevation-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.04), 0px 4px 4px 0px rgba(0, 0, 0, 0.08)',
        'glow-primary': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-secondary': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite linear',
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideLeft: {
          '0%': {
            transform: 'translateX(10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideRight: {
          '0%': {
            transform: 'translateX(-10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      gradientColorStops: {
        'primary-gradient': '#0ea5e9',
        'secondary-gradient': '#14b8a6',
        'accent-gradient': '#f97316',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [
    // Custom plugin for Material Design 3.0 utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.surface': {
          backgroundColor: theme('colors.surface.DEFAULT'),
          color: theme('colors.on-surface.DEFAULT'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.elevation-1'),
        },
        '.surface-variant': {
          backgroundColor: theme('colors.surface.variant'),
          color: theme('colors.on-surface.DEFAULT'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.elevation-1'),
        },
        '.surface-container': {
          backgroundColor: theme('colors.surface.container'),
          color: theme('colors.on-surface.DEFAULT'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.elevation-1'),
        },
        '.surface-elevated': {
          backgroundColor: theme('colors.surface.DEFAULT'),
          color: theme('colors.on-surface.DEFAULT'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.elevation-3'),
        },
        '.glass-effect': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: theme('borderRadius.xl'),
        },
        '.gradient-text': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.secondary.600')})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: theme('fontWeight.bold'),
        },
        '.text-shadow': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
      };

      addUtilities(newUtilities);
    },
    tailwindcssAnimate,
  ],
  darkMode: ['media', 'class'],
};
