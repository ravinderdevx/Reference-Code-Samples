const format = require("string-template");

exports.parseTemplateFromObject = (template, object) => {
    return format(template, object);
}

exports.parseTemplateFromArray = (template, array) => {
    return format(template, array);
}