const react = require('@vitejs/plugin-react');
const basicSsl = require('@vitejs/plugin-basic-ssl');

module.exports = {
  plugins: [basicSsl(), react()],
  server: {
    https: false,
    port: 5173,
    // strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //   },
    // },
  },
};
