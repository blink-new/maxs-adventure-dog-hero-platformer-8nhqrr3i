module.exports = {
  extends: ['expo', '@react-native'],
  rules: {
    // Disable some rules that might be too strict for game development
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};