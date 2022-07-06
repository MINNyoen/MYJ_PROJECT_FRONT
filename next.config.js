/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');

module.exports = nextTranslate();

module.exports = {
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack']
        });
        return config;
      }
}