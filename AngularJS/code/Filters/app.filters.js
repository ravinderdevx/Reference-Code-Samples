angular.module('app.filters', [])
  .filter('range', function () {
    return function (input, min, max) {
      min = parseInt(min); //Make string input int
      max = parseInt(max);
      for (var i = min; i < max; i++) {
        input.push(i);
      }
      return input;
    };
  })

  .filter('dateFormat', function (utils) {
    return function (input, format, def) {
      if (utils.isDate(input)) {
        return new Date(utils.dateServerToLocalTime(input)).format(format);
      }

      return def;
    };
  })


  .filter('formatNumberId', function (utils) {
    return function (participantInfo, numberId, type) {
      type = type.toLowerCase();
      var result = participantInfo.prefixPulseId + "-" + participantInfo.pulseId + "-";

      if (type === "participant") {
        result += "00";

      } else if (type === "child") {
        if (numberId < 9) {
          result += "1" + numberId;
        } else {
          result += 10 + numberId;
        }

      } else {
        if (numberId <= 9) {
          result += "0" + numberId;
        } else {
          result += "10";
        }

      }

      return result;
    };
  })

  .filter('birthdayFormat', function (utils) {
    return function (date) {
      return utils.dateToShort(utils.parseDateOfBirthToDatePacker(date));
    };
  })

  .filter('shortDate', function (utils) {
    return function (date) {
      if (date) {
        return utils.formatDateString(date);
      } else {
        return "";
      }

    };
  })

  .filter('viewSSN', function (utils) {
    return function (data) {
      if (data) {
        return utils.ssnFormatView(data);
      } else {
        return "";
      }

    };
  })

  .filter('phoneNumberFormat', function (utils) {
    return function (date) {
      if (date) {
        return utils.phoneNumberFormat(date);
      } else {
        return "";
      }

    };
  })

  .filter('getNameRelationship', function (utils) {
    return function (id) {
      return utils.getNameRelationshipFromID(id);
    };
  })

  .filter('contactFormat', function (utils) {
    return function (date) {
      if (date) {
        var tmp = utils.dateToShort(utils.parseDateOfBirthToDatePacker(date));
        var tmpDOB = tmp.split("-");
        return tmpDOB[1] + "/" + tmpDOB[2] + "/" + tmpDOB[0];
      } else {
        return 'NO VALUE';
      }

    };
  })

  .filter('fullName', function (utils) {
    return function (userInfo, isTry, defaultName) {
      return utils.getFullName(userInfo, isTry, defaultName);
    };
  })

  .filter('valueBiomarker', function (utils) {
    return function (value, biomarker) {
      return utils.filtetValueBiomarker(value, biomarker);
    };
  })

  .filter('convertOperatorToString', function (utils) {
    return function (value) {
      return utils.convertOperatorsToString(value);
    };
  })

  .filter('valueBiomarkerMetabolic', function (utils) {
    return function (value, biomarker, iMetabolicSyndrome) {
      return utils.filtetValueBiomarkerMetabolic(value, biomarker, iMetabolicSyndrome);
    };
  })

  .filter('trust', ['$sce', function ($sce) {
    return function (value, type) {
      //return $sce.trustAs(type || 'html', value);
      return $sce.trustAsHtml(value);
    };
  }])

  .filter('pulseIdFormat', function () {
    return function (userInfo, participantType, numberOfDependents) {
      var pulseId = userInfo.prefixPulseId + "-" + userInfo.pulseId;
      var suffix = '';

      if (participantType === 0) {
        suffix = '-00';
      } else {
        suffix = '-01';
      }

      if (numberOfDependents > 0) {
        if (numberOfDependents < 9) {
          suffix = '-0' + (numberOfDependents + 1);
        } else {
          suffix = '-' + (numberOfDependents + 1);
        }
      }

      return pulseId + suffix;
    };
  });