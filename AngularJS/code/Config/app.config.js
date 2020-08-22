angular.module('app.configs', [])
  .constant('CONFIGS', {
    baseURL: function () {
      if (location.host === "portal.pulseos.com") {
        return "http://ppapp.pulseos.com/api";
      } else if (location.host === "demo.pulseos.com") {
        return "http://dmapp.pulseos.com/api";
      } else if (location.host === "dev.pulseos.com") {
        return "http://dvapp.pulseos.com/api";
      } else if (location.host === "pulseos.demo.beesightsoft.com") { //demo BSS
        return location.protocol + "//local.beesightsoft.com:5800/api";
      } else if (location.host === "192.168.1.200:4800") { // dev BSS
        return location.protocol + "//192.168.1.222:5800/api";
      } else { // For dev Smartdatainc
        return location.protocol + "//172.24.1.251/api";
      }
    },
    google: {
      apiKey: 'AIzaSyBx5jP0jPUwFeoZbo66r2wczg5fkaB_w0M',
      clientId: '204069669661-aasf54v71s8gp29n2ov9in5f94v740d8.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ],
      calendarId: null
    },
    passwordMinLength: 8,
    countPerPage: 25
  });