import js from '@eslint/js'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
)
