using FacePinPoint.Entities.Request;
using FacePinPoint.Service.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.ComponentModel.DataAnnotations;
using FacePinPoint.Filter;
using FacePinPoint.Entities.Common;
using System.IO;

using System.Security.Cryptography;
using RestSharp;
using System.Drawing.Imaging;
using FacePinPoint.Entities.Response;
using System.Net.Http.Headers;
using FacePinPoint.Repository;

namespace FacePinPoint.Controllers
{
    [RoutePrefix("AccountAPI")]
    public class AccountAPIController : ApiController
    {

        #region Private

        private IAccountService _IAccountService = null;
        private System.Net.Http.HttpResponseMessage httpResponseMessage = null;

        #endregion

        public AccountAPIController(IAccountService IAccountService)
        {
            _IAccountService = IAccountService;
        }

        #region Public Function

        [HttpPost]
        [Route("Login")]
        [ActionName("Login")]
        public async Task<HttpResponseMessage> Login(UserLogin userLogin)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && userLogin != null)
            {
                var loginResponse = await _IAccountService.Login(userLogin);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, loginResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("EmailExists")]
        [ActionName("EmailExists")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> EmailExists([FromBody]EmailRequest emailExist)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && emailExist != null)
            {
                var emailexistsResponse = await _IAccountService.EmailExists(emailExist.Email);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, emailexistsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("IsEmailExists")]
        [ActionName("IsEmailExists")]
        public async Task<bool> IsEmailExists(string email)
        {
            if (email != null)
            {
                var emailexistsResponse = await _IAccountService.EmailExists(email);
                if (emailexistsResponse.Success)
                {
                    return !emailexistsResponse.IsEmailExists;
                }
            }
            return false;
        }

