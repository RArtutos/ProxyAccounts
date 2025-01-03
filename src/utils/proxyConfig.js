export function createProxyConfig(account, req, targetDomain) {
  const accountPath = `/stream/${encodeURIComponent(account.name)}`;
  
  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    // Añadir configuración específica para WebSocket
    wsOptions: {
      maxPayload: 64 * 1024 * 1024, // 64MB
      pingTimeout: 60000,
      pingInterval: 25000
    },
    onProxyReqWs: (proxyReq, req, socket) => {
      // Manejar errores de socket
      socket.on('error', (err) => {
        console.log('WebSocket socket error:', err);
      });
    },
    onError: (err, req, res) => {
      console.log('Proxy error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      }
    },
    pathRewrite: (path) => {
      if (path.includes('http://') || path.includes('https://')) {
        const matches = path.match(/\/stream\/[^/]+\/(.+)/);
        return matches ? `/${matches[1]}` : path;
      }
      return path.startsWith(accountPath) 
        ? path.slice(accountPath.length) || '/'
        : path;
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Proto': req.protocol,
      'X-Forwarded-Host': req.get('host'),
      ...(account.cookies && {
        'Cookie': Object.entries(account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ')
      })
    }
  };
}