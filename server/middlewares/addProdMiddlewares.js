import { API_IP, API_PORT } from 'utils/constants';
const path = require('path');
const express = require('express');
const compression = require('compression');
const proxy = require('http-proxy-middleware');
module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));
  app.use(proxy('/api', { target: `http://${API_IP}:${API_PORT}/` }));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html')),
  );
};
