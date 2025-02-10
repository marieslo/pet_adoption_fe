module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: 'var(--primary-color)', 
          secondary: 'var(--secondary-color)',
          accent: 'var(--accent-color)',
        },
        fontFamily: {
          primary: 'var(--font-primary)',
          secondary: 'var(--font-secondary)',
        },
      },
    },
    darkMode: 'media',
    plugins: [],
  }
  