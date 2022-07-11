const hoistNonReactStatics = require('hoist-non-react-statics');
module.exports = {
    locales: ["en", "ko"],
    defaultLocale: "ko",
    localeDetection: false,
    pages: {
        "*":["common"],
        "/401": ["401"],
        "/404": ["404"],
        "/500": ["500"]
    },
    staticsHoc: hoistNonReactStatics
}