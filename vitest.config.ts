module.exports = {
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: './coverage',
    exclude: [
      'node_modules/',
      '.next/',
      'src/app/api/docs/**',
      'src/app/api/auth/[...nextauth]/route.ts',
    ],
  },
}