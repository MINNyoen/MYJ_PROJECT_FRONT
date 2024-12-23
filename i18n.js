const hoistNonReactStatics = require('hoist-non-react-statics');
module.exports = {
    locales: ["en", "ko"],
    defaultLocale: "ko",
    localeDetection: false,
    pages: {
        "*":["common"],
        "/401": ["401"],
        "/403": ["403"],
        "/404": ["404"],
        "/500": ["500"],
        "/": ["home"],
        "/authentication/login": ["login"],
        "/authentication/register": ["register"],
        "/minyeonjin/planning/calendar": ["calendar"],
        "/minyeonjin/planning/kanban": ["kanban"],
        "/minyeonjin/community/board": ["board"],
        "/minyeonjin/community/board-write/[seq]": ["board"],
        "/minyeonjin/community/board-write": ["board"],
        "/minyeonjin/community/board-detail/[seq]": ["board"],
        "/minyeonjin/community/chatting": ["chatting"],
        "/minyeonjin/mypage": ["mypage"],
        "/minyeonjin/chatting": ["chatting"]
    },
    staticsHoc: hoistNonReactStatics
}