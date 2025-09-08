// tailwind.config.js - Enhanced with Bitcoin Space Theme
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bitcoin Space Theme Colors
        'neon-green': '#00ff41',
        'carbon-black': '#0a0a0a',
        'medium-gray': '#1a1a1a',
        'deep-purple': '#2d1b4e',
        'cyber-blue': '#0066ff',
        'electric-purple': '#8b5cf6',
        'warning-orange': '#f59e0b',
        'danger-red': '#ef4444',
        'success-green': '#10b981',
        'info-blue': '#3b82f6',
        
        // Custom Card Colors
        'card': 'rgba(26, 26, 26, 0.8)',
        'card-hover': 'rgba(26, 26, 26, 0.9)',
        
        // Gradient Colors
        'gradient-start': '#00ff41',
        'gradient-end': '#0066ff',
        'gradient-purple-start': '#8b5cf6',
        'gradient-purple-end': '#2d1b4e',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #00ff41 0%, #0066ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8b5cf6 0%, #2d1b4e 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00ff41, transparent)',
        'gradient-cyber': 'linear-gradient(90deg, #0066ff, #00ff41)',
        'gradient-electric': 'linear-gradient(90deg, #8b5cf6, #00ff41)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 65, 0.3)',
        'neon-lg': '0 0 30px rgba(0, 255, 65, 0.4)',
        'neon-xl': '0 0 40px rgba(0, 255, 65, 0.5)',
        'purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'orange': '0 0 20px rgba(245, 158, 11, 0.3)',
        'red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'card': '0 0 20px rgba(0, 255, 65, 0.2)',
        'card-hover': '0 0 30px rgba(0, 255, 65, 0.3)',
        'glow': '0 0 50px rgba(0, 255, 65, 0.4)',
        'glow-lg': '0 0 80px rgba(0, 255, 65, 0.5)',
        'glow-xl': '0 0 120px rgba(0, 255, 65, 0.6)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
        'glow': 'glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float-particles': 'float-particles 6s ease-in-out infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'scan-line': 'scan-line 4s ease-in-out infinite',
        'agent-card-hover': 'agent-card-hover 0.4s ease-out',
        'agent-pulse': 'agent-pulse 2s ease-in-out infinite',
        'agent-shimmer': 'agent-shimmer 2s linear infinite',
        'agent-corner-accent': 'agent-corner-accent 0.3s ease-out',
        'agent-floating-particle': 'agent-floating-particle 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 30px rgba(0, 255, 65, 0.6)',
          },
        },
        'glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 255, 65, 0.6)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'float-particles': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0.3',
          },
          '25%': {
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.6',
          },
          '50%': {
            transform: 'translateY(-40px) translateX(-10px)',
            opacity: '0.8',
          },
          '75%': {
            transform: 'translateY(-20px) translateX(5px)',
            opacity: '0.6',
          },
        },
        'neon-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 255, 65, 0.6)',
          },
        },
        'gradient-shift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        'scan-line': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'agent-card-hover': {
          '0%': {
            transform: 'translateY(0) scale(1) rotateY(0) rotateX(0)',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
          },
          '50%': {
            transform: 'translateY(-12px) scale(1.05) rotateY(5deg) rotateX(5deg)',
            boxShadow: '0 0 40px rgba(0, 255, 65, 0.4)',
          },
          '100%': {
            transform: 'translateY(-12px) scale(1.05) rotateY(5deg) rotateX(5deg)',
            boxShadow: '0 0 40px rgba(0, 255, 65, 0.4)',
          },
        },
        'agent-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8',
            boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
          },
          '50%': {
            transform: 'scale(1.3)',
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)',
          },
        },
        'agent-shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'agent-corner-accent': {
          '0%': {
            opacity: '0',
            transform: 'scale(0)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'agent-floating-particle': {
          '0%': {
            transform: 'translateY(0) scale(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateY(-20px) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(0) scale(0)',
            opacity: '0',
          },
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
