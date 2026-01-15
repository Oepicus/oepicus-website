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
      colors: {
        'void': '#0A0A0C',
        'panel': '#121214',
        'text-main': '#EAEAEA',
        'text-muted': '#888888',
        'brand-gold': '#C5A059',
        'brand-red': '#8A2525',
        'brand-dark': '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Red Rose"', 'sans-serif'],
        display: ['"Red Rose"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
}
