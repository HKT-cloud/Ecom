const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/user',
        createProxyMiddleware({
            target: 'http://localhost:3030',
            changeOrigin: true,
            credentials: true,
            onProxyRes: (proxyRes) => {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            }
        })
    );
};
