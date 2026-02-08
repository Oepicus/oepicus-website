module.exports = {
  content: [
    './_layouts/**/*.{html,liquid}', // Scan Jekyll layouts
    './_includes/**/*.{html,liquid}', // Scan Jekyll includes
    './_posts/**/*.md', // Scan Jekyll posts
    './*.{html,liquid}', // Scan root HTML/Liquid files (like index.html)
    './_data/**/*.json', // Scan all JSON files in _data directory
    // If you have any custom JavaScript files where you dynamically add Tailwind classes,
    // you might need to add a path like './assets/js/**/*.js' here.
  ],
  theme: {
    extend: {
      blur: {
        '0': '0',
      },
      scale: {
        '100': '1',
      },
      width: {
        '80': '80%',
      },
      colors: {
        void: '#050505',
        panel: '#121214',
        brand: {
          gold: '#C5A059',
          red: '#8A2525',
          dark: '#0A0A0A'
        },
        text: {
          main: '#ffffff',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        display: ['"Red Rose"', 'cursive'],
        sans: ['"Red Rose"', 'sans-serif'],
        ipa: ['"Noto Sans"', 'sans-serif']
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 15s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        }
      },
      screens: { 'xs': '475px' }
    }
  }
}
