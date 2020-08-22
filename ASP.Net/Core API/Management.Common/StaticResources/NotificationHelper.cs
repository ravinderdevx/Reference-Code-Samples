using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Mail;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;

namespace DitsPortal.Common.StaticResources
{
    public static class NotificationHelper
    {
        public static string requestName = "DITS - HR Portal";
        public static bool SendPasswordResetEmail(ForgotPasswordRequest forgotPasswordRequest, string guid, SmtpRequest smtpRequest)
        {
            try
            {
                StringBuilder emailMessage = new StringBuilder();
                //var Url= "http://ditstekdemo.com/ditsportal/change-password";
                emailMessage.Append("<p>Hello,</p>");
                emailMessage.Append("<p style='margin-left:10%;margin-top:5%'>You have requested a password reset for the DITS website.</p>");
                emailMessage.Append(string.Format("<p style='margin-left:10%;'><a href='{0}?email={1}&token={2}'>Please click here to change your password</a></p>", forgotPasswordRequest.Url, forgotPasswordRequest.Email, guid));
                emailMessage.Append("<p style='margin-left:10%;margin-bottom:5%'>If you did not request a password reset, please just ignore this email.");
                emailMessage.Append("<p>Thank you for using Dits Portal</p>");

                SendEmail(forgotPasswordRequest.Email, emailMessage, "DITS - Password Reset Request", true, smtpRequest);

                return true;
            }
            catch (Exception ex)
            {
                // Trace.WriteLine(String.Format("Failure to send email to {0}.", emailAddress));
                return false;
            }
        }
        public static bool SendLeaveRequestEmail(LeaveResponse leaveResponse,SmtpRequest smtpRequest,string admin)
        {
            var startDate = leaveResponse.StartDate.Date.ToString("%d-%M-yyyy");
            var endDate = leaveResponse.EndDate.Date.ToString("%d-%M-yyyy");
            var firstAndLastName = (leaveResponse.FirstName).Trim() + " " + (leaveResponse.LastName).Trim();
            try
            {
                var subject = "Leave Request by " + firstAndLastName + " - " + startDate;
                //var subject = "Leave Request by " + leaveResponse.Email + " - " + startDate;
                StringBuilder emailMessage = new StringBuilder();
                emailMessage.Append("<p>Hello,</p>");
                emailMessage.Append("<p>" + leaveResponse.Email + " has requested leave. Details are given below.</p>");
                emailMessage.Append("<table border=1 style='width: 60%;margin-left: 10%;'>");
                emailMessage.Append("<tr><th style='width: 30%;text-align: left;font-family: Arial; font-size: 10pt;'><p style='margin-left: 5%;'>" + "Start Date" + "</p></th>");
                emailMessage.Append("<td style='text-align: left;'><p style='margin-left: 5%;'>" + startDate + "</p></td> </tr>");
                emailMessage.Append("<tr><th style='width: 30%;text-align: left;font-family: Arial; font-size: 10pt;'><p style='margin-left: 5%;'>" + "End Date" + "</p></th>");
                emailMessage.Append("<td style='text-align: left;'><p style='margin-left: 5%;'>" + endDate + "</p></td></tr>");
                emailMessage.Append("<tr><th style='width: 30%;text-align: left;font-family: Arial; font-size: 10pt;'><p style='margin-left: 5%;'>" + "Leave Type " + "</p></th>");
                emailMessage.Append("<td style='text-align: left;'><p style='margin-left: 5%;'>" + leaveResponse.LeaveType + "</p></td></tr>");
                emailMessage.Append("<tr><th style='width: 30%;text-align: left;font-family: Arial; font-size: 10pt;'><p style='margin-left: 5%;'>" + "Duration" + "</p></th>");
                emailMessage.Append("<td style='text-align: left;'><p style='margin-left: 5%;'>" + leaveResponse.Duration + "</p></td></tr>");
                emailMessage.Append("<tr><th style='width: 30%;text-align: left;font-family: Arial; font-size: 10pt;'><p style='margin-left: 5%;'>" + "Reason" + "</p></th>");
                emailMessage.Append("<td style='text-align: left;'><p style='margin-left: 5%; margin-right: 5%;'>" + leaveResponse.Reason + "</p></td></tr>");
                emailMessage.Append("</table>");
                emailMessage.Append("<p>Kindly consider for your kind approval. </p>");
                emailMessage.Append("<p>Thanks </p>");
                emailMessage.Append("<p>" +firstAndLastName + "</p>");
                SendEmail(admin, emailMessage, subject, true, smtpRequest);
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                // Trace.WriteLine(String.Format("Failure to send email to {0}.", emailAddress));
                return false;
            }
        }
        public static bool SendLeaveStatusEmail(string emailAddress, SmtpRequest smtpRequest,bool leaveStatus,string admin )
        {
            try
            {
               
                StringBuilder emailMessage = new StringBuilder();
                string status= leaveStatus ? "approved":"rejected"; 
                emailMessage.Append("<p>Hello,</p>");
                emailMessage.Append("<p>You leave has been  "+ status + " by admin");
                SendEmail(emailAddress, emailMessage, "DITS - Leave Status ", true, smtpRequest);
                SendLeaveStatus(emailAddress, smtpRequest, leaveStatus, admin);
                return true;
            }
            catch (Exception e)
            {
                // Trace.WriteLine(String.Format("Failure to send email to {0}.", emailAddress));
                return false;
            }
        }
        public static bool SendLeaveStatus(string emailAddress, SmtpRequest smtpRequest, bool leaveStatus, string admin)
        {
            try
            {
                StringBuilder emailMessage = new StringBuilder();
                string status = leaveStatus ? "approved" : "rejected";
                emailMessage.Append("<p>Hello,</p>");
                emailMessage.Append("<p>You have   " + status + " the leave requested  by "+emailAddress+"");
                SendEmail(admin, emailMessage, "DITS - Leave Status " + emailAddress + " ", true, smtpRequest);

                return true;
            }
            catch (Exception e)
            {
                // Trace.WriteLine(String.Format("Failure to send email to {0}.", emailAddress));
                return false;
            }
        }
        private static void SendEmail(string emailAddress, StringBuilder emailMessage, string subject, bool html, SmtpRequest smtpRequest)
        {
            try
            {
                MailMessage email = new MailMessage();
                email.From = new MailAddress(smtpRequest.UserName, requestName);
                email.To.Add(new MailAddress(emailAddress));
                //email.To.Add(new MailAddress("ashishsharmawins@gmail.com"));
                email.Subject = subject;
                email.Body = emailMessage.ToString();
                email.IsBodyHtml = html;
                SmtpClient smtpServer = new SmtpClient();
                smtpServer.Host = smtpRequest.Host;
                smtpServer.UseDefaultCredentials = false;
                smtpServer.Port = Convert.ToInt32(smtpRequest.Port);
                smtpServer.Credentials = new NetworkCredential(smtpRequest.UserName, smtpRequest.Password);
                smtpServer.EnableSsl = true;
                smtpServer.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                smtpServer.Send(email);
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
    }
}