        [HttpPost]
        [Route("SignUpUser")]
        [ActionName("SignUpUser")]
        public async Task<HttpResponseMessage> SignUpUser(SignUpDetailsRequest signUpDetails)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (signUpDetails != null && ModelState.IsValid)
            {
                var signUpUserResponse = await _IAccountService.SignUpUser(signUpDetails);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, signUpUserResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SaveAccountDetail")]
        [ActionName("SaveAccountDetail")]
        public HttpResponseMessage SaveAccountDetail(AccountDetail accountDetail)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (accountDetail != null && ModelState.IsValid)
            {
                var accountDetailResponse = _IAccountService.SaveAccountDetail(accountDetail);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, accountDetailResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("EnrollUserIDPhoto")]
        [ActionName("EnrollUserIDPhoto")]
        public HttpResponseMessage EnrollUserIDPhoto(PhotoDetailRequest photoDetail)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (photoDetail != null && ModelState.IsValid)
            {
                var photoDetailResponse = _IAccountService.EnrollUserIDPhoto(photoDetail);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, photoDetailResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SavePaymentDetail")]
        [ActionName("SavePaymentDetail")]
        public async Task<HttpResponseMessage> SavePaymentDetail(PaymentDetailRequest paymentDetailsRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentDetailsRequest != null && ModelState.IsValid)
            {
                var paymentDetailsResponse = await _IAccountService.SavePaymentDetail(paymentDetailsRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, paymentDetailsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetUserDetailByUserEmail")]
        [ActionName("GetUserDetailByUserEmail")]
        public async Task<HttpResponseMessage> GetUserDetailByUserEmail(EmailRequest emailRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (emailRequest != null && ModelState.IsValid)
            {
                var userCreateResponse = await _IAccountService.GetUserDetailByUserEmail(emailRequest.Email);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, emailRequest);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ForgetPasswordLink")]
        [ActionName("ForgetPasswordLink")]
        public async Task<HttpResponseMessage> ForgetPasswordLink(EmailRequest emailRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (emailRequest != null && ModelState.IsValid)
            {
                var forgetPasswordResponse = await _IAccountService.ForgetPasswordLink(emailRequest.Email);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, forgetPasswordResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("RestForgetPassword")]
        [ActionName("RestForgetPassword")]
        public async Task<HttpResponseMessage> RestForgetPassword([FromUri]string token, [FromBody]RestPassword RestPassword)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (!string.IsNullOrEmpty(token) && RestPassword != null && ModelState.IsValid)
            {
                var forgetPasswordResponse = await _IAccountService.RestForgetPassword(token, RestPassword);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, forgetPasswordResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }


        [HttpGet]
        [Route("ValidateForgetPasswordLink")]
        [ActionName("ValidateForgetPasswordLink")]
        public HttpResponseMessage ValidateForgetPasswordLink(string token)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (!string.IsNullOrEmpty(token))
            {
                var forgetPasswordResponse = _IAccountService.ValidateForgetPasswordLink(token);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, forgetPasswordResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }



        [HttpGet]
        [Route("GetLoggedInUserDetail")]
        [ActionName("GetLoggedInUserDetail")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLoggedInUserDetail()
        {
            httpResponseMessage = new HttpResponseMessage();
            var userCreateResponse = await _IAccountService.GetLoggedInUserDetail();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, userCreateResponse);

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ChangePassword")]
        [ActionName("ChangePassword")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (changePasswordRequest != null && ModelState.IsValid)
            {
                var changePasswordResponse = await _IAccountService.ChangePassword(changePasswordRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, changePasswordResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("SearchByResultByEmail")]
        [ActionName("SearchByResultByEmail")]
        [BasicAuthenticationAttribute]
        public HttpResponseMessage SearchByResultByEmail()
        {
            httpResponseMessage = new HttpResponseMessage();
            var searchByResultByEmailResponse = _IAccountService.SearchByResultByEmail();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, searchByResultByEmailResponse);

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetReconizeFaceByUserBiometericsId")]
        [ActionName("GetReconizeFaceByUserBiometericsId")]
        [BasicAuthenticationAttribute]
        public HttpResponseMessage GetReconizeFaceByUserBiometericsId()
        {
            httpResponseMessage = new HttpResponseMessage();
            var searchByResultByEmailResponse = _IAccountService.GetReconizeFaceByUserBiometericsId();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, searchByResultByEmailResponse);

            return httpResponseMessage;
        }


        [HttpGet]
        [Route("GetUserProfileDetail")]
        [ActionName("GetUserProfileDetail")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUserProfileDetail()
        {
            httpResponseMessage = new HttpResponseMessage();
            var userCreateResponse = await _IAccountService.GetUserProfileDetail();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, userCreateResponse);

            return httpResponseMessage;
        }


        //[HttpGet]
        //[Route("GetDMCALegalActionStatus")]
        //[ActionName("GetDMCALegalActionStatus")]
        ////[BasicAuthenticationAttribute]
        //public async Task<HttpResponseMessage> GetDMCALegalActionStatus()
        //{
        //    httpResponseMessage = new HttpResponseMessage();
        //    var getDMCALegalActionStatusResponse = await _IAccountService.GetDMCALegalActionStatus();
        //    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getDMCALegalActionStatusResponse);

        //    return httpResponseMessage;
        //}

        [HttpGet]
        [Route("GetHitRecords")]
        [ActionName("GetHitRecords")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetHitRecords()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getHitRecords = await _IAccountService.GetHitRecords();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getHitRecords);

            return httpResponseMessage;
        }


        [HttpGet]
        [Route("GetMultipleFaceBiometricsByHitRecordRecordId")]
        [ActionName("GetMultipleFaceBiometricsByHitRecordRecordId")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetMultipleFaceBiometricsByHitRecordRecordId(int hitRecordRecordId)
        {
            if (hitRecordRecordId > 0 && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getMultipleFaceBiometricsByHitRecordRecordIdResponse = await _IAccountService.GetMultipleFaceBiometricsByHitRecordRecordId(hitRecordRecordId);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getMultipleFaceBiometricsByHitRecordRecordIdResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpGet]
        [Route("GetUserInvoice")]
        [ActionName("GetUserInvoice")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUserInvoice(bool viewAll)
        {
            if (ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getUserInvoiceResponse = await _IAccountService.GetUserInvoice(viewAll);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);

            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetUserTicket")]
        [ActionName("GetUserTicket")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUserTicket(bool viewAll)
        {
            if (ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getUserInvoiceResponse = await _IAccountService.GetUserTicket(viewAll);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }



        [HttpPost]
        [Route("GetFaceLinks")]
        [ActionName("GetFaceLinks")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetFaceLinks(ImageNameRequest ImageNameRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ImageNameRequest != null && ModelState.IsValid)
            {
                var getUserInvoiceResponse = await _IAccountService.GetFaceLinks(ImageNameRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        
        [HttpPost]
        [Route("SaveDMCALinks")]
        [ActionName("SaveDMCALinks")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SaveDMCALinks(RemoveableImageLinksRequest removeableImageLinksRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (removeableImageLinksRequest != null && ModelState.IsValid)
            {
                var getUserInvoiceResponse = await _IAccountService.SaveDMCALinks(removeableImageLinksRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SavePaymentDetails")]
        [ActionName("SavePaymentDetails")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SavePaymentDetails(PaymentDetailsRequest paymentDetailsRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentDetailsRequest != null && ModelState.IsValid)
            {
                var paymentDetailsResponse = await _IAccountService.SavePaymentDetails(paymentDetailsRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, paymentDetailsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        

        [HttpPost]
        [Route("SaveTickets")]
        [ActionName("SaveTickets")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SaveTickets()
        {
            httpResponseMessage = new HttpResponseMessage();
            try
            {
                int TicketId = 0, DocumentId = 0;
                string UserEmail = "";

                if (System.Web.HttpContext.Current.Request.Form.AllKeys.Length > 0)
                {
                    TicketRequest ticketRequest = new TicketRequest();
                    // Show all the key-value pairs.
                    foreach (var key in System.Web.HttpContext.Current.Request.Form.AllKeys)
                    {
                        foreach (var val in System.Web.HttpContext.Current.Request.Form.GetValues(key))
                        {
                            switch (key)
                            {
                                case "Email":
                                    ticketRequest.Email = val;
                                    UserEmail = ticketRequest.Email;
                                    break;
                                case "Subject":
                                    ticketRequest.Subject = val;
                                    break;
                                case "Message":
                                    ticketRequest.Message = val;
                                    break;
                                case "Department":
                                    ticketRequest.Department = val;
                                    break;
                                case "Priority":
                                    ticketRequest.Priority = val;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    TicketId = await _IAccountService.SaveTickets(ticketRequest);
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
                    return httpResponseMessage;
                }

                var listOfStrings = new List<string>();
                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count > 0 && TicketId > 0)
                {
                    int iUploadedCnt = 0;
                    // CHECK THE FILE COUNT.
                    for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
                    {
                        System.DateTime myDate = DateTime.Now;
                        int year = myDate.Year;
                        int month = myDate.Month;
                        var PartialPath = "/Uploads/Documents/" + year + "/" + month + "/";
                        var FilePath = "~" + PartialPath;
                        bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(FilePath));
                        if (!exists)
                        {
                            System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(FilePath));
                        }
                        System.Web.HttpPostedFile hpf = hfc[iCnt];
                        if (hpf.ContentLength > 0)
                        {
                            string FileName = "Ticket_" + Guid.NewGuid().ToString() + Path.GetExtension(hpf.FileName);
                            // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)
                            if (!File.Exists(FilePath + FileName))
                            {
                                var FilePathWithFilename = Path.Combine(HttpContext.Current.Server.MapPath(FilePath), FileName);

                                // SAVE THE FILES IN THE FOLDER.
                                hpf.SaveAs(FilePathWithFilename);
                                listOfStrings.Add(FilePathWithFilename);
                                iUploadedCnt = iUploadedCnt + 1;
                                Document document = new FacePinPoint.Repository.Document();
                                document.DocumentName = FileName;
                                document.DocumentPath = PartialPath + "/" + FileName;
                                DocumentId = await _IAccountService.SaveDocument(document);

                                if (DocumentId > 0 && TicketId > 0)
                                {
                                    TicketAttachment ticketAttachment = new TicketAttachment();
                                    ticketAttachment.DocumentId = DocumentId;
                                    ticketAttachment.TicketId = TicketId;
                                    await _IAccountService.SaveTicketAttachment(ticketAttachment);
                                }
                            }
                        }
                    }
                }
                string[] fileAttachment = listOfStrings.ToArray();
                TicketMailRequest ticketMailRequest = new TicketMailRequest();
                ticketMailRequest.fileAttachments = fileAttachment;
                ticketMailRequest.ticketId = TicketId;
                ticketMailRequest.UserEmail = UserEmail;
                bool isMailSend = await _IAccountService.SendTicketMail(ticketMailRequest);

                if (isMailSend)
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.TICKET_SAVED_SUCCESSFULLY, Success = true });
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = "Mail not sent", Success = false });
                }
                
            }
            catch (System.Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INTERNAL_ERROR, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetDMCARemovalLinks")]
        [ActionName("GetDMCARemovalLinks")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetDMCARemovalLinks()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getUserInvoiceResponse = await _IAccountService.GetDMCARemovalLinks();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            return httpResponseMessage;
        }


        [HttpGet]
        [Route("GetLegalActionRemovalLinks")]
        [ActionName("GetLegalActionRemovalLinks")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLegalActionRemovalLinks()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getUserInvoiceResponse = await _IAccountService.GetLegalActionRemovalLinks();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("DMCANoticeEmailRequest")]
        [ActionName("DMCANoticeEmailRequest")]
        //[BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DMCANoticeEmailRequest(DMCANoticeEmailRequest DMCANoticeEmailRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (DMCANoticeEmailRequest != null && ModelState.IsValid)
            {
                var DMCANoticeEmailRequestResponse = await _IAccountService.EmailDMCANotice(DMCANoticeEmailRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, DMCANoticeEmailRequestResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("EmailLawyerLetter")]
        [ActionName("EmailLawyerLetter")]
        //[BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> EmailLawyerLetter(LawyerLetterEmailRequest lawyerLetterEmailRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (lawyerLetterEmailRequest != null && ModelState.IsValid)
            {
                var DMCANoticeEmailRequestResponse = await _IAccountService.EmailLawyerLetter(lawyerLetterEmailRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, DMCANoticeEmailRequestResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("UpdatePackage")]
        [ActionName("UpdatePackage")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> UpdatePackage(UpdatePackageRequest updatePackageRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (updatePackageRequest != null && ModelState.IsValid)
            {
                var getUserInvoiceResponse = await _IAccountService.UpdatePackage(updatePackageRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SaveEnquiry")]
        [ActionName("SaveEnquiry")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SaveEnquiry(EnquiryRequest enquiryRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (enquiryRequest != null && ModelState.IsValid)
            {
                var getUserInvoiceResponse = await _IAccountService.SaveEnquiry(enquiryRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserInvoiceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("DownloadInvoice")]
        [ActionName("DownloadInvoice")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DownloadInvoice(int InvoiceId)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (InvoiceId > 0 && ModelState.IsValid)
            {
                var DownloadInvoiceResponse = await _IAccountService.DownloadInvoice(InvoiceId);

                httpResponseMessage = new HttpResponseMessage
                {
                    Content = new StreamContent(DownloadInvoiceResponse)
                    {
                        Headers =
                        {
                            ContentType = new MediaTypeHeaderValue("application/pdf"),
                            ContentDisposition = new ContentDispositionHeaderValue("attachment")
                            {
                                FileName = "Invoice.pdf"
                            }
                        }
                    },
                    StatusCode = HttpStatusCode.OK
                };
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpGet]
        [Route("DeactiveUserStatus")]
        [ActionName("DeactiveUserStatus")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeactiveUserStatus()
        {
            httpResponseMessage = new HttpResponseMessage();

            var DeactiveUserStatusResponse = await _IAccountService.DeactiveUserStatus();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, DeactiveUserStatusResponse);

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("IsCurrentUserEmail")]
        [ActionName("IsCurrentUserEmail")]
        [BasicAuthenticationAttribute]
        public bool IsCurrentUserEmail(string email)
        {
            if (email != null)
            {
                var IsCurrentUserEmailResponse = _IAccountService.IsCurrentUserEmail(email);
                if (IsCurrentUserEmailResponse.Success)
                {
                    return IsCurrentUserEmailResponse.IsCurrentUserEmail;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("IsCurrentUserPassword")]
        [ActionName("IsCurrentUserPassword")]
        [BasicAuthenticationAttribute]
        public async Task<bool> IsCurrentUserPassword(string password)
        {
            if (password != null)
            {
                var IsCurrentUserPasswordResponse = await _IAccountService.IsCurrentUserPassword(password);
                if (IsCurrentUserPasswordResponse.Success)
                {
                    return IsCurrentUserPasswordResponse.IsCurrentUserPassword;
                }
            }
            return false;
        }


        [HttpPost]
        [Route("GenerateDMCANotice")]
        [ActionName("GenerateDMCANotice")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GenerateDMCANotice(DMCANoticeGenerateRequest DMCAnoticeGenerateRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (DMCAnoticeGenerateRequest != null && ModelState.IsValid)
            {
                var DMCANoticeEmailRequestResponse = await _IAccountService.GenerateDMCANotice(DMCAnoticeGenerateRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, DMCANoticeEmailRequestResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetDMCADocuments")]
        [ActionName("GetDMCADocuments")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetDMCADocuments()
        {
            httpResponseMessage = new HttpResponseMessage();

            var GetUserDocumentsResponse = await _IAccountService.GetDMCADocuments();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetUserDocumentsResponse);

            return httpResponseMessage;

        }

        [HttpGet]
        [Route("CheckAccessOnNoticeGenerater")]
        [ActionName("CheckAccessOnNoticeGenerater")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CheckAccessOnNoticeGenerater()
        {
            httpResponseMessage = new HttpResponseMessage();

            var CheckAccessOnNoticeGeneraterResponse = await _IAccountService.CheckAccessOnNoticeGenerater();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CheckAccessOnNoticeGeneraterResponse);

            return httpResponseMessage;

        }

        [HttpGet]
        [Route("CheckStatusOfCurrentUser")]
        [ActionName("CheckStatusOfCurrentUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CheckStatusOfCurrentUser()
        {
            httpResponseMessage = new HttpResponseMessage();

            var CheckStatusOfCurrentUserResponse = await _IAccountService.CheckStatusOfCurrentUser();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CheckStatusOfCurrentUserResponse);

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetLoggedInUserTax")]
        [ActionName("GetLoggedInUserTax")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetLoggedInUserTax()
        {
            httpResponseMessage = new HttpResponseMessage();

            var GetLoggedInUserResponse = await _IAccountService.GetLoggedInUserTax();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetLoggedInUserResponse);
            return httpResponseMessage;

        }

        [HttpPost]
        [Route("GetTax")]
        [ActionName("GetTax")]
        public async Task<HttpResponseMessage> GetTax(TaxJarRequest taxJarRequest)
        {
            httpResponseMessage = new HttpResponseMessage();

            var CheckAccessOnNoticeGeneraterResponse = await _IAccountService.GetTax(taxJarRequest);
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CheckAccessOnNoticeGeneraterResponse);

            return httpResponseMessage;

        }

        [HttpPost]
        [Route("SignDocument")]
        [ActionName("SignDocument")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SignDocument(SignDocumentRequest signDocumentRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (signDocumentRequest != null && ModelState.IsValid)
            {
                var signDocumentRequestResponse = await _IAccountService.SignDocument(signDocumentRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, signDocumentRequestResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;

        }

        [HttpPost]
        [Route("SavePayDetail")]
        [ActionName("SavePayDetail")]
        //[BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SavePayDetail(PayDetailsRequest payDetailsRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (payDetailsRequest != null && ModelState.IsValid)
            {
                var paymentDetailsResponse = await _IAccountService.SavePayDetail(payDetailsRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, paymentDetailsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpGet]
        [Route("UpdatePaymentDetail")]
        [ActionName("UpdatePaymentDetail")]
        public async Task<HttpResponseMessage> UpdatePaymentDetail(int paymentId)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentId > 0)
            {
                var paymentDetailsResponse = await _IAccountService.UpdatePaymentDetail(paymentId);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, paymentDetailsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("DMCAUpdatePaymentDetail")]
        [ActionName("DMCAUpdatePaymentDetail")]
        public async Task<HttpResponseMessage> DMCAUpdatePaymentDetail(int paymentId)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentId > 0)
            {
                var DMCAUpdatePaymentDetailResponse = await _IAccountService.DMCAUpdatePaymentDetail(paymentId);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, DMCAUpdatePaymentDetailResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpGet]
        [Route("FRUpdatePaymentDetail")]
        [ActionName("FRUpdatePaymentDetail")]
        public async Task<HttpResponseMessage> FRUpdatePaymentDetail(int paymentId)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentId > 0)
            {
                var FRUpdatePaymentDetailResponse = await _IAccountService.FRUpdatePaymentDetail(paymentId);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, FRUpdatePaymentDetailResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpGet]
        [Route("GetPaymentDetailByPaymentId")]
        [ActionName("GetPaymentDetailByPaymentId")]
        public async Task<HttpResponseMessage> GetPaymentDetailByPaymentId(int paymentId)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (paymentId > 0)
            {
                var getPaymentDetailByPaymentIdResponse = await _IAccountService.GetPaymentDetailByPaymentId(paymentId);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getPaymentDetailByPaymentIdResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        
        [HttpGet]
        [Route("GetCurrentUserEmail")]
        [ActionName("GetCurrentUserEmail")]
        [BasicAuthenticationAttribute]
        public HttpResponseMessage GetCurrentUserEmail()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getCurrentUserEmailResponse = _IAccountService.GetCurrentUserEmail();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getCurrentUserEmailResponse);

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("IsUserBlocked")]
        [ActionName("IsUserBlocked")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> IsUserBlocked()
        {
            httpResponseMessage = new HttpResponseMessage();
            
            var IsUserBlockedResponse = await _IAccountService.IsUserBlocked();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, IsUserBlockedResponse);
            
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("SaveUserEmailRegistration")]
        [ActionName("SaveUserEmailRegistration")]
        public async Task<HttpResponseMessage> SaveUserEmailRegistration(UserEmailRegistrationRequest userEmailRegistrationRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (userEmailRegistrationRequest != null && ModelState.IsValid)
            {
                var saveUserEmailRegistrationResponse = await _IAccountService.SaveUserEmailRegistration(userEmailRegistrationRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, saveUserEmailRegistrationResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("UserEmailRegistrationToken")]
        [ActionName("UserEmailRegistrationToken")]
        public async Task<HttpResponseMessage> UserEmailRegistrationToken(string token)
        {

            httpResponseMessage = new HttpResponseMessage();
            if (token != null)
            {
                var UserEmailRegistrationTokenResponse = await _IAccountService.UserEmailRegistrationToken(token);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, UserEmailRegistrationTokenResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("SendEmailToRegisterUser")]
        [ActionName("SendEmailToRegisterUser")]
        public async Task<HttpResponseMessage> SendEmailToRegisterUser()
        {
            httpResponseMessage = new HttpResponseMessage();
            var sendEmailToRegisterUserResponse = await _IAccountService.SendEmailToRegisterUser();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, sendEmailToRegisterUserResponse);

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetFaceBookPosts")]
        [ActionName("GetFaceBookPosts")]
        public HttpResponseMessage GetFaceBookPosts(FaceBookRequest faceBookRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            var getFaceBookPostsResponse = _IAccountService.GetFaceBookPosts(faceBookRequest);
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getFaceBookPostsResponse);

            return httpResponseMessage;
        }
        #endregion

        #region ConsoleApp

        [HttpGet]
        [Route("GetUserDetailForSearchInvoked")]
        [ActionName("GetUserDetailForSearchInvoked")]
        public async Task<HttpResponseMessage> GetUserDetailForSearchInvoked()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getUserDetailForSearchInvokedResponse = await _IAccountService.GetUserDetailForSearchInvoked();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserDetailForSearchInvokedResponse);

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("SendMailToUnSigned")]
        [ActionName("SendMailToUnSigned")]
        public async Task<HttpResponseMessage> SendMailToUnSigned()
        {
            httpResponseMessage = new HttpResponseMessage();
            var sendMailToUnSigned = await _IAccountService.SendMailToUnSigned();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, sendMailToUnSigned);

            return httpResponseMessage;
        }


        [HttpGet]
        [Route("DunningLetter")]
        [ActionName("DunningLetter")]
        public async Task<HttpResponseMessage> DunningLetter()
        {
            httpResponseMessage = new HttpResponseMessage();
            var dunningLetter = await _IAccountService.DunningLetter();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, dunningLetter);

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("AmazonPaymentScheduling")]
        [ActionName("AmazonPaymentScheduling")]
        public async Task<HttpResponseMessage> AmazonPaymentScheduling()
        {
            httpResponseMessage = new HttpResponseMessage();
            var AmazonPaymentSchedulingResponse = await _IAccountService.AmazonPaymentScheduling();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, AmazonPaymentSchedulingResponse);

            return httpResponseMessage;
        }

        #endregion
    }
}
