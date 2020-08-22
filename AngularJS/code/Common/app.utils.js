angular.module('app.utils', [])
  .factory('utils', function ($filter, $q, DIRECTDEPOSIT) {

    function convertInchesToFeetAndInches(data) {
      var result = '', feet = 0, inches = 0;
      data = parseInt(data);
      feet = parseInt(data / 12);
      inches = parseInt(data % 12);
      if (feet === 0) {
        result = inches + "''";
      } else {
        result = feet + "'" + inches + "''";
      }

      return result;

    }

    function convertToInches(data) {

      var result = '',
        feet = 0,
        inches = 0;
      data = parseInt(data);
      feet = parseInt(data / 12);
      inches = parseInt(data % 12);
      if (feet === 0) {
        result = inches + "''";
      } else {
        result = 12 * feet + inches;
        result += "''";
      }

      return result;

    }

    var service = {

      checkState: function (state) {
        state = state.$current.name;
   
        if (state.indexOf('dashboard') > -1 || state.indexOf('dashboardClientUrl') > -1) {
          return 'dashboard';
        } else if (state.indexOf('user-manager') > -1 || state.indexOf('user-managerClientUrl') > -1) {
          return 'user-manager';
        } else if (state.indexOf('imp-documents') > -1 || state.indexOf('imp-documentsClientUrl') > -1) {
          return 'imp-documents';
        } else if (state.indexOf('registration') > -1 || state.indexOf('registrationClientUrl') > -1) {
          return 'registration';
        } else if (state.indexOf('profile') > -1 || state.indexOf('profileClientUrl') > -1) {
          return 'profile';
        } else if (state.indexOf('change-form-manager') > -1) {
          return 'change-form-manager';
        } else if (state.indexOf("loggedIn.modules.health-results") > -1) {
          return 'health-results';
        } else if (state.indexOf("public.healthresultadmin") > -1) {
          return 'public-healthresult-admin';
        } else if (state.indexOf('direct-deposit-manager') > -1) {
          return 'direct-deposit-manager';
        } else if (state.indexOf('privacy-authorization-form-manager') > -1) {
          return 'privacy-authorization-form-manager';
        } else if (state.indexOf('list-participantsurveys') > -1) {
          return 'list-participantsurveys';
        } else if (state.indexOf('invoice-manager') > -1) {
          return 'invoice-manager';
        } else if (state.indexOf('participant') > -1 || state.indexOf('participantClientUrl') > -1) {
          return 'participant';
        } else if (state.indexOf('biomarkers') > -1 || state.indexOf('biomarkersClientUrl') > -1) {
          return 'biomarkers';
        } else if (state.indexOf('metabolic-syndrome') > -1 || state.indexOf('metabolic-syndromeClientUrl') > -1) {
          return 'metabolic-syndrome';
        } else if (state.indexOf('health-results') > -1 || state.indexOf('health-resultsClientUrl') > -1) {
          return 'health-results';
        } else if (state.indexOf('health-coaching') > -1 || state.indexOf('health-coachingClientUrl') > -1) {
          return 'health-coaching';
        } else if (state.indexOf('health-coach-request-manager') > -1) {
          return 'health-coach-request-manager';
        } else if (state.indexOf('health-coach-request') > -1) {
          return 'health-coach-request';
        } else if (state.indexOf('home') > -1 || state.indexOf('homeClientUrl') > -1) {
          return 'home';
        } else if (state.indexOf('pageAbout') > -1) {
          return 'about';
        } else if (state.indexOf('settings') > -1) {
          return 'settings';
        } else if (state.indexOf('list-contact') > -1) {
          return 'list-contact';
        } else if (state.indexOf('contact') > -1 || state.indexOf('contactClientUrl') > -1) {
          return 'contact';
        } else if (state.indexOf('add-faqs') > -1) {
          return 'add-faqs';
        } else if (state.indexOf('add-question') > -1) {
          return 'add-question';
        } else if ((state.indexOf('loggedIn.modules.audit-logs') === 0) && (state.indexOf('loggedIn.modules.audit-logs.login-logs') === -1)) {       
          return 'audit-logs';
        } else if((state.indexOf('loggedIn.modules.audit-logs') === 0) && (state.indexOf('loggedIn.modules.audit-logs.login-logs') === 0)){
          return 'login-logs';
        } else if (state.indexOf('add-health-topics') > -1) {
          return 'add-health-topics';
        } else if (state.indexOf('list-faqs') > -1) {
          return 'list-faqs';
        } else if (state.indexOf('listFaqs') > -1) {
          return 'listFaqs';
        } else if (state.indexOf('submit-claims') > -1) {
          return 'submit-claims';
        } else if (state.indexOf('status-claims') > -1) {
          return 'status-claims';
        } else if (state.indexOf('bcs-par-claims') > -1) {
          return 'bcs-par-claims';
        } else if (state.indexOf('history-claims') > -1) {
          return 'history-claims';
        } else if (state.indexOf('reports') > -1) {
          return 'reports';
        } else if (state.indexOf('manager-claims') > -1) {
          return 'manager-claims';
        } else if (state.indexOf('faqs') > -1 || state.indexOf('faqsClientUrl') > -1) {
          return 'faqs';
        } else if (state.indexOf('loginForm') > -1) {
          return 'login';
        } else if (state.indexOf('server.maintenance') > -1) {
          return 'server-maintenance';
        } else if (state.indexOf('usernameForm') > -1) {
          return 'usernameForm';
        } else if (state.indexOf('findAccount') > -1) {
          return 'find-account';
        } else if (state.indexOf('questionFrom') > -1) {
          return 'questionFrom';
        } else if (state.indexOf('forgotUsername') > -1) {
          return 'forgot-username';
        } else if (state.indexOf('forgotPassword') > -1) {
          return 'forgot-password';
        } else if (state.indexOf('pagesAbout') > -1) {
          return 'about';
        } else if (state.indexOf('loggedIn.modules.enrollmentCards') > -1) {
          return 'enrollmentCards';
        } else if (state.indexOf('loggedIn.modules.directDeposit') > -1) {
          return 'directDeposit';
        } else if (state.indexOf('loggedIn.modules.privacyAuthorizationForm') > -1) {
          return 'privacyAuthorizationForm';
        } else if (state.indexOf('health-screening') > -1) {
          return 'health-screening';
        } else if (state.indexOf('loggedIn.modules.changeFormAll') > -1) {
          return 'changeFormAll';
        } else if (state.indexOf('loggedIn.modules.changeForm') > -1) {
          return 'changeForm';
        } else if (state.indexOf('loggedIn.modules.user-manager.spouse-list') > -1) {
          return 'spouse-lis';
        }

        return false;
      },

      isDate: function (date) {
        if (!date) {
          return null;
        }

        date = new Date(date);

        return (_.isDate(date) && !_.isNaN(date.getTime()));
      },

      dateToShort: function (date) {
        if (!!date && _.isString(date)) {
          date = service.dateServerToLocalTime(date);
          return new Date(date).format('yyyy-mm-dd');
        } else if (service.isDate(date)) {
          return new Date(date).format('yyyy-mm-dd');
        }

        return date;
      },


      dateToISOString: function (date) {
        if (_.isDate(date)) {
          return date.toISOString();
        } else if (service.isDate(date)) {
          date = new Date(date);
          return date.toISOString();
        }

        return date;
      },

      dateToString: function (date) {

        if (!!date && _.isString(date)) {
          date = service.dateServerToLocalTime(date);
          return new Date(date).format('mmm dd, yyyy');
        } else if (service.isDate(date)) {
          return new Date(date).format('mmm dd, yyyy');
        }
        return date;
      },

      getDateStringToNumber: function (date) {
        var tmpDate = new Date(date);

        //E,g: 2016-12-05
        var year = tmpDate.getFullYear();
        var month = tmpDate.getMonth() + 1;
        var day = tmpDate.getDate();

        tmpDate = year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);

        return tmpDate;
      },

      /***
       * Convert from 1990-12-12T00:00:00 To localtime for datepicker
       * @param string date
       * @returns {*}
       */
      dateServerToLocalTime: function (date) {
        if (!!date && _.isString(date) && service.isDate(date)) {
          var tmp = new Date(date.split('T')[0]);
          return new Date(tmp.getTime() + tmp.getTimezoneOffset() * 60 * 1000);
        }

        return date;
      },

      /***
       * Convert from 1990-12-12T17:00:00 To localtime for datepicker
       * @param string date
       * @returns {*}
       */
      dateServerToLocal: function (date) {
        if (!!date && _.isString(date) && service.isDate(date)) {
          var tmp = new Date(date);
          return new Date(tmp.getTime() + tmp.getTimezoneOffset() * 60 * 1000);
        }

        return date;
      },

      parseDateOfBirthToDatePacker: function (date) {
        return service.dateServerToLocalTime(date);
      },


      parseDateOfBirthBeforePush: function (date) {
        var tmp = service.dateToShort(date);
        if (_.isEmpty(tmp)) {
          return undefined;
        }
        return tmp;
      },

      // The first day of the year
      getFirstDayOfYear: function (year) {
        if (!year) {
          year = new Date().getFullYear();
        }
        return new Date(year, 0, 1);
      },

      // The last day of the year
      getLastDayOfYear: function (year) {
        if (!year) {
          year = new Date().getFullYear();
        }
        return new Date(year, 11, 31);
      },

      getFirstDayOfRegister: function (year) {
        if (!year) {
          year = new Date().getFullYear();
        }
        return new Date(year, 0, 1);
      },

      getLastDayOfRegister: function (year) {
        if (!year) {
          year = new Date().getFullYear();
        }
        return new Date(year, 0, 15);
      },

      getDateStart: function (date) {
        date = new Date(new Date(date).format('yyyy-mm-dd 00:00:00'));
        return date.toISOString();
      },

      getDateEnd: function (date) {
        date = new Date(new Date(date).format('yyyy-mm-dd 23:59:59'));
        return date.toISOString();
      },

      checkDay: function (d) {

        var now = new Date();
        var day = new Date(d);

        if (now.getYear() === day.getYear() && now.getMonth() === day.getMonth() &&
          now.getDate() === day.getDate()) {
          return true;
        }

        return false;
      },

      // check if date is in current week
      checkWeek: function (d) {

        // Get the first day of the week from current date
        var now = new Date();
        var day = now.getDay(),
          diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

        var monday = new Date(now.setDate(diff));

        var dateIn = new Date(d);


        // Difference between today and start of this week
        var diffMs = new Date(dateIn.getYear(), dateIn.getMonth(), dateIn.getDate()) - new Date(monday.getYear(), monday.getMonth(), monday.getDate());

        // Convert difference to days (1 day = 86400000 ms)
        // Round up (e.g. 7.5 = 8 days)
        var diffDays = Math.ceil(diffMs / 86400000);

        if (diffDays >= 0 && diffDays < 7) {
          return true;
        }

        return false;
      },

      // check if date is in current month
      checkMonth: function (d) {
        var dateNow = new Date();
        var dateIn = new Date(d);

        if (dateIn.getYear() === dateNow.getYear() && dateIn.getMonth() === dateNow.getMonth()) {
          return true;
        }

        return false;
      },

      // Check if date is in current year
      checkYear: function (d) {
        var dateNow = new Date();
        var dateIn = new Date(d);

        if (dateIn.getYear() === dateNow.getYear()) {
          return true;
        }

        return false;
      },

      // sorted by property
      sort: function (arrayList, property) {
        if (!angular.isArray(arrayList)) {
          return [];
        }
        else {
          var newArray = $filter('orderBy')(arrayList, property);
          return newArray.filter(function (n) {
            return n !== undefined;
          });
        }
      },

      sortAdvance: function (arrayList, field, reverse) {
        var filtered = [];
        angular.forEach(arrayList, function (item) {
          filtered.push(item);
        });
        filtered.sort(function (a, b) {
          return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) {
          filtered.reverse();
        }
        return filtered;
      },

      // Formatting a Javascript Date for MySQL
      formatDate: function (date) {
        return date.getFullYear() + '-' + service.Lz(date.getMonth() + 1) + '-' + service.Lz(date.getDate());
      },

      // check modified datetime
      modified: function (time) {
        if (!time) {
          return '';
        }
        var start = new Date(time);
        var now = new Date();
        var string = '';

        if (start.getYear() < now.getYear()) {
          var year = now.getYear() - start.getYear();
          string = year + ' year' + (year > 1 ? 's' : '');
        }
        else if (start.getMonth() < now.getMonth()) {
          var month = now.getMonth() - start.getMonth();
          string = month + ' month' + (month > 1 ? 's' : '');
        }
        else if (start.getDate() < now.getDate()) {
          var date = now.getDate() - start.getDate();
          string = date + ' day' + (date > 1 ? 's' : '');
        }
        else if (start.getHours() < now.getHours()) {
          var hour = now.getHours() - start.getHours();
          string = hour + ' hour' + (hour > 1 ? 's' : '');
        }
        else if (start.getMinutes() < now.getMinutes()) {
          var min = now.getMinutes() - start.getMinutes();
          string = min + ' minute' + (min > 1 ? 's' : '');
        }
        else {
          var sec = now.getSeconds() - now.getSeconds();
          string = sec + ' second' + (sec > 1 ? 's' : '');
        }

        return string + ' ago';
      },

      // local
      Lz: function (x) {

        return (x < 0 || x >= 10 ? "" : "0") + x;
      },

      getWeekNumber: function (d) {

        // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0, 0, 0);

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));

        // Get first day of year
        var yearStart = new Date(d.getFullYear(), 0, 1);

        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

        // Return array of year and week number
        return weekNo;
      },

      // get date from Year-Week-Day
      getDateFormYWD: function (y, w, d) {
        var DOb = new Date(+y, 0, 4);
        if (isNaN(DOb)) {
          return false;
        }
        //  var D = DOb.getDay() ; if (D==0) D=7
        var D = DOb.getDay() || 7; // ISO
        DOb.setDate(DOb.getDate() + 7 * (w - 1) + (d - D));

        return DOb;
      },

      // get date name
      getDateName: function (date) {
        var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', "Sunday"];

        return day[new Date(date).getDay()];
      },

      // get month name
      getMonthName: function (date) {
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return month[new Date(date).getMonth()];
      },

      // Get Full Name
      getFullName: function (userInfo, isTry, defaultName) {
        if (_.isObject(userInfo) && !_.isArray(userInfo)) {
          var nameArr = [];
          if (userInfo.firstName) {
            nameArr.push(userInfo.firstName);
          }
          if (userInfo.middleName) {
            nameArr.push(userInfo.middleName);
          }
          if (userInfo.lastName) {
            nameArr.push(userInfo.lastName);
          }
          if (nameArr.length > 0) {
            return nameArr.join(' ');
          }

          if (isTry) {
            if (userInfo.username) {
              return userInfo.username;
            }
            if (userInfo.email) {
              return userInfo.email;
            }
          }
        }

        if (defaultName) {
          return defaultName;
        }

        return 'No name';
      },

      // filter value of biomarker
      filtetValueBiomarker: function (value, biomarker) {
        /*if (value === null) {
         return "-";
         }*/

        if (value === "" || value === null || value === -1 || value === 0) {
          return "N/A";
        }

        //for smokerResponse
        if (biomarker && biomarker.value === 'smokerResponse') {
          if (value === true) {
            return "Yes";
          }
          else if (value === false) {
            return "No";
          }

        } else {
          return value;
        }

      },

      getNameBrowser: function () {

        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
          return "browser-opera";
        }
        else if (navigator.userAgent.indexOf("Chrome") != -1) {
          return "browser-chrome";
        }
        else if (navigator.userAgent.indexOf("Safari") != -1) {
          return "browser-safari";
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
          return "browser-firefox";
        }
        else if (navigator.userAgent.indexOf("MSIE") != -1) //IF IE > 10
        {
          return "browser-ie";
        }
        else {
          return "";
        }

      },

      // filter value of biomarker Metabolic
      filtetValueBiomarkerMetabolic: function (value, biomarker, iMetabolicSyndrome) {


        //for smokerResponse
        if (biomarker.value === 'bloodpressure') {
          if (item.diastolic === null || item.systolic === null) {
            return "-";
          } else {
            return iMetabolicSyndrome.systolic + '/' + iMetabolicSyndrome.diastolic;
          }

        } else {
          if (value === null) {
            return "-";
          } else if (value === -1 || value === 0) {
            return "N/A";
          } else {
            return value;
          }


        }

      },

      // filter source
      filterSource: function (query, source) {
        var deferred = $q.defer();

        var items = _.chain(source)
          .filter(function (x) {
            return x.toLowerCase().indexOf(query.toLowerCase()) > -1;
          })
          .take(10)
          .value();

        deferred.resolve(items);

        return deferred.promise;
      },

      // Check array
      arrayPopulated: function (input) {
        if (input && input.length > 0) {
          return true;
        }
        return false;
      },

      // Helper function for checking if a variable is an integer
      isInteger: function (possibleInteger) {
        return Object.prototype.toString.call(possibleInteger) !== "[object Array]" && /^[\d]+$/.test(possibleInteger);
      },

      // get Id
      getId: function (object) {
        if (object != null && typeof object === 'object') {
          return parseInt(object.id);
        }
        else if (service.isInteger(object)) {
          return parseInt(object);
        }
        return 0;
      },

      // populate by id
      populateById: function (object, array) {
        for (var item in array) {
          if (this.getId(array[item]) === this.getId(object)) {
            return array[item];
          }
        }
        return undefined;
      },

      // clone object
      clone: function (object) {
        var temp = {};

        childNode(temp, object);

        function childNode(obj, object) {
          for (var key in object) {
            if (typeof (object[key]) === 'object') {
              if (object[key] === null) {
                obj[key] = null;
              }
              else {
                if (object[key].length !== undefined) {
                  obj[key] = [];
                }
                else {
                  obj[key] = {};
                }
                childNode(obj[key], object[key]);
              }
            } else {
              obj[key] = object[key];
            }
          }
        }

        return temp;
      },

      // Remove items deleted from arrayList
      removeItemsDeleted: function (arrayList) {
        for (var i = 0; i < arrayList.length; i++) {
          if (arrayList[i].deleted) {
            arrayList.splice(i, 1);
            --i;
          }
        }
        return arrayList;
      },

      // file types and check type of file
      fileTypes: ['JPG', 'JPEG', 'PNG', 'GIF', 'TIF', 'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX'],
      checkFileType: function (file) {
        var doc = ['pdf', 'doc', 'docs', 'xls', 'xlsx'],
          image = ['jpg', 'jpeg', 'png', 'gif', 'tif'];

        for (var i = 0; i < image.length; i++) {
          if (file.name.toLowerCase().indexOf(image[i].toLowerCase()) !== -1) {
            return 'picture';
          }
        }
        return 'doc';
      },

      // base64 encode
      base64Encode: function (binary) {
        //return btoa(unescape(encodeURIComponent(binary)));
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = binary.length, c1, c2, c3;
        while (i < len) {
          c1 = binary.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = binary.charCodeAt(i++);
          if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
          }
          c3 = binary.charCodeAt(i++);
          out += CHARS.charAt(c1 >> 2);
          out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
          out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
      },

      // check state parent
      checkStateCurrent: function (state, label) {
        if (state.indexOf(label) !== -1) {
          return true;
        }
        return false;
      },

      // format number
      formatNumber: function (number) {
        if (number === null || !number) {
          return '00';
        }

        number = parseFloat(number);
        if (number < 10) {
          return '0' + number;
        }
        return number;
      },

      // get years list
      getYears: function () {
        // start: 2003 and end 3 years from current years
        var start = 2003;
        var end = new Date().getFullYear() + 3;

        var array = [];
        for (var i = start; i <= end; i++) {
          array.push({ year: i.toString() });
        }

        return array;
      },

      //is Undefined or Null
      isNullOrUndefined: function (input) {
        if (angular.isUndefined(input) || input === null) {
          return true;
        }
        return false;
      },

      // Convert time format from minute integer
      convertTime: function (timeInteger) {
        var h = Math.floor(timeInteger / 60),
          m = timeInteger % 60,
          a = 'AM';
        if (h > 12) {
          h -= 12;
          a = 'PM';
        }
        // Check 0h
        if (h === 0) {
          h = 12;
          a = 'AM';
        }
        if (m.toString().length === 1) {
          m = '0' + m.toString();
        }

        return h.toString() + ':' + m.toString() + ' ' + a.toString();
      },

      // Revert minuter integer from hh:ii:aa
      revertTime: function (timeString) {
        var timeArr = timeString.split(/[.: ]/);
        var h = parseInt(timeArr[0]);
        var m = parseInt(timeArr[1]);
        var a = timeArr[2];

        if (a === 'PM') {
          h += 12;
        }

        // Check 0h
        if (h === 12 && a === 'AM') {
          h = 0;
        }

        return h * 60 + m;
      },

      // encode for string, object, array
      encodeURIComponent: function (object) {
        if (typeof object === "string") {
          return encodeURIComponent(object);
        } else if (typeof object === "object") {
          if (angular.isArray(object)) {
            var arrs = [];
            for (var i = 0; i < object.length; i++) {
              arrs.push(service.encodeURIComponent(object[i]));
            }
            return arrs;
          } else {
            for (var key in object) {
              object[key] = service.encodeURIComponent(object[key]);
            }
            return object;
          }
        } else {
          return object;
        }
      },

      dataURItoBlob: function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(dataURI.split(',')[1]);
        } else {
          byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
      },

      resizeImage: function (file, width, height) {
        var deferred = $q.defer();

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var fileType = file.type;

          var reader = new FileReader();
          reader.onloadend = function () {
            var tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function () {
              var MAX_WIDTH = width;
              var MAX_HEIGHT = height;
              var tempW = tempImg.width;
              var tempH = tempImg.height;
              if (tempW > tempH) {
                if (tempW > MAX_WIDTH) {
                  tempH *= MAX_WIDTH / tempW;
                  tempW = MAX_WIDTH;
                }
              } else {
                if (tempH > MAX_HEIGHT) {
                  tempW *= MAX_HEIGHT / tempH;
                  tempH = MAX_HEIGHT;
                }
              }

              var canvas = document.createElement('canvas');
              canvas.width = tempW;
              canvas.height = tempH;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0, tempW, tempH);
              var dataURL = canvas.toDataURL(fileType);
              var file = service.dataURItoBlob(dataURL);
              deferred.resolve(file);
            };
          };
          reader.readAsDataURL(file);
        } else {
          deferred.resolve(file);
        }

        return deferred.promise;
      },

      // Check valid email address
      validEmail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },

      validateDate: function (mm, dd, yy) {
        mm = parseInt(mm);
        dd = parseInt(dd);
        yy = parseInt(yy);

        // Create list of days of a month [assume there is no leap year by default]
        var listOfDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (mm === 1 || mm > 2) {
          if (dd > listOfDays[mm - 1]) {
            return false;
          }
        }
        if (mm === 2) {
          var year = false;
          var a = yy % 4;
          var b = yy % 100;
          var c = yy % 400;
          if ((!a && b) || !c) {
            year = true;
          }
          if ((year === false) && (dd >= 29)) {
            return false;
          }
          if ((year === true) && (dd > 29)) {
            return false;
          }
        }
        return true;
      },

      // Convert value to string
      compareValue: function (project) {
        var tmp = _.clone(project);

        function stringifyProperty(property) {
          if (_.isObject(property) && property instanceof Date === false) {
            return service.compareValue(property);
          } else if (_.isNull(property) || _.isBoolean(property)) {
            return property;
          } else if (_.isNumber(property) || _.isString(property)) {
            return property.toString();
          }

          return property;
        }

        for (var prop in tmp) {
          tmp[prop] = stringifyProperty(tmp[prop]);
        }

        return tmp;
      },

      // Has Changed
      hasChanged: function (newVal, originVal) {
        return !angular.equals(service.compareValue(newVal), service.compareValue(originVal));
      },

      //function remove same data in array
      removeSameDataInArray: function (data) {
        var result = [];
        angular.forEach(data, function (itemCheck, key) {
          if (key === 0) {
            result.push(itemCheck);
          } else {
            var count = 0;
            angular.forEach(result, function (item) {
              if (itemCheck.id === item.id) {
                count++;
              }
            });
            if (count === 0) {
              result.push(itemCheck);
            }
          }
        });

        return result;
      },

      // File save
      saveAs: function (fileContent, filename, contentType) {
        var blob = new Blob([fileContent], { type: contentType });
        saveAs(blob, filename);
      },

      saveAs2: function (fileContent, filename, contentType) {
        var blob, url, success = false;
        try {
          // Try using msSaveBlob if supported
          blob = new Blob([fileContent], { type: contentType });
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
          } else {
            // Try using other saveBlob implementations, if available
            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
            if (saveBlob === undefined) {
              throw "Not supported";
            }
            saveBlob(blob, filename);
          }
          success = true;
        } catch (ex) {
        }

        if (!success) {
          // Get the blob url creator
          var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
          if (urlCreator) {
            // Try to use a download link
            var link = window.document.createElement('a');
            if ('download' in link) {
              // Try to simulate a click
              try {
                // Prepare a blob URL
                blob = new Blob([fileContent], { type: contentType });
                url = urlCreator.createObjectURL(blob);
                link.setAttribute('href', url);

                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                link.setAttribute("download", filename);

                // Simulate clicking the download link
                var event = window.document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
                success = true;

              } catch (ex) {
              }
            }

            if (!success) {
              // Fallback to window.location method
              try {
                // Prepare a blob URL
                // Use application/octet-stream when using window.location to force download
                blob = new Blob([fileContent], { type: contentType });
                url = urlCreator.createObjectURL(blob);
                window.location = url;
                success = true;
              } catch (ex) {
              }
            }
          }
        }

        if (!success) {
          // Fallback to window.open method
        }
      },

      // format object PATCH user security
      formatDataUserSecurity: function (dataOld, dataNew) {

        var dataUserSecurity = {
          userId: dataOld.userId
        };

        if (dataNew.username && dataNew.username !== dataOld.username) {
          dataUserSecurity.newUsername = dataNew.username;
        }

        if (dataNew.email && dataNew.email !== dataOld.email) {
          dataUserSecurity.newEmail = dataNew.email ? dataNew.email : null;
        }

        if (dataNew.phoneNumber && dataNew.phoneNumber !== dataOld.phoneNumber) {
          dataUserSecurity.newPhone = dataNew.phoneNumber;
        }

        if (!!dataNew.password) {
          dataUserSecurity.newPassword = dataNew.password;
        }
        return dataUserSecurity;
      },

      // format object PATCH user change roles
      formatDataUserChangeRoles: function (dataOld, dataNew) {

        var dataUser = {
          userId: dataOld.userId
        };

        if (dataNew.roles && dataNew.roles !== dataOld.roles[0]) {
          dataUser.roles = [dataNew.roles];
        }

        return dataUser;
      },

      // format object PATCH me security
      formatDataMeSecurity: function (dataOld, dataNew) {

        var dataUserSecurity = {};

        if (dataNew.username && dataNew.username !== dataOld.username) {
          dataUserSecurity.newUsername = dataNew.username;
        }

        if (dataNew.email !== dataOld.email) {
          dataUserSecurity.newEmail = dataNew.email;
        }

        if (dataNew.phoneNumber !== dataOld.phoneNumber) {
          dataUserSecurity.newPhone = dataNew.phoneNumber;
        }

        return dataUserSecurity;
      },

      // Reset Form
      resetForm: function (scopeForm) {

        if (scopeForm) {

          // Reset all errors
          if (scopeForm.$error) {
            for (var att in scopeForm.$error) {
              if (scopeForm.$error.hasOwnProperty(att)) {
                scopeForm.$setValidity(att, true);
              }
            }
          }


          // Reset validation's state
          scopeForm.$setPristine(true);

        }

      },

      /*
       * Function select item [checkbox]
       * Return Array
       * */

      selectedItem: function (data, id) {
        var idx = data.indexOf(id);

        if (idx > -1) { // is currently selected
          data.splice(idx, 1);
        }
        else { // is newly selected
          data.push(id);
        }
        return data;
      },


      /*
       * Function get before XXXX date
       * Return string
       * */

      getBeforeDate: function (date, someDays) {
        var output = "";
        var newDate = "";
        var tempDate = "";
        var month = "";
        var day = "";
        if (date) {
          newDate = date.valueOf() - someDays * 24 * 60 * 60 * 1000;
          tempDate = new Date(newDate);
          month = tempDate.getMonth() + 1;
          day = tempDate.getDate();
          output = tempDate.getFullYear() + '-' +
            (('' + month).length < 2 ? '0' : '') + month + '-' +
            (('' + day).length < 2 ? '0' : '') + day;
        } else {

          date = new Date();

          newDate = date.valueOf() - someDays * 24 * 60 * 60 * 1000;
          tempDate = new Date(newDate);
          month = tempDate.getMonth() + 1;
          day = tempDate.getDate();
          output = tempDate.getFullYear() + '-' +
            (('' + month).length < 2 ? '0' : '') + month + '-' +
            (('' + day).length < 2 ? '0' : '') + day;
        }
        return output;
      },
      /*
       * Function format string date
       * Input ex: yyyy-mm-ddT00:00:00
       * Return ex: yyyy-mm-dd
       * */
      formatDateString: function (dataString) {
        var tempString = dataString.split("T")[0];
        var tempDate = tempString.split("-");

        return tempDate[0] + '-' + tempDate[1] + '-' + tempDate[2];
      },

      /*
       * Function get current date
       * Return ex: yyyy-mm-dd
       * */
      getCurrentDateString: function (format) {

        var today = new Date();

        if (format && format === 'yyyymmdd') {
          return today.getFullYear() + '' + ('0' + (today.getMonth() + 1)).slice(-2) + '' + ('0' + today.getDate()).slice(-2);
        } else {
          return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        }

      },


      /*
       * Function calculate age
       * Input : yyyy-mm-dd
       * Return array age
       * */
      calculateAge: function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      },


      /*
       * Function get name relationship
       * Input : number
       * Return name of relationship
       * */
      getNameRelationshipFromID: function (id) {

        if (id === 1) {
          return "Self";
        }
        if (id === 2) {
          return "Spouse";
        }
        if (id === 3) {
          return "Child";
        }
        if (id === 4) {
          return "Other";
        }
        return "";
      },


      /*
       * Function Phone number format
       * Input : 1234567890
       * Return (123) 456-7890
       * */
      phoneNumberFormat: function (phoneNumber) {
        if (phoneNumber) {
          var pn = phoneNumber.split("");
          pn = _.difference(pn, ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", " ", "-", "_", "+", "=", "{", "}", "[", "]", ":", "'", "\""]);
          if (pn.length !== 10) {
            return "";
          } else {
            return "(" + pn[0] + "" + pn[1] + "" + pn[2] + ") " + pn[3] + "" + pn[4] + "" + pn[5] + "-" + pn[6] + "" + pn[7] + "" + pn[8] + "" + pn[9];
          }
        } else {
          return "";
        }
      },

      /*
       * Function get last 4 digits of SSN
       * Input : SSN
       * Return XXXX
       * */
      getLast4DigitsOfSSN: function (ssn) {
        if (ssn) {
          var pn = ssn.split("");
          pn = _.difference(pn, ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", " ", "-", "_", "+", "=", "{", "}", "[", "]", ":", "'", "\""]);
          if (pn.length !== 9) {
            return "";
          } else {
            return pn[5] + "" + pn[6] + "" + pn[7] + "" + pn[8];
          }
        } else {
          return "";
        }
      },


      /*
       * Function SSN format
       * Input : XXX-XX-XXXX
       * Return XXXXXXXXX
       * */
      ssnFormatSubmit: function (data) {
        if (data) {
          var pn = data.split("");
          pn = _.difference(pn, ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", " ", "-", "_", "+", "=", "{", "}", "[", "]", ":", "'", "\""]);
          if (pn.length !== 9) {
            return "";
          } else {
            return "" + pn[0] + pn[1] + pn[2] + pn[3] + pn[4] + pn[5] + pn[6] + pn[7] + pn[8];
          }
        } else {
          return "";
        }
      },

      /*
       * Function SSN format View
       * Input : XXXXXXXXX
       * Return XXX-XX-XXXX
       * */
      ssnFormatView: function (data) {
        if (data) {
          var pn = data.split("");
          pn = _.difference(pn, ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", " ", "-", "_", "+", "=", "{", "}", "[", "]", ":", "'", "\""]);
          if (pn.length !== 9) {
            return "";
          } else {
            return "" + pn[0] + pn[1] + pn[2] + "-" + pn[3] + pn[4] + "-" + pn[5] + pn[6] + pn[7] + pn[8];
          }
        } else {
          return "";
        }
      },

      /*
       * Function remove the same item
       * Return array data
       * */

      removeSameItem: function (objectsArray) {

        var usedObjects = {};

        for (var i = objectsArray.length - 1; i >= 0; i--) {
          var so = JSON.stringify(objectsArray[i]);

          if (usedObjects[so]) {
            objectsArray.splice(i, 1);

          } else {
            usedObjects[so] = true;
          }
        }

        return objectsArray;

      },

      /*
       * Function compare two item
       * Return true/false
       * */

      compareItems: function (value1, operator, value2) {
        var result = false;
        value1 = parseFloat(value1);
        value2 = parseFloat(value2);

        if (operator == '<') {
          result = value1 < value2;
        }

        if (operator == '<=') {
          result = value1 <= value2;
        }

        if (operator == '=') {
          result = value1 === value2;
        }

        if (operator == '>') {
          result = value1 > value2;
        }

        if (operator == '>=') {
          result = value1 >= value2;
        }

        return result;
      },

      /*
       * Function find object by element
       * Input: list Objects, name element, value
       * Return Object
       * */

      findObjectByElement: function (data, nameElement, value) {
        var result = null;

        angular.forEach(data, function (item) {
          if (item[nameElement] === value) {
            result = item;
          }
        });
        return result;
      },

      /*
       * Function update data object thought element
       * Input: list Objects, name element, value, nameData, newValueData
       * Return New data
       * */

      updateObjectByElement: function (data, nameElement, value, nameData, newData) {
        var result = [];

        angular.forEach(data, function (item) {
          if (item[nameElement] === value) {
            item[nameData] = newData;
          }
          result.push(item);
        });
        return result;
      },


      /*
       * Function convert BMI
       * Input: healthResult
       * */

      convertBMIGeneral: function (item) {

        // convert
        item['heightShow'] = item.height ? convertInchesToFeetAndInches(item.height) : 'N/A';
        item['weightShow'] = item.weight ? item.weight + ' lbs' : 'N/A';
        item['waistShow'] = item.waist ? convertToInches(item.waist) : 'N/A';
        item['hipShow'] = item.hip ? convertToInches(item.hip) : 'N/A';
        item['bodyFatShow'] = item.bodyFat ? item.bodyFat + '%' : 'N/A';

        return item;
      },

      /*
       * Function format error from API
       * Input: errors
       * */

      formatErrors: function (errors) {

        var result = "";
        angular.forEach(errors, function (value, key) {
          result += value.errorMessage + '. ';
        });

        return result;
      },


      /*
       * Function get value selected of QUESTIONS
       * Input: QUESTIONS
       * */

      getValueSelectedQuestions: function (question, list) {

        var result = 0;
        angular.forEach(list, function (value, key) {
          if (value.question === question) {
            result = value.value;
          }
        });

        return result;
      },


      /*
       * Function convert JSON to array
       * Input: healthResultReport
       * */

      convertHealthResultReport: function (data) {

        var result = [];

        angular.forEach(data, function (item, keyItem) { //list array

          var tempResult = {
            'createdDate': "",
            'healthResults': []
          };

          angular.forEach(item, function (value, key) { //get create date
            if (key === 'createdDate') {
              tempResult.createdDate = value;
            }

            if (key === 'data') {
              tempResult.healthResults = JSON.parse(value);
              /*angular.forEach(JSON.parse(value), function (valueHealthResult, keyHealthResult) { //parse health result

               tempResult.healthResults.push({
               keyHealthResult: valueHealthResult
               });

               });*/
            }
          });

          result.push(tempResult);

        });

        return result;
      },

      formatSizeUnits: function (bytes) {
        if (bytes >= 1073741824) {
          bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        } else if (bytes >= 1048576) {
          bytes = (bytes / 1048576).toFixed(2) + ' MB';
        } else if (bytes >= 1024) {
          bytes = (bytes / 1024).toFixed(2) + ' KB';
        } else if (bytes > 1) {
          bytes = bytes + ' B'; //bytes
        } else if (bytes == 1) {
          bytes = bytes + ' B'; //byte
        } else {
          bytes = '0 B';
        }
        return bytes;
      },

      /***
       * Merge multiple object
       * collect(object1, object2))
       * @returns {}
       */
      collect: function () {
        var results = {};
        var length = arguments.length;
        for (var i = 0; i < length; i++) {
          for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
              results[p] = arguments[i][p];
            }
          }
        }

        return results;
      },

      // Convert 12-hour hh:mm AM/PM to 24-hour hh:mm
      convertTo24Hour: function (time) {
        time = time.toLowerCase();
        var timeArr = time.split(':');
        if (timeArr.length >= 2) {
          var hours = parseInt(timeArr[0]);
          if (time.indexOf('am') != -1 && hours == 12) {
            time = '00:' + timeArr[1];
          }
          if (time.indexOf('pm') != -1 && hours < 12) {
            time = hours + 12 + ':' + timeArr[1];
          }
          time = time.replace(/ +/g, '');
          return time.replace(/(am|pm)/, ':00');
        }
        return '12:00:00';
      },

      // Converting 24 hour time to 12 hour time
      convert12Hour: function (time) {
        var timeArr = time.split(':');
        var hh = parseInt(timeArr[0]);
        var m = parseInt(timeArr[1]);

        var dd = 'AM';
        var h = hh;
        if (h >= 12) {
          h = hh - 12;
          dd = 'PM';
        }
        if (h === 0) {
          h = 12;
        }
        m = m < 10 ? '0' + m : m;

        return h + ':' + m + ' ' + dd;
      },

      firstDayOfMonth: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      },

      lastDayOfMonth: function (date) {
        return new Date((new Date(date.getFullYear(), date.getMonth() + 1, 1)) - 1);
      },

      mimeTypes: {
        'txt': 'text/plain',
        'htm': 'text/html',
        'html': 'text/html',
        'php': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'xml': 'application/xml',
        'swf': 'application/x-shockwave-flash',
        'flv': 'video/x-flv',

        // images
        'png': 'image/png',
        'jpe': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'ico': 'image/vnd.microsoft.icon',
        'tiff': 'image/tiff',
        'tif': 'image/tiff',
        'svg': 'image/svg+xml',
        'svgz': 'image/svg+xml',

        // archives
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'exe': 'application/x-msdownload',
        'msi': 'application/x-msdownload',
        'cab': 'application/vnd.ms-cab-compressed',

        // audio/video
        'mp3': 'audio/mpeg',
        'qt': 'video/quicktime',
        'mov': 'video/quicktime',

        // adobe
        'pdf': 'application/pdf',
        'psd': 'image/vnd.adobe.photoshop',
        'ai': 'application/postscript',
        'eps': 'application/postscript',
        'ps': 'application/postscript',

        // ms office
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'rtf': 'application/rtf',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',

        // open office
        'odt': 'application/vnd.oasis.opendocument.text',
        'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      },

      getExtension: function (contentType) {
        var mimeType = '';
        _.find(service.mimeTypes, function (val, key) {
          if (val === contentType) {
            mimeType = key;
            return true;
          } else {
            return false;
          }
        });

        return mimeType;
      },


      /**
       * Convert object to url parameters
       * @param object params
       * @returns string
       */
      convertToUrlParams: function (params) {
        if (_.isObject(params)) {
          var p = {};
          _.each(params, function (val, key) {
            if (!_.isNull(val) && !_.isUndefined(val) && !_.isEmpty(val)) {
              p[key] = val;
            }
          });
          return $.param(p);
        }

        return '';
      },

      /**
       * Convert Operators to string
       * @param  Operators
       * @returns string
       */
      convertOperatorsToString: function (params) {
        var result = "" + params;
        result = result.replace("<=", "&le;");
        result = result.replace(">=", "&ge;");

        return result;
      },

      // Get Reason For Request
      getReasonForRequests: function (reasonForRequest) {
        var reasonForRequests = [];

        if (reasonForRequest !== null) {
          if ((reasonForRequest & 1) === 1) {
            reasonForRequests.push('Nutrition coaching');
          }
          if ((reasonForRequest & 2) === 2) {
            reasonForRequests.push('Fitness coaching');
          }
          if ((reasonForRequest & 4) === 4) {
            reasonForRequests.push('Health results explanation');
          }
          if ((reasonForRequest & 8) === 8) {
            reasonForRequests.push('Health alert notification');
          }
        }

        return reasonForRequests;
      },

      // Get Method Of Contact
      getMethodOfContacts: function (methodOfContact) {
        var methodOfContacts = [];

        if (methodOfContact !== null) {
          if ((methodOfContact & 1) === 1) {
            methodOfContacts.push('Phone');
          }
          if ((methodOfContact & 2) === 2) {
            methodOfContacts.push('Email');
          }
          if ((methodOfContact & 4) === 4) {
            methodOfContacts.push('BeniComp PULSE portal');
          }
        }

        return methodOfContacts;
      },

      // Capitalize First Letter
      capitalizeFirstLetter: function (string) {
        if (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        } else {
          return null;
        }

      },

      // Sort incentive list
      sortIncentiveList: function (incentiveList) {
        var output = [];
        if (incentiveList.length > 0) {
          _.forEach(_.sortBy(incentiveList, function (incentive) {
            return incentive.startDate;
          }).reverse(), function (incentive) {
            if (_.isObject(incentive) && incentive.hasOwnProperty('startDate')) {
              output.push(incentive);
            }
          });
          output.push({});
        }

        return output;
      },

      // Check incentive or not
      isEmptyIncentive: function (incentive) {
        if (_.isEmpty(incentive) || !incentive.startDate || !incentive.hasOwnProperty('startDate')) {
          return true;
        }

        return false;
      },

      // get Type of Claim Item
      getTypeOfClaimItem: function (value) {
        value = parseInt(value);
        if (value === 1) {
          return "Dental";
        }

        if (value === 2) {
          return "Vision";
        }

        if (value === 3) {
          return "Pharmacy";
        }

        if (value === 4) {
          return "Medical";
        }

        return "";
      },

      // get name of type Direct Deposit
      getTypeOfDirectDeposit: function (value) {

        var directDepositConstants = DIRECTDEPOSIT;
        var result = "";
        angular.forEach(directDepositConstants.choiceType, function (item) {
          if (item.value === value) {
            result = item.label;
          }
        });

        return result;
      },

      // get name of type Direct Deposit
      getIDOfMaritalStatusFromName: function (name) {

        if (name === 'single') {
          return "S";
        }
        if (name === 'married') {
          return "M";
        }
        if (name === 'domesticPartnership') {
          return "P";
        }
        if (name === 'divorced') {
          return "D";
        }
        if (name === 'widowed') {
          return "W";
        }
        if (name === 'other') {
          return "O";
        }

        return "O";
      },

      // get name of type Direct Deposit
      getAccountTypeOfDirectDeposit: function (value) {

        var directDepositConstants = DIRECTDEPOSIT;
        var result = "";
        angular.forEach(directDepositConstants.accountType, function (item) {
          if (item.value === value) {
            result = item.label;
          }
        });

        return result;
      },


      // Function check biomarker danger
      biomarkerIsDanger: function (item, security) {
        item.value = parseFloat(item.value);
        item.start = (item.isHasMultiRanges && (security.currentUser.gender === 'M')) ? parseFloat(item.startForMale) : parseFloat(item.start);
        item.end = (item.isHasMultiRanges && (security.currentUser.gender === 'M')) ? parseFloat(item.endForMale) : parseFloat(item.end);
        item.sign = item.sign ? parseFloat(item.sign) : 0;
        item.allow = item.allow !== undefined ? item.allow : false;
        item.type = item.type ? item.type : '';
        if (item.sign !== 0) {
          if (!(
            (item.type === '<' && item.value < item.sign) ||
            (item.type === '<=' && item.value <= item.sign) ||
            (item.type === '>' && item.value > item.sign) ||
            (item.type === '>=' && item.value >= item.sign)
          )) {
            return true;
          }
        } else if (item.allow !== false && (item.allow === '<=' || item.allow === '<' || item.allow === '>=' || item.allow === '>')) {
          if (!(
            (item.allow === '<=' && item.value <= item.start) ||
            (item.allow === '<' && item.value < item.start) ||
            (item.allow === '>=' && item.value >= item.start) ||
            (item.allow === '>' && item.value > item.start)
          )) {
            return true;
          }
        } else {
          if (item.value < item.start || item.end < item.value) {
            return true;
          }
        }
        return false;
      },

      // Function check biomarker danger
      updateCurrentInfo: function (oldData, newData, path) {
        var result = oldData;
        if (path) {
          if (path === 'maritalStatus') {
            result['maritalStatus'] = newData['maritalStatus'];

          } else if (path === 'name') {
            result['firstName'] = newData['firstName'];
            result['middleName'] = newData['middleName'];
            result['lastName'] = newData['lastName'];

          } else if (path === 'contactInformation') {
            result['phoneNumber'] = newData['phoneNumber'];
            result['email'] = newData['email'];

            result['streetAddress'] = newData['streetAddress'];
            result['addressLine2'] = newData['addressLine2'];
            result['city'] = newData['city'];
            result['postalCode'] = newData['postalCode'];
            result['state'] = newData['state'];
            result['country'] = newData['country'];

          }


        } else {

          _.each(newData, function (val, key) {
            if (angular.isObject(val)) {
              result[key] = angular.copy(val);
            } else {
              result[key] = val;
            }
          });

        }


        return result;
      }
    };

    return service;
  });