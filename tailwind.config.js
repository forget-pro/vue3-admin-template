/** @type {import('tailwindcss').Config} */
import { tailwindMergeVars } from './tailwindcss/generate.js'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      ...tailwindMergeVars,
    },
  },
}
