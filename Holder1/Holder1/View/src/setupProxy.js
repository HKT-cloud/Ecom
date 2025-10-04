const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyOptions = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    credentials: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Accept', 'application/json');
      proxyReq.setHeader('Origin', 'http://localhost:5173');
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({
        message: 'Proxy error occurred',
        error: err.message
      });
    }
  };

  app.use(
    '/user',
    createProxyMiddleware(proxyOptions)
  );
};
