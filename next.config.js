/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline'
]);

const withPlugins = require('next-compose-plugins');
const nextTranslate = require('next-translate');

module.exports = withPlugins([
  [nextTranslate],[withTM]
],
  { 
  webpack : (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
      });
      return config;
    }

}
)