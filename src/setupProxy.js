const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/bbs',
    createProxyMiddleware({
      target: 'http://imc.sejong.ac.kr/bbs',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  app.use(
    '/schoolnoticeapi',
    createProxyMiddleware({
      target: 'https://board.sejong.ac.kr',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  app.use(
    '/dodreamapi',
    createProxyMiddleware({
      target: 'https://do.sejong.ac.kr',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/dodreamapi': '',
      }
    })
  );
  app.use(
    '/classic',
    createProxyMiddleware({
      target: 'http://classic.sejong.ac.kr',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  app.use(
    '/myboard',
    createProxyMiddleware({
      target: 'http://imc.sejong.ac.kr/myboard',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  app.use(
    '/sejongauth',
    createProxyMiddleware({
      target: 'https://auth.imsejong.com',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};