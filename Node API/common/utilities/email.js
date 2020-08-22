const CONFIG = require("../../config/config");
var mailjet = require("../../node_modules/node-mailjet/mailjet-client").connect(
  CONFIG.mj_apikey,
  CONFIG.mj_secretekey
);


exports.sendEmail = mailObject => {
  try {
    let emailData = {};

    emailData.FromName = CONFIG.mj_sendername;
    emailData.FromEmail = CONFIG.mj_senderemail;
    emailData.Subject = mailObject.subject;
    emailData.Recipients = mailObject.recipients;

    emailData["HTML-Part"] = mailObject.html_content;

    /* Add attachments */
    if (mailObject.attachments && mailObject.attachments.Content !== undefined) {
      emailData.Attachments = mailObject.attachments;
    }
    
    console.log('email ---->', emailData);
    /* Send Email */
    mailjet
      .post("send")
      .request(emailData)
      .catch(handleError);
  } catch (ex) {
    return next(ex.Message, false);
  }
};

function handleError(err) {
  throw new Error(err.ErrorMessage);
}