module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        animation: {
          'gradient-xy': 'gradientMove 15s ease infinite',
        },
        keyframes: {
          gradientMove: {
            '0%, 100%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
          },
        },
        backgroundSize: {
          '400%': '400% 400%',
        },
      },
    },
    plugins: [],
  }
  