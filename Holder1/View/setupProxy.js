const { createProxyMiddleware } = require('http-proxy-middleware');
const process = require('process');

const getBackendUrl = () => {
    return process.env.NODE_ENV === 'production' 
        ? 'https://ecomexpress-dn3d.onrender.com' 
        : 'http://localhost:3000';
};

module.exports = function(app) {
    const backendUrl = getBackendUrl();
    console.log('Proxying requests to:', backendUrl);

    const proxyOptions = {
        target: backendUrl,
        changeOrigin: true,
        credentials: true,
        secure: process.env.NODE_ENV === 'production',
        logLevel: 'debug',
        onError: (err, req, res) => {
            console.error('Proxy error:', {
                error: err.message,
                request: {
                    method: req.method,
                    url: req.url,
                    headers: req.headers
                }
            });
        },
        onProxyRes: (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
        }
    };

    // Proxy all API routes
    app.use('/user', createProxyMiddleware(proxyOptions));
    // Proxy OTP routes
    app.use('/otp', createProxyMiddleware(proxyOptions));
};
            }
        })
    );
};
