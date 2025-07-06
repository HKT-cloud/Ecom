const { createProxyMiddleware } = require('http-proxy-middleware');
const process = require('process');

const getBackendUrl = () => {
    // Check if we're in production environment
    if (process.env.NODE_ENV === 'production') {
        return 'https://ecom-backend-1uxs.onrender.com';
    }
    return 'http://localhost:3030';
};

module.exports = function(app) {
    const backendUrl = getBackendUrl();
    
    app.use(
        '/user',
        createProxyMiddleware({
            target: backendUrl,
            changeOrigin: true,
            credentials: true,
            secure: true, // Only allow HTTPS in production
            onProxyRes: (proxyRes) => {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
                proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            }
        })
    );
};
