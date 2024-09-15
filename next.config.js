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

module.exports = withPlugins(
  [
    withTM, // 첫번째 플러그인
    nextTranslate // 두번째 플러그인
  ],
  {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'] // SVG 파일 처리 설정
      });
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['/node_modules/'], // 배열 또는 정규식으로 설정
      };
      return config
    }
  }
);