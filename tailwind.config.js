export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#040B14',
        foreground: '#D1E8ED',
        abyss: '#040B14',
        cyan: '#00F2FF',
        seafoam: '#D1E8ED',
        titanium: '#3A4D5C',
        card: '#07131F',
        border: '#3A4D5C',
        ring: '#00F2FF',
        'muted-foreground': '#8094A3',
      },
      fontFamily: {
        heading: ['Arial Narrow', 'Arial', 'sans-serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
