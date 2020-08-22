using FacePinPoint.Entities.Common;
using FacePinPoint.Entities.Request;
using FacePinPoint.Entities.Response;
using FacePinPoint.Repository.IRepository;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using iTextSharp.text.html.simpleparser;

using Taxjar;
using System.Security.Cryptography;

using AmazonPay;
using AmazonPay.RecurringPaymentRequests;
using AmazonPay.Responses;
using Newtonsoft.Json.Linq;
using AmazonPay.StandardPaymentRequests;

namespace FacePinPoint.Repository.Repository
{
    public class AccountRepository : IAccountRepository
    {
        #region Private 

        private LoginResponse loginResponse = null;
        private EmailExistsResponse emailExistsResponse = null;
        private BaseResponse baseResponse = null;
        private UserDetailResponse userDetailResponse = null;
        private SignUpReposne signUpReposne = null;
        private AccountDetailReposne accountDetailReposne = null;
        private LoggedUserDetailResponse loggedUserDetailResponse = null;
        private MailContent mailContent = null;
        private UserSearchResultDataResponse userSearchResultDataResponse = null;
        private ProfileDetailResponse profileDetailResponse = null;
        private DMCALegalActionStatusResponse DMCALegalActionStatusResponse = null;
        private HitRecordListResponse hitRecordListResponse = null;
        private MultipleFaceBiometricsListResponse multipleFaceBiometricsListResponse = null;
        private UserInvoiceListResponse userInvoiceListResponse = null;
        private UserTicketListResponse userTicketListResponse = null;
        private ImageWithLinksResponse imageWithLinksResponse = null;
        private DMCALinksResponse DMCALinksResponse = null;
        private ChangePasswordResponse changePasswordResponse = null;
        private IsCurrentUserEmailResponse isCurrentUserEmailResponse = null;
        private IsCurrentUserPasswordResponse isCurrentUserPasswordResponse = null;
        private PayDMCANoticeList payDMCANoticeList = null;
        private CheckUserStatus checkUserStatus = null;
        private PdfResponse pdfresponse = null;
        private Document document = null;
        private UserDocument userdocument = null;
        private TaxResponse taxResponse = null;
        private SignResponse signResponse = null;
        private SavePaymentReponse savePaymentReposne = null;
        private PaymentDetailResponse paymentDetailResponse = null;
        private UserEmailResponse userEmailResponse = null;
        private static Client client = null;
        private static AmazonPay.CommonRequests.Configuration clientConfig = null;
        private IsUserBlockedResponse isUserBlockedResponse = null;
        private FaceBookPostsBaseResponse faceBookPostsBaseResponse = null;

        #endregion

        #region Public Function

        #region RestFullAPI's

        public IRestResponse UserCreate(usercreate userDetail)
        {
            var client = new RestClient(ApplicationConfiguration.USERCREATE_PATH);

            var request = new RestRequest(Method.POST);
            var encryptedPassword = AesEncryptionDecryption.Encrypt(userDetail.password);
            request.AddParameter("id", userDetail.id);
            request.AddParameter("email", userDetail.email);
            request.AddParameter("name", userDetail.email);
            request.AddParameter("password", encryptedPassword);
            request.AddParameter("role", userDetail.role);
            request.AddParameter("enabled", userDetail.enabled);
            request.AddParameter("page", userDetail.page);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse Detectsingleimageuser(string imagePath)
        {
            var client = new RestClient(ApplicationConfiguration.DETECTSINGLEIMAGEUSER_PATH);
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            request.AddFile("fileData", imagePath);
            request.AlwaysMultipartFormData = true;
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse EnrollDetectedImage(int tempFaceId, string userEmail)
        {

            string url = ApplicationConfiguration.ENROLL_PATH + '/' + tempFaceId + '/' + userEmail + '/';

            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);
            return response;
        }

        public IRestResponse CheckUserExistVerificationAttempt(string userEmail)
        {

            string url = ApplicationConfiguration.CHECKUSER_PATH + '/' + userEmail + '/';
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse FindUserBiometericsById(int biometricsId)
        {

            string url = ApplicationConfiguration.FINDUSERBIOMETERICSBYID_PATH + '/' + biometricsId;
            var client = new RestClient(url);
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse SearchResultByEmailId(string email)
        {
            IRestResponse response = null;
            try
            {
                string url = ApplicationConfiguration.SEARCHRESULT_PATH + '/' + email + '/';
                var client = new RestClient(url);
                var request = new RestRequest(Method.POST);
                request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
                response = client.Execute(request);
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return response;
        }

        public IRestResponse SendRecognizeNotificationOverEmail(bool result, string email)
        {

            string url = ApplicationConfiguration.RECOGNIZENOTIFICATION_PATH + '/' + result + '/' + email;
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse ReconizeFaceByUserBiometericsId(int? userBiometricsId)
        {

            string url = ApplicationConfiguration.RECONIZEBYUSERBIOMETRICSID_PATH + '/' + userBiometricsId;
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            var a = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchResultData>(response.Content);

            return response;
        }

        #endregion

        public async Task<UserDetailResponse> GetUserDetailByUserEmail(string email)
        {
            try
            {
                userDetailResponse = new UserDetailResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    userDetailResponse.UserDetail = await db.system_user.Where(x => x.email == email).Select(x => new Entities.Response.UserDetail { Email = x.email, Enabled = x.enabled, ID = x.id, Name = x.name, Password = x.password, User_Role = x.user_role }).FirstOrDefaultAsync();

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userDetailResponse.Success = false;
                userDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userDetailResponse;
        }

        public async Task<LoginResponse> Login(UserLogin userLogin)
        {
            try
            {
                loginResponse = new LoginResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var userDetailResponse = await GetUserDetailByUserEmail(userLogin.Email);
                    if (userDetailResponse.UserDetail != null && userDetailResponse.Success)
                    {
                        var DecryptedPassword = AesEncryptionDecryption.Decrypt(userDetailResponse.UserDetail.Password);

                        if (userLogin.Password != DecryptedPassword)
                        {
                            loginResponse.IsLogin = false;
                            loginResponse.Success = false;
                            loginResponse.Message = CustomErrorMessages.INVALID_USERNAME_PASSWORD;
                        }
                        else
                        {
                            loginResponse.Token = EncodeDecodeToken.CreateEncryptedAuthenticateTicket(userDetailResponse.UserDetail);
                            loginResponse.IsLogin = true;
                            loginResponse.Success = true;
                            loginResponse.Email = userDetailResponse.UserDetail.Email;
                        }
                    }
                    else
                    {
                        loginResponse.IsLogin = false;
                        loginResponse.Success = false;
                        loginResponse.Message = CustomErrorMessages.INVALID_USERNAME_PASSWORD;
                    }

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                loginResponse.Success = false;
                loginResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return loginResponse;
        }

        public async Task<EmailExistsResponse> EmailExists(string email)
        {
            try
            {
                emailExistsResponse = new EmailExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    emailExistsResponse.IsEmailExists = await db.system_user.Where(x => x.email == email.ToLower()).AnyAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                emailExistsResponse.Success = false;
                emailExistsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return emailExistsResponse;
        }

        public BaseResponse SaveUserImage(UserImageRequest userImageRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                string img = userImageRequest.ImageBase64;
                //getting the image url
                // Convert Base64 String to byte[]
                saveImageInFolder(img, "JPEG");
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public BaseResponse AgeVerificationAPI(AccountDetail accountDetail)
        {
            baseResponse = new BaseResponse();
            string sCountry = accountDetail.CountryCode;
            string sFirst_Name = HttpUtility.UrlEncode(accountDetail.FirstName);
            string sLast_Name = HttpUtility.UrlEncode(accountDetail.LastName);

            string dDOB = HttpUtility.UrlEncode(String.Format("{0:MM/dd/yyyy}", accountDetail.DOB));
            string sZip_Code = HttpUtility.UrlEncode(accountDetail.ZipCode.ToString());


            string sid = ApplicationConfiguration.INTEGRITY_AUTHENTICATION_SITEID;

            //Create the URL string
            string sUrl = ApplicationConfiguration.INTEGRITY_AUTHENTICATION_API_PATH;

            string sData = "sid=" + sid + "&first=" + sFirst_Name + "&last=" + sLast_Name + "&zip=" + sZip_Code + "&dob=" + dDOB + "&country=" + sCountry;

            byte[] bdata = UTF8Encoding.UTF8.GetBytes(sData);

            //Requesting Service
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(sUrl);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = bdata.Length;
            Stream newStream = request.GetRequestStream(); //Open the Connection
            newStream.Write(bdata, 0, bdata.Length); // Send the Data.
            newStream.Close();

            //Retrieve the result
            string strResponse = "";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                strResponse = sr.ReadToEnd();

                string[] tempArr = strResponse.Split('&');
                //List<IDictionary<string, string>> dictList = new List<IDictionary<string, string>>();
                //IDictionary<string, string> dict = new Dictionary<string, string>(); ;
                // int i = 0;
                AgeVerificationAPIResponse ageVerificationResponse = new AgeVerificationAPIResponse();
                foreach (var temp in tempArr)
                {
                    string[] Arr = temp.Split('=');

                    switch (Arr[0])
                    {
                        case "tid":
                            ageVerificationResponse.tid = Arr[1];
                            break;

                        case "mc":
                            ageVerificationResponse.mc = Convert.ToInt32(Arr[1]);
                            break;

                        case "mc_desc":
                            ageVerificationResponse.mc_desc = Arr[1];
                            break;

                        case "err_code":
                            ageVerificationResponse.err_code = Convert.ToInt32(Arr[1]);
                            break;

                        case "err_desc":
                            ageVerificationResponse.err_desc = Arr[1];
                            break;
                    }
                    //dict.Add()
                    //dictList.Add(dict);
                }

                if (ageVerificationResponse != null)
                {
                    if (ageVerificationResponse.mc > 0)
                    {
                        baseResponse.Message = ageVerificationResponse.err_desc;
                        baseResponse.Success = true;
                    }
                    else if (ageVerificationResponse.mc == 0 && ageVerificationResponse.err_code == 0)
                    {
                        baseResponse.Message = ageVerificationResponse.err_desc;
                        baseResponse.Success = false;
                    }
                    else
                    {
                        baseResponse.Message = ageVerificationResponse.err_desc;
                        baseResponse.Success = false;
                    }
                }
                else
                {
                    baseResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                    baseResponse.Success = false;
                }
                return baseResponse;

            }


        }

        public AccountDetailReposne SaveAccountDetail(AccountDetail accountDetail)
        {
            try
            {
                var ageVerificationResponse = AgeVerificationAPI(accountDetail);
                accountDetailReposne = new AccountDetailReposne();
                if (ageVerificationResponse.Success == true)
                {
                    usercreate userCreate = new usercreate();
                    userCreate.email = accountDetail.Email.ToLower();
                    userCreate.password = accountDetail.Password;

                    userCreate.enabled = "0";
                    var userCreateResponse = UserCreate(userCreate);

                    var APIContent = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateUserAPIResponse>(userCreateResponse.Content);

                    if (!string.IsNullOrEmpty(APIContent.actionMessage) && APIContent.actionMessage == "Created With Success")
                    {
                        using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                        {
                            system_user UpdateUser = db.system_user.Where(x => x.email == accountDetail.Email).FirstOrDefault();
                            UpdateUser.FirstName = accountDetail.FirstName;
                            UpdateUser.LastName = accountDetail.LastName;
                            UpdateUser.DateOfBirth = accountDetail.DOB;
                            UpdateUser.ZipCode = accountDetail.ZipCode;
                            UpdateUser.Blocked = "N";
                            UpdateUser.Verified = false;
                            db.SaveChanges();

                            accountDetailReposne.Email = accountDetail.Email;
                            accountDetailReposne.Success = true;
                            accountDetailReposne.Message = null;
                        }
                    }
                    else
                    {
                        accountDetailReposne.Success = false;
                        accountDetailReposne.Message = APIContent.actionMessage;
                    }
                }
                else
                {
                    accountDetailReposne.Success = false;
                    accountDetailReposne.Message = ageVerificationResponse.Message == null?CustomErrorMessages.AGE_VERIFICATION_API_ERROR: ageVerificationResponse.Message;
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                accountDetailReposne.Success = false;
                accountDetailReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return accountDetailReposne;
        }


        public BaseResponse EnrollUserIDPhoto(PhotoDetailRequest photoDetail)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    string loggedInUser = photoDetail.Email;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        // Save Image
                        if (!string.IsNullOrEmpty(photoDetail.ImageBase64))
                        {
                            // save image in folder
                            var imagePath = saveImageInFolder(photoDetail.ImageBase64, "JPEG");

                            // send detect single image user API request
                            var detectSingleImageUser = Detectsingleimageuser(imagePath);

                            var detectSingleImageUserResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<DetectSingleImageUserResponse>(detectSingleImageUser.Content);

                            if (!detectSingleImageUserResponse.status.Contains("succeeded"))
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = detectSingleImageUserResponse.status;
                                return baseResponse;
                            }
                            FileInfo file = new FileInfo(imagePath);
                            if (file.Exists)
                            {
                                file.Delete();
                            }

                            // send enroll detected image response
                            var EnrollDetectedImageResponse = EnrollDetectedImage(detectSingleImageUserResponse.croppedTempFaceList[0].tempFaceId, loggedInUser);

                            if (!EnrollDetectedImageResponse.Content.Contains("succeeded"))
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = EnrollDetectedImageResponse.Content;
                                return baseResponse;
                            }

                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<SavePaymentReponse> SavePaymentDetail(PaymentDetailRequest paymentDetailsRequest)
        {
            try
            {
                savePaymentReposne = new SavePaymentReponse();
                var loggedInUser = paymentDetailsRequest.Email;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var UserDetail = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();
                        if (UserDetail.id > 0)
                        {
                            if (paymentDetailsRequest.PaymentDetails != null)
                            {
                                Payment payment = new Payment();
                                payment.PackageId = Convert.ToInt32(paymentDetailsRequest.PaymentDetails.PackageId);
                                payment.CouponId = paymentDetailsRequest.PaymentDetails.CouponId;
                                payment.Status = 0;
                                payment.Type = paymentDetailsRequest.PaymentDetails.Type;
                                payment.Discount = paymentDetailsRequest.PaymentDetails.Discount;
                                payment.SubTotal = paymentDetailsRequest.PaymentDetails.SubTotal;
                                payment.TotalOrder = paymentDetailsRequest.PaymentDetails.TotalOrder;
                                payment.UserId = UserDetail.id;
                                payment.PaymentMethod = paymentDetailsRequest.PaymentDetails.PaymentMethod;
                                payment.PaymentDate = DateTime.Now;
                                payment.LinksCount = Convert.ToInt32(paymentDetailsRequest.PaymentDetails.LinksCount);
                                payment.SalesTax = paymentDetailsRequest.PaymentDetails.SalesTax;
                                db.Payments.Add(payment);
                                await db.SaveChangesAsync();

                                if (paymentDetailsRequest.LinksDetails != null && paymentDetailsRequest.LinksDetails.Count > 0)
                                {
                                    foreach (var LinkDetail in paymentDetailsRequest.LinksDetails)
                                    {
                                        DMCARemovalLink DMCARemovalLink = new DMCARemovalLink();
                                        DMCARemovalLink.Url = LinkDetail.Url;
                                        DMCARemovalLink.SiteId = LinkDetail.SiteId;
                                        DMCARemovalLink.UserId = UserDetail.id;
                                        DMCARemovalLink.PaymentId = payment.PaymentId;
                                        DMCARemovalLink.dmca_required = true;
                                        DMCARemovalLink.dmca_count = 0;
                                        DMCARemovalLink.CreatedDate = DateTime.Now;
                                        db.DMCARemovalLinks.Add(DMCARemovalLink);
                                    }
                                    await db.SaveChangesAsync();
                                }

                                if (paymentDetailsRequest.PlanDetails != null)
                                {
                                    // Save Package Detail
                                    UserDetail userDetail = new UserDetail();
                                    userDetail.PackageId = Convert.ToInt32(paymentDetailsRequest.PlanDetails.SelectPackageId);
                                    userDetail.UserId = UserDetail.id;
                                    userDetail.PackagePrice = float.Parse(paymentDetailsRequest.PlanDetails.SelectPackPrice);
                                    userDetail.Active = "N";
                                    userDetail.PaymentId = payment.PaymentId;
                                    userDetail.CreatedDate = DateTime.Now;
                                    db.UserDetails.Add(userDetail);
                                    await db.SaveChangesAsync();

                                    savePaymentReposne.PaymentId = payment.PaymentId;
                                }

                                // when payment type is amazon
                                if (paymentDetailsRequest.PaymentDetails.PaymentMethod == "Amazon")
                                {
                                    if (paymentDetailsRequest.PaymentDetails.Type == "Search")
                                    {
                                        string sellerNote = "FACE RECOGNITION : " + paymentDetailsRequest.PlanDetails.SearchAllowed + " Search $ " + paymentDetailsRequest.PlanDetails.SelectPackPrice + " USD";
                                        var response = AmazonRecurringPayment(payment.PaymentId, paymentDetailsRequest.amazonBillingAgreementId, payment.TotalOrder, sellerNote);
                                        if (response.Success)
                                        {
                                            PayDetailsRequest payDetailsRequest = new PayDetailsRequest();
                                            payDetailsRequest.PaymentId = payment.PaymentId;
                                            payDetailsRequest.TrackingNumber = response.Message;
                                            payDetailsRequest.Amount = (double)payment.TotalOrder;
                                            payDetailsRequest.Source = "P";
                                            await SavePayDetail(payDetailsRequest);

                                            await UpdatePaymentDetail(payment.PaymentId);
                                        }
                                        else
                                        {
                                            savePaymentReposne.Success = false;
                                            savePaymentReposne.Message = CustomErrorMessages.PAYMENT_ERROR;
                                            return savePaymentReposne;
                                        }
                                    }
                                    else
                                    {
                                        string sellerNote = paymentDetailsRequest.LinksDetails.Count + " LINK REMOVAL $ " + (paymentDetailsRequest.LinksDetails.Count * Convert.ToInt32(paymentDetailsRequest.PlanDetails.SelectPackPrice)) + " USD";
                                        savePaymentReposne.AmazonParamters = FacePinPoint.Repository.Repository.AccountRepository.AddRequiredParameters(paymentDetailsRequest.PaymentDetails.TotalOrder.ToString(), ApplicationConfiguration.DEFAULT_CURRENCY, sellerNote, payment.PaymentId, true);
                                    }
                                }
                            }
                            else
                            {
                                savePaymentReposne.Success = false;
                                savePaymentReposne.Message = CustomErrorMessages.INVALID_INPUTS;
                                return savePaymentReposne;
                            }
                        }
                        else
                        {
                            savePaymentReposne.Success = false;
                            savePaymentReposne.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    savePaymentReposne.Success = false;
                    savePaymentReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                savePaymentReposne.Success = false;
                savePaymentReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return savePaymentReposne;
        }

        public async Task<SignUpReposne> SignUpUser(SignUpDetailsRequest signUpDetails)
        {
            try
            {
                signUpReposne = new SignUpReposne();
                usercreate userCreate = new usercreate();
                userCreate.email = signUpDetails.AccountDetails.Email.ToLower();
                userCreate.password = signUpDetails.AccountDetails.Password;
                userCreate.enabled = (signUpDetails.PlanDetails.SelectedPackType == "FACE_RECOGNITION") ? "1" : "0";
                var userCreateResponse = UserCreate(userCreate);

                var APIContent = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateUserAPIResponse>(userCreateResponse.Content);

                if (!string.IsNullOrEmpty(APIContent.actionMessage) && APIContent.actionMessage == "Created With Success")
                {
                    using (FacepinpointDBEntities dbLocalObj = new FacepinpointDBEntities())
                    {
                        var user = await GetUserDetailByUserEmail(signUpDetails.AccountDetails.Email);

                        // Save Image
                        if (!string.IsNullOrEmpty(signUpDetails.PhotoDetails.ImageBase64))
                        {
                            // save image in folder
                            var imagePath = saveImageInFolder(signUpDetails.PhotoDetails.ImageBase64, "JPEG");

                            // send detect single image user API request
                            var detectSingleImageUser = Detectsingleimageuser(imagePath);

                            var detectSingleImageUserResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<DetectSingleImageUserResponse>(detectSingleImageUser.Content);

                            if (!detectSingleImageUserResponse.status.Contains("succeeded"))
                            {
                                signUpReposne.Success = false;
                                signUpReposne.Message = detectSingleImageUserResponse.status;
                                return signUpReposne;
                            }
                            FileInfo file = new FileInfo(imagePath);
                            if (file.Exists)
                            {
                                file.Delete();
                            }

                            // send enroll detected image response
                            var EnrollDetectedImageResponse = EnrollDetectedImage(detectSingleImageUserResponse.croppedTempFaceList[0].tempFaceId, signUpDetails.AccountDetails.Email);

                            if (!EnrollDetectedImageResponse.Content.Contains("succeeded"))
                            {
                                signUpReposne.Success = false;
                                signUpReposne.Message = EnrollDetectedImageResponse.Content;
                                return signUpReposne;
                            }
                        }

                        Payment payment = new Payment();

                        if (signUpDetails.PaymentDetails != null)
                        {
                            payment.PackageId = Convert.ToInt32(signUpDetails.PlanDetails.SelectPackageId);
                            payment.CouponId = signUpDetails.PaymentDetails.CouponId;
                            payment.Status = 1;
                            payment.Type = signUpDetails.PaymentDetails.Type;
                            payment.Discount = signUpDetails.PaymentDetails.Discount;
                            payment.SubTotal = signUpDetails.PaymentDetails.SubTotal;
                            payment.TotalOrder = signUpDetails.PaymentDetails.TotalOrder;
                            payment.UserId = user.UserDetail.ID;
                            payment.PaymentMethod = signUpDetails.PaymentDetails.PaymentMethod;
                            payment.PaymentDate = DateTime.Now;
                            payment.LinksCount = Convert.ToInt32(signUpDetails.PaymentDetails.LinksCount);
                            payment.SalesTax = signUpDetails.PaymentDetails.SalesTax;
                            dbLocalObj.Payments.Add(payment);
                            await dbLocalObj.SaveChangesAsync();
                        }
                        else
                        {
                            signUpReposne.Success = false;
                            signUpReposne.Message = CustomErrorMessages.INVALID_INPUTS;
                            return signUpReposne;
                        }

                        // Save Package Detail
                        UserDetail userDetail = new UserDetail();
                        userDetail.PackageId = Convert.ToInt32(signUpDetails.PlanDetails.SelectPackageId);
                        userDetail.UserId = user.UserDetail.ID;
                        userDetail.PackagePrice = float.Parse(signUpDetails.PlanDetails.SelectPackPrice);
                        userDetail.Active = "Y";
                        userDetail.CreatedDate = DateTime.Now;
                        dbLocalObj.UserDetails.Add(userDetail);
                        await dbLocalObj.SaveChangesAsync();

                        // SaveLinkDetails
                        if (signUpDetails.LinksDetails.Length > 0)
                        {
                            foreach (var linksDetail in signUpDetails.LinksDetails)
                            {
                                FacePinPoint.Repository.DMCARemovalLink DMCARemovalLink = new FacePinPoint.Repository.DMCARemovalLink();
                                DMCARemovalLink.UserId = user.UserDetail.ID;
                                DMCARemovalLink.Url = linksDetail;
                                DMCARemovalLink.dmca_required = true;
                                DMCARemovalLink.dmca_count = 0;
                                DMCARemovalLink.PaymentId = payment.PaymentId;
                                DMCARemovalLink.CreatedDate = DateTime.Now;

                                dbLocalObj.DMCARemovalLinks.Add(DMCARemovalLink);

                            }
                            await dbLocalObj.SaveChangesAsync();
                        }

                        user.UserDetail.Password = AesEncryptionDecryption.Decrypt(user.UserDetail.Password);

                        string TemplateName = (userCreate.enabled == "1") ? "SignUp" : "DMCA SignUp";
                        var templateResponse = await dbLocalObj.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getSignUpTemplate\"('" + TemplateName + "', '" + user.UserDetail.Email + "', '" + user.UserDetail.Password + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='" + TemplateName + "'").FirstOrDefaultAsync();
                        mailContent = new MailContent();
                        mailContent.ToEmail = signUpDetails.AccountDetails.Email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                }
                else
                {
                    signUpReposne.Success = false;
                    signUpReposne.Message = APIContent.actionMessage;
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                signUpReposne.Success = false;
                signUpReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return signUpReposne;
        }

        public async Task<LoggedUserDetailResponse> GetLoggedInUserDetail()
        {
            try
            {
                loggedUserDetailResponse = new LoggedUserDetailResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {

                        var systemUser = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();

                        if (systemUser.id > 0)
                        {
                            loggedUserDetailResponse.Email = loggedInUser;
                            loggedUserDetailResponse.Status = systemUser.enabled;

                            int PendingLinksCount = await (from DR in db.DMCARemovalLinks
                                                           where DR.UserId == systemUser.id && DR.DMCADocumentId == null && DR.SiteId > 0
                                                           select DR.LinkId
                                                                        ).CountAsync();

                            loggedUserDetailResponse.AccessDMCANotice = (PendingLinksCount > 0) ? true : false;


                            var DMCALegalActionStatusResponse = await GetDMCALegalActionStatus(loggedInUser);
                            if (DMCALegalActionStatusResponse.Success)
                            {
                                loggedUserDetailResponse.DMCAStatus = DMCALegalActionStatusResponse.DMCAStatusResult;
                                loggedUserDetailResponse.DMCALegalActionStatus = DMCALegalActionStatusResponse.DMCALegalActionStatusResult;
                            }

                            var userBiometeric = await db.userbiometrics.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();

                            if (userBiometeric != null && userBiometeric.id > 0)
                            {
                                loggedUserDetailResponse.Verified = userBiometeric.verified;
                                var userBiometericsResponse = FindUserBiometericsById(userBiometeric.id);
                                var detectSingleImageUserResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserBiometricData>(userBiometericsResponse.Content);
                                loggedUserDetailResponse.UserBiometricData = detectSingleImageUserResponse;

                                StringBuilder builder = new StringBuilder(loggedUserDetailResponse.UserBiometricData.faceFilePath);
                                builder.Replace(ApplicationConfiguration.FACE_IMAGES_LOCAL_URL, ApplicationConfiguration.FACE_IMAGES_URL);
                                builder.Replace(@"\", "/");

                                loggedUserDetailResponse.UserBiometricData.faceFilePath = builder.ToString();

                                //if (loggedUserDetailResponse.Verified == true)
                                //{

                                //    int CheckSearchLog = await (from HR in db.hitrecords
                                //                                where HR.userbiometrics_id == userBiometeric.id
                                //                                select HR.id).CountAsync();

                                //    if (CheckSearchLog == 0)
                                //    {
                                //        var PlanDetails = await db.UserDetails.Where(x => x.UserId == systemUser.id && x.Active == "Y").FirstOrDefaultAsync();

                                //        if (PlanDetails != null)
                                //        {

                                //            var reconizeFaceByUserBiometerics = ReconizeFaceByUserBiometericsId(userBiometeric.id);
                                //            var reconizeFaceByUserBiometericsResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchResultData>(reconizeFaceByUserBiometerics.Content);

                                //            // Sending Mail for Search Results
                                //            mailContent = new MailContent();

                                //            if (reconizeFaceByUserBiometericsResponse.candidateFaceList.Count > 0)
                                //            {
                                //                //SendRecognizeNotificationOverEmail(true, loggedInUser);
                                //                var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_FaceSearchTemplate\"('SEARCH_SUCCESS'," + reconizeFaceByUserBiometericsResponse.candidateFaceList.Count + ") AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='SEARCH_SUCCESS'").FirstOrDefaultAsync();
                                //                mailContent.MsgSubject = templateResponse.Subject;
                                //                mailContent.MsgBody = templateResponse.Template;
                                //            }
                                //            else
                                //            {
                                //                //SendRecognizeNotificationOverEmail(false, loggedInUser);
                                //                var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_FaceSearchTemplate\"('SEARCH_FAILURE',0) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='SEARCH_FAILURE'").FirstOrDefaultAsync();
                                //                mailContent.MsgSubject = templateResponse.Subject;
                                //                mailContent.MsgBody = templateResponse.Template;

                                //            }
                                //            mailContent.ToEmail = loggedInUser;
                                //            EmailSender.MailSender(mailContent);
                                //        }
                                //    }
                                //}
                                //await GetUserDetailForSearchInvoked();
                            }
                            else
                            {
                                loggedUserDetailResponse.Verified = false;
                            }
                        }
                        else
                        {
                            loggedUserDetailResponse.Success = false;
                            loggedUserDetailResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        loggedUserDetailResponse.Success = false;
                        loggedUserDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                loggedUserDetailResponse.Success = false;
                loggedUserDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return loggedUserDetailResponse;
        }

        public async Task<BaseResponse> ForgetPasswordLink(string email)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var userDetailResponse = await GetUserDetailByUserEmail(email);
                    if (userDetailResponse.UserDetail != null && userDetailResponse.Success)
                    {

                        var forgetPasswordToken = EncodeDecodeForgetPasswordToken.CreateEncryptedForgetPasswordToken(userDetailResponse.UserDetail);
                        var templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getforgetpasswordtemplate\"('FP','" + userDetailResponse.UserDetail.Email + "' , '" + forgetPasswordToken + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='FP'").FirstOrDefaultAsync();
                        //var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Active = x.Active, Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "FP").FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> RestForgetPassword(string token, RestPassword RestPassword)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ForgetPasswordToken decrypteForgetPasswordToken = EncodeDecodeForgetPasswordToken.DecrypteForgetPasswordToken(token);
                    if (DateTime.Compare(Convert.ToDateTime(decrypteForgetPasswordToken.ExpireDateTime), DateTime.Now) > 0)
                    {
                        system_user systemUser = await db.system_user.Where(x => x.email == decrypteForgetPasswordToken.Email).FirstOrDefaultAsync();
                        if (systemUser != null)
                        {
                            systemUser.password = AesEncryptionDecryption.Encrypt(RestPassword.NewPassword);
                            db.SaveChanges();

                            var templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getSignUpTemplate\"('Change Password','" + systemUser.name + "','" + RestPassword.NewPassword + "' ) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Change Password'").FirstOrDefaultAsync();

                            mailContent = new MailContent();
                            mailContent.ToEmail = systemUser.email;
                            mailContent.MsgSubject = templateResponse.Subject;
                            mailContent.MsgBody = templateResponse.Template;
                            EmailSender.MailSender(mailContent);
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.TOKEN_EXPIRED;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public BaseResponse ValidateForgetPasswordLink(string token)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ForgetPasswordToken decrypteForgetPasswordToken = EncodeDecodeForgetPasswordToken.DecrypteForgetPasswordToken(token);
                    if (DateTime.Compare(Convert.ToDateTime(decrypteForgetPasswordToken.ExpireDateTime), DateTime.Now) > 0)
                    {
                        baseResponse.Success = true;
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.TOKEN_EXPIRED;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<ChangePasswordResponse> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            try
            {
                changePasswordResponse = new ChangePasswordResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    //var loggedInUser = "saddamhusaainwins@gmail.com";
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        system_user system_user = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();
                        if (system_user != null)
                        {
                            var decryptPassword = AesEncryptionDecryption.Decrypt(system_user.password);

                            if (decryptPassword == changePasswordRequest.OldPassword)
                            {
                                system_user.password = AesEncryptionDecryption.Encrypt(changePasswordRequest.NewPassword);
                                db.SaveChanges();

                                var userDetailResponse = await GetUserDetailByUserEmail(loggedInUser);
                                changePasswordResponse.Token = EncodeDecodeToken.CreateEncryptedAuthenticateTicket(userDetailResponse.UserDetail);
                                changePasswordResponse.Success = true;
                                changePasswordResponse.Message = CustomErrorMessages.PASSWORD_CHANGEDSUCCESSFULLY;

                                var templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getSignUpTemplate\"('Change Password','" + userDetailResponse.UserDetail.Email + "', '" + changePasswordRequest.NewPassword + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Change Password'").FirstOrDefaultAsync();
                                mailContent = new MailContent();
                                mailContent.ToEmail = system_user.email;
                                mailContent.MsgSubject = templateResponse.Subject;
                                mailContent.MsgBody = templateResponse.Template;
                                EmailSender.MailSender(mailContent);

                            }
                            else
                            {
                                changePasswordResponse.Success = false;
                                changePasswordResponse.Message = CustomErrorMessages.OLDPASSWORD_NOTMATCHED;
                            }
                        }
                        else
                        {
                            changePasswordResponse.Success = false;
                            changePasswordResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        changePasswordResponse.Success = false;
                        changePasswordResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }

                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                changePasswordResponse.Success = false;
                changePasswordResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return changePasswordResponse;
        }

        public UserSearchResultDataResponse SearchByResultByEmail()
        {
            try
            {
                userSearchResultDataResponse = new UserSearchResultDataResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var searchResultByEmailId = SearchResultByEmailId(loggedInUser);
                        var searchResultByEmailIdResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchResultData>(searchResultByEmailId.Content);
                        userSearchResultDataResponse.UserSearchResultData = searchResultByEmailIdResponse;
                        if (searchResultByEmailIdResponse.candidateFaceList.Count > 0)
                        {
                            SendRecognizeNotificationOverEmail(true, loggedInUser);
                        }
                        else
                        {
                            SendRecognizeNotificationOverEmail(false, loggedInUser);
                        }
                    }
                    else
                    {
                        userSearchResultDataResponse.Success = false;
                        userSearchResultDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userSearchResultDataResponse.Success = false;
                userSearchResultDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userSearchResultDataResponse;
        }

        public UserSearchResultDataResponse GetReconizeFaceByUserBiometericsId()
        {
            try
            {
                userSearchResultDataResponse = new UserSearchResultDataResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int userBiometericsId = db.userbiometrics.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefault();

                        if (userBiometericsId > 0)
                        {
                            var reconizeFaceByUserBiometerics = ReconizeFaceByUserBiometericsId(userBiometericsId);
                            var reconizeFaceByUserBiometericsResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchResultData>(reconizeFaceByUserBiometerics.Content);
                            userSearchResultDataResponse.UserSearchResultData = reconizeFaceByUserBiometericsResponse;
                            if (reconizeFaceByUserBiometericsResponse.candidateFaceList.Count > 0)
                            {
                                SendRecognizeNotificationOverEmail(true, loggedInUser);
                            }
                            else
                            {
                                SendRecognizeNotificationOverEmail(false, loggedInUser);
                            }
                        }
                        else
                        {
                            userSearchResultDataResponse.Success = false;
                            userSearchResultDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                        }
                    }
                    else
                    {
                        userSearchResultDataResponse.Success = false;
                        userSearchResultDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userSearchResultDataResponse.Success = false;
                userSearchResultDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userSearchResultDataResponse;
        }

        public async Task<ProfileDetailResponse> GetUserProfileDetail()
        {
            try
            {
                profileDetailResponse = new ProfileDetailResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var systemUser = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();
                        if (systemUser.id > 0)
                        {
                            profileDetailResponse.Email = loggedInUser;
                            profileDetailResponse.Status = systemUser.enabled;

                            if (profileDetailResponse.Status == "1")
                            {
                                var UserData = await (from UD in db.UserDetails
                                                      join P in db.Packages on UD.PackageId equals P.PackageId
                                                      join PP in db.Payments on UD.PaymentId equals PP.PaymentId
                                                      where UD.UserId == systemUser.id && UD.Active == "Y"
                                                      select new
                                                      {
                                                          P.Type,
                                                          PP.PaymentMethod
                                                      }).FirstOrDefaultAsync();
                                if (UserData != null)
                                {
                                    profileDetailResponse.PackageType = UserData.Type;
                                    profileDetailResponse.PaymentMethod = UserData.PaymentMethod;
                                }

                                profileDetailResponse.PackageFeatureDetail = await (from UD in db.UserDetails
                                                                                    join P in db.Packages on UD.PackageId equals P.PackageId
                                                                                    where UD.UserId == systemUser.id && UD.Active == "Y"
                                                                                    select new PackageFeatureDetail
                                                                                    {
                                                                                        Name = P.Name,
                                                                                        PackageId = P.PackageId,
                                                                                        Price = P.Price,
                                                                                        SearchAllowed = P.SearchAllowed,
                                                                                        packagefeature = (from PF in db.PackageFeatures
                                                                                                          where PF.PackageId == P.PackageId
                                                                                                          select new FacePinPoint.Entities.Response.PackageFeature
                                                                                                          {
                                                                                                              PackageId = PF.PackageId,
                                                                                                              PackageFeatureId = PF.PackageFeatureId,
                                                                                                              Active = PF.Active,
                                                                                                              FeatureName = PF.FeatureName,
                                                                                                          }).ToList()
                                                                                    }).FirstOrDefaultAsync();
                            }

                            var userBiometeric = await db.userbiometrics.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();

                            if (userBiometeric != null && userBiometeric.id > 0)
                            {
                                profileDetailResponse.Verified = userBiometeric.verified;

                                var userBiometericsResponse = FindUserBiometericsById(userBiometeric.id);
                                var detectSingleImageUserResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserBiometricData>(userBiometericsResponse.Content);
                                profileDetailResponse.UserBiometricData = detectSingleImageUserResponse;
                                profileDetailResponse.Email = loggedInUser;

                                StringBuilder builder = new StringBuilder(profileDetailResponse.UserBiometricData.faceFilePath);
                                builder.Replace(ApplicationConfiguration.FACE_IMAGES_LOCAL_URL, ApplicationConfiguration.FACE_IMAGES_URL);
                                builder.Replace(@"\", "/");

                                profileDetailResponse.UserBiometricData.faceFilePath = builder.ToString();
                            }
                            else
                            {
                                profileDetailResponse.Verified = false;
                            }
                        }
                        else
                        {
                            profileDetailResponse.Success = false;
                            profileDetailResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        profileDetailResponse.Success = false;
                        profileDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                profileDetailResponse.Success = false;
                profileDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return profileDetailResponse;
        }

        public async Task<DMCALegalActionStatusResponse> GetDMCALegalActionStatus(string loggedInUser)
        {
            try
            {
                DMCALegalActionStatusResponse = new DMCALegalActionStatusResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int systemUserId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (systemUserId > 0)
                        {

                            var DMCALegalActionStatusStringResult = await db.Database.SqlQuery<DMCALegalActionStatusStringResult>("select \"public\".\"FN_GetDMCAStatusStats\"(" + systemUserId + ") as \"DMCAStatus\", \"public\".\"fn_GetDMCALegalStats\"(" + systemUserId + ") as \"DMCALegalActionStatus\"").FirstOrDefaultAsync();

                            DMCAStatus DMCAStatus = Newtonsoft.Json.JsonConvert.DeserializeObject<DMCAStatus>(DMCALegalActionStatusStringResult.DMCAStatus);
                            DMCALegalActionStatus DMCALegalActionStatus = Newtonsoft.Json.JsonConvert.DeserializeObject<DMCALegalActionStatus>(DMCALegalActionStatusStringResult.DMCALegalActionStatus);

                            if (DMCAStatus != null || DMCALegalActionStatus != null)
                            {
                                DMCALegalActionStatusResponse.DMCAStatusResult = DMCAStatus;
                                DMCALegalActionStatusResponse.DMCALegalActionStatusResult = DMCALegalActionStatus;
                            }
                            else
                            {
                                DMCALegalActionStatusResponse.Success = false;
                                DMCALegalActionStatusResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                DMCALegalActionStatusResponse.Success = false;
                DMCALegalActionStatusResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return DMCALegalActionStatusResponse;
        }

        public async Task<HitRecordListResponse> GetHitRecords()
        {
            try
            {
                hitRecordListResponse = new HitRecordListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;

                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int systemUserId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (systemUserId > 0)
                        {
                            var SearchResultsJson = await db.Database.SqlQuery<JsonRespone>("select \"public\".\"fn_getSearchReports\"('" + systemUserId + "') as \"json\"").FirstOrDefaultAsync();

                            var SearchResults = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchReportResponse>(SearchResultsJson.json);

                            hitRecordListResponse.HitRecordList = SearchResults.searchReports;
                            hitRecordListResponse.ShowSearchResults = SearchResults.ShowSearchResults;
                        }
                        else
                        {
                            hitRecordListResponse.Success = false;
                            hitRecordListResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        hitRecordListResponse.Success = false;
                        hitRecordListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                hitRecordListResponse.Success = false;
                hitRecordListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return hitRecordListResponse;
        }

        public async Task<UserInvoiceListResponse> GetUserInvoice(bool viewAll)
        {
            try
            {
                userInvoiceListResponse = new UserInvoiceListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;

                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {

                            if (viewAll)
                            {
                                var userInvoiceResult = await (from UD in db.Payments
                                                               where UD.UserId == userId

                                                               select new UserInvoice
                                                               {
                                                                   PaymentId = UD.PaymentId,
                                                                   PaymentDate = UD.PaymentDate,
                                                                   UserId = UD.UserId,
                                                                   PaymentMethod = UD.PaymentMethod,
                                                                   Discount = UD.Discount,
                                                                   TotalOrder = UD.TotalOrder,
                                                                   Type = UD.Type
                                                               }).ToListAsync();
                                userInvoiceListResponse.UserInvoices = userInvoiceResult;
                            }
                            else
                            {
                                var userInvoiceResult = await (from UD in db.Payments
                                                               where UD.UserId == userId

                                                               select new UserInvoice
                                                               {
                                                                   PaymentId = UD.PaymentId,
                                                                   PaymentDate = UD.PaymentDate,
                                                                   UserId = UD.UserId,
                                                                   PaymentMethod = UD.PaymentMethod,
                                                                   Discount = UD.Discount,
                                                                   TotalOrder = UD.TotalOrder,
                                                                   Type = UD.Type,
                                                               }).Take(2).ToListAsync();
                                userInvoiceListResponse.UserInvoices = userInvoiceResult;
                            }

                            userInvoiceListResponse.Email = loggedInUser;

                        }
                        else
                        {
                            userInvoiceListResponse.Success = false;
                            userInvoiceListResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                    else
                    {
                        userInvoiceListResponse.Success = false;
                        userInvoiceListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userInvoiceListResponse.Success = false;
                userInvoiceListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userInvoiceListResponse;
        }

        public async Task<UserTicketListResponse> GetUserTicket(bool viewAll)
        {
            try
            {
                userTicketListResponse = new UserTicketListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {

                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    //var loggedInUser = "saddamhusaainwins@gmail.com";
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {

                            if (viewAll)
                            {
                                var userTicketResult = await (from UT in db.Tickets
                                                              where UT.UserId == userId
                                                              orderby UT.TicketId descending
                                                              select new UserTicket
                                                              {
                                                                  UserId = UT.UserId,
                                                                  CreatedDate = UT.CreatedDate,
                                                                  Department = UT.Department,
                                                                  Status = UT.Status,
                                                                  Subject = UT.Subject,
                                                                  Priority = UT.Priority,
                                                                  TicketId = UT.TicketId

                                                              }).ToListAsync();
                                userTicketListResponse.UserTickets = userTicketResult;
                            }
                            else
                            {
                                var userTicketResult = await (from UT in db.Tickets
                                                              where UT.UserId == userId
                                                              orderby UT.TicketId descending
                                                              select new UserTicket
                                                              {
                                                                  UserId = UT.UserId,
                                                                  CreatedDate = UT.CreatedDate,
                                                                  Department = UT.Department,
                                                                  Status = UT.Status,
                                                                  Subject = UT.Subject,
                                                                  Priority = UT.Priority,
                                                                  TicketId = UT.TicketId

                                                              }).Take(2).ToListAsync();
                                userTicketListResponse.UserTickets = userTicketResult;
                            }

                        }
                        else
                        {
                            userTicketListResponse.Success = false;
                            userTicketListResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                    else
                    {
                        userTicketListResponse.Success = false;
                        userTicketListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userInvoiceListResponse.Success = false;
                userInvoiceListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userTicketListResponse;
        }

        public async Task<MultipleFaceBiometricsListResponse> GetMultipleFaceBiometricsByHitRecordRecordId(int hitRecordRecordId)
        {
            try
            {
                multipleFaceBiometricsListResponse = new MultipleFaceBiometricsListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT \"public\".\"fn_getSearachFaceImages\"(" + hitRecordRecordId + ")";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var hitRecordJsonStringResult = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                        multipleFaceBiometricsListResponse.MultipleFaceBiometrics = Newtonsoft.Json.JsonConvert.DeserializeObject<List<HitRecordResult>>(hitRecordJsonStringResult);
                    }

                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                multipleFaceBiometricsListResponse.Success = false;
                multipleFaceBiometricsListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return multipleFaceBiometricsListResponse;
        }

        public async Task<ImageWithLinksResponse> GetFaceLinks(ImageNameRequest ImageNameRequest)
        {
            try
            {
                imageWithLinksResponse = new ImageWithLinksResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT \"public\".\"fn_getImagesURLs\"('" + String.Join(",", ImageNameRequest.ids) + "')";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var FaceLinksJsonStringResult = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                        imageWithLinksResponse.ImageWithLinks = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ImageWithLink>>(FaceLinksJsonStringResult);
                    }
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                imageWithLinksResponse.Success = false;
                imageWithLinksResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return imageWithLinksResponse;
        }

        public async Task<BaseResponse> SaveDMCALinks(RemoveableImageLinksRequest removeableImageLinksRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {

                            foreach (var removeableImageLinks in removeableImageLinksRequest.RemoveableImageLinks)
                            {
                                DMCARemovalLink DMCARemovalLink = new DMCARemovalLink();
                                DMCARemovalLink.Url = removeableImageLinks;
                                DMCARemovalLink.UserId = userId;
                                DMCARemovalLink.dmca_required = true;
                                DMCARemovalLink.dmca_count = 0;
                                DMCARemovalLink.CreatedDate = DateTime.Now;
                                db.DMCARemovalLinks.Add(DMCARemovalLink);

                            }
                            await db.SaveChangesAsync();

                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<SavePaymentReponse> SavePaymentDetails(PaymentDetailsRequest paymentDetailsRequest)
        {
            try
            {
                savePaymentReposne = new SavePaymentReponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            if (paymentDetailsRequest.PaymentDetails != null)
                            {
                                Payment payment = new Payment();


                                payment.PackageId = Convert.ToInt32(paymentDetailsRequest.PaymentDetails.PackageId);
                                payment.CouponId = paymentDetailsRequest.PaymentDetails.CouponId;
                                payment.Status = 0;
                                payment.Type = paymentDetailsRequest.PaymentDetails.Type;
                                payment.Discount = paymentDetailsRequest.PaymentDetails.Discount;
                                payment.SubTotal = paymentDetailsRequest.PaymentDetails.SubTotal;
                                payment.TotalOrder = paymentDetailsRequest.PaymentDetails.TotalOrder;
                                payment.UserId = userId;
                                payment.PaymentMethod = paymentDetailsRequest.PaymentDetails.PaymentMethod;
                                payment.PaymentDate = DateTime.Now;
                                payment.LinksCount = Convert.ToInt32(paymentDetailsRequest.PaymentDetails.LinksCount);
                                payment.SalesTax = paymentDetailsRequest.PaymentDetails.SalesTax;
                                db.Payments.Add(payment);
                                await db.SaveChangesAsync();

                                if (paymentDetailsRequest.SelectedLinkDetail != null)
                                {
                                    foreach (var LinkDetail in paymentDetailsRequest.SelectedLinkDetail)
                                    {
                                        DMCARemovalLink DMCARemovalLink = new DMCARemovalLink();
                                        DMCARemovalLink.Url = LinkDetail.Url;
                                        DMCARemovalLink.SiteId = LinkDetail.SiteId;
                                        DMCARemovalLink.UserId = userId;
                                        DMCARemovalLink.PaymentId = payment.PaymentId;
                                        DMCARemovalLink.dmca_required = true;
                                        DMCARemovalLink.dmca_count = 0;
                                        DMCARemovalLink.CreatedDate = DateTime.Now;
                                        db.DMCARemovalLinks.Add(DMCARemovalLink);
                                    }
                                    await db.SaveChangesAsync();
                                }

                                if (paymentDetailsRequest.PlanDetails != null)
                                {
                                    // Save Package Detail
                                    UserDetail userDetail = new UserDetail();
                                    userDetail.PackageId = Convert.ToInt32(paymentDetailsRequest.PlanDetails.SelectPackageId);
                                    userDetail.UserId = userId;
                                    userDetail.PackagePrice = float.Parse(paymentDetailsRequest.PlanDetails.SelectPackPrice);
                                    userDetail.Active = "N";
                                    userDetail.PaymentId = payment.PaymentId;
                                    userDetail.CreatedDate = DateTime.Now;
                                    db.UserDetails.Add(userDetail);
                                    await db.SaveChangesAsync();

                                    savePaymentReposne.PaymentId = payment.PaymentId;
                                }


                                // when payment type is amazon
                                if (paymentDetailsRequest.PaymentDetails.PaymentMethod == "Amazon")
                                {
                                    if (paymentDetailsRequest.PaymentDetails.Type == "Search")
                                    {
                                        string sellerNote = "FACE RECOGNITION : " + paymentDetailsRequest.PlanDetails.SearchAllowed + " Search $ " + paymentDetailsRequest.PlanDetails.SelectPackPrice + " USD";
                                        var response = AmazonRecurringPayment(payment.PaymentId, paymentDetailsRequest.amazonBillingAgreementId, payment.TotalOrder, sellerNote);
                                        if (response.Success)
                                        {
                                            PayDetailsRequest payDetailsRequest = new PayDetailsRequest();
                                            payDetailsRequest.PaymentId = payment.PaymentId;
                                            payDetailsRequest.TrackingNumber = response.Message;
                                            payDetailsRequest.Amount = (double)payment.TotalOrder;
                                            payDetailsRequest.Source = "P";
                                            await SavePayDetail(payDetailsRequest);

                                            await FRUpdatePaymentDetail(payment.PaymentId);
                                        }
                                        else
                                        {
                                            savePaymentReposne.Success = false;
                                            savePaymentReposne.Message = CustomErrorMessages.PAYMENT_ERROR;
                                            return savePaymentReposne;
                                        }
                                    }
                                    else
                                    {
                                        string sellerNote = payment.LinksCount + " LINK REMOVAL $ " + (payment.LinksCount * 50) + " USD";
                                        savePaymentReposne.AmazonParamters = FacePinPoint.Repository.Repository.AccountRepository.AddRequiredParameters(paymentDetailsRequest.PaymentDetails.TotalOrder.ToString(), ApplicationConfiguration.DEFAULT_CURRENCY, sellerNote, payment.PaymentId, false);
                                    }
                                }
                                savePaymentReposne.PaymentId = payment.PaymentId;
                            }
                            else
                            {
                                savePaymentReposne.Success = false;
                                savePaymentReposne.Message = CustomErrorMessages.INVALID_INPUTS;
                                return savePaymentReposne;
                            }
                        }
                        else
                        {
                            savePaymentReposne.Success = false;
                            savePaymentReposne.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    savePaymentReposne.Success = false;
                    savePaymentReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                savePaymentReposne.Success = false;
                savePaymentReposne.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return savePaymentReposne;
        }

        public async Task<int> SaveTickets(TicketRequest ticketRequest)
        {
            Ticket ticket = new Ticket();
            var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
            if (!string.IsNullOrEmpty(loggedInUser))
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                    if (userId > 0)
                    {

                        ticket.Email = ticketRequest.Email;
                        ticket.Message = ticketRequest.Message;
                        ticket.Subject = ticketRequest.Subject;
                        ticket.Department = ticketRequest.Department;
                        ticket.Priority = ticketRequest.Priority;
                        ticket.UserId = userId;
                        ticket.Status = 1;
                        ticket.Active = "Y";
                        ticket.CreatedDate = DateTime.Now;
                        db.Tickets.Add(ticket);
                        await db.SaveChangesAsync();
                    }
                }
            }
            return ticket.TicketId;
        }

        public async Task<int> SaveDocument(Document documentRequest)
        {
            Document document = new FacePinPoint.Repository.Document();
            using (FacepinpointDBEntities db = new FacepinpointDBEntities())
            {
                document.DocumentName = documentRequest.DocumentName;
                document.DocumentType = "Ticket";
                document.DocumentPath = documentRequest.DocumentPath;
                document.RequiresSignature = 0;
                document.Active = "Y";
                document.CreatedDate = DateTime.Now;
                db.Documents.Add(document);
                await db.SaveChangesAsync();
            }
            return document.DocumentId;
        }

        public async Task<int> SaveTicketAttachment(TicketAttachment ticketAttachmentRequest)
        {
            TicketAttachment ticketAttachment = new TicketAttachment();
            using (FacepinpointDBEntities db = new FacepinpointDBEntities())
            {
                ticketAttachment.DocumentId = ticketAttachmentRequest.DocumentId;
                ticketAttachment.TicketId = ticketAttachmentRequest.TicketId;
                ticketAttachment.CreatedDatetime = DateTime.Now;
                ticketAttachment.Active = "Y";
                db.TicketAttachments.Add(ticketAttachment);
                await db.SaveChangesAsync();
            }
            return ticketAttachment.TicketAttachmentId;
        }


        public async Task<DMCALinksResponse> GetDMCARemovalLinks()
        {
            try
            {
                DMCALinksResponse = new DMCALinksResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            var SQL_query = "SELECT \"public\".\"FN_GetUserDMCALinks\"(" + userId + ") AS json";
                            var LinksJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();

                            var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<DMCALinksResponse>(LinksJson.json);
                            DMCALinksResponse.DMCALinks = resultJson.DMCALinks;
                            DMCALinksResponse.AccessDMCANotice = resultJson.AccessDMCANotice;
                        }
                        else
                        {
                            DMCALinksResponse.Success = false;
                            DMCALinksResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    DMCALinksResponse.Success = false;
                    DMCALinksResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                DMCALinksResponse.Success = false;
                DMCALinksResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return DMCALinksResponse;
        }

        public async Task<DMCALinksResponse> GetLegalActionRemovalLinks()
        {
            try
            {
                DMCALinksResponse = new DMCALinksResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                //var loggedInUser = "neerajsainiwins@gmail.com";
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            DMCALinksResponse.DMCALinks = await db.DMCARemovalLinks.Where(x => x.UserId == userId && x.LegalAction != null)
                                .Select(x => new FacePinPoint.Entities.Response.DMCALink
                                {
                                    UserId = x.UserId,
                                    Url = x.Url,
                                    CreatedDate = x.CreatedDate,
                                    LegalAction = x.LegalAction,
                                    LinkId = x.LinkId
                                }).ToListAsync();
                        }
                        else
                        {
                            DMCALinksResponse.Success = false;
                            DMCALinksResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    DMCALinksResponse.Success = false;
                    DMCALinksResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                DMCALinksResponse.Success = false;
                DMCALinksResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return DMCALinksResponse;
        }

        private string saveImageInFolder(string img, string type)
        {
            byte[] imageBytes = Convert.FromBase64String(img);
            MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length);

            // Convert byte[] to Image
            ms.Write(imageBytes, 0, imageBytes.Length);
            System.Drawing.Image image = System.Drawing.Image.FromStream(ms, true);

            string newFile = "";

            if (type == "PNG")
            {
                newFile = Guid.NewGuid().ToString() + ".png";
            }
            else
            {
                newFile = Guid.NewGuid().ToString() + ".jpg";
            }


            var FilePath = "~/Uploads/Photos";
            var path = Path.Combine(HttpContext.Current.Server.MapPath(FilePath), newFile);

            bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(FilePath));

            if (!exists)
            {
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(FilePath));
            }

            //string filePath = Path.Combine(Server.MapPath("~/Assets/") + Request.QueryString["id"] + "/", newFile);

            if (type == "PNG")
            {
                image.Save(path, ImageFormat.Png);
            }
            else
            {
                image.Save(path, ImageFormat.Jpeg);
            }
            //string imageDataURL = string.Format("data:image/png;base64,{0}", img);
            ////saving the imageURL in a folder

            //File.Create(path);// you missed this line and also use the proper exception catching
            return path;

        }

        public async Task<BaseResponse> CheckOldPassword(string OldPassword)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        system_user system_user = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();
                        if (system_user != null)
                        {
                            var decryptPassword = AesEncryptionDecryption.Decrypt(system_user.password);

                            if (decryptPassword == OldPassword)
                            {
                                baseResponse.Success = true;
                            }
                            else
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = CustomErrorMessages.OLDPASSWORD_NOTMATCHED;
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }

                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> EmailDMCANotice(DMCANoticeEmailRequest DMCANoticeEmailRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    var loggedInUser = "saddamhusaainwins@gmail.com";
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getdmcanotice\"('" + loggedInUser + "', '" + DMCANoticeEmailRequest.siteName + "', 'DMCA Notice') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='DMCA Notice'").FirstOrDefaultAsync();
                        mailContent = new MailContent();
                        mailContent.ToEmail = await db.AppConfigurations.Where(x => x.SiteName == DMCANoticeEmailRequest.siteName).Select(x => x.SupportEmail).FirstOrDefaultAsync();
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> EmailLawyerLetter(LawyerLetterEmailRequest lawyerLetterEmailRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    var loggedInUser = "saddamhusaainwins@gmail.com";
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getLawyerLetter\"('Lawyer Letter Removal Second Attempt', '" + loggedInUser + "', '" + lawyerLetterEmailRequest.siteName + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Lawyer Letter Removal Second Attempt'").FirstOrDefaultAsync();
                        mailContent = new MailContent();
                        mailContent.ToEmail = await db.AppConfigurations.Where(x => x.SiteName == lawyerLetterEmailRequest.siteName).Select(x => x.AgentEmail).FirstOrDefaultAsync();
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }


        public async Task<BaseResponse> SaveEnquiry(EnquiryRequest enquiryRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            FacePinPoint.Repository.LegalEnquiry legalEnquiry = new FacePinPoint.Repository.LegalEnquiry();
                            legalEnquiry.UserId = userId;
                            legalEnquiry.Message = enquiryRequest.Message;
                            db.LegalEnquiries.Add(legalEnquiry);
                            await db.SaveChangesAsync();

                            // Email sent to user
                            var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='User_Enquiry'").FirstOrDefaultAsync();
                            mailContent = new MailContent();
                            mailContent.ToEmail = loggedInUser;
                            mailContent.MsgSubject = templateResponse.Subject;
                            mailContent.MsgBody = templateResponse.Template;
                            EmailSender.MailSender(mailContent);

                            // Email sent to FPP
                            templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_GetEnqTick\"('FPP_Enquiry','" + loggedInUser + "','" + enquiryRequest.Message + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='FPP_Enquiry'").FirstOrDefaultAsync();
                            mailContent.ToEmail = ApplicationConfiguration.EMAIL_RECEIVER;
                            mailContent.MsgSubject = templateResponse.Subject;
                            mailContent.MsgBody = templateResponse.Template;
                            EmailSender.MailSender(mailContent);

                            baseResponse.Success = true;
                            baseResponse.Message = CustomErrorMessages.ENQUERY_SAVED_SUCCESSFULLY;
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> UpdatePackage(UpdatePackageRequest UpdatePackageRequest)
        {
            try
            {

                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            var q = db.UserDetails.Where(x => x.UserId == userId).FirstOrDefault<UserDetail>();
                            q.Active = "N";
                            db.SaveChanges();

                            UserDetail userDetail = new UserDetail();
                            userDetail.PackagePrice = UpdatePackageRequest.PackagePrice;
                            userDetail.PackageId = Convert.ToInt32(UpdatePackageRequest.PackageId);
                            userDetail.CreatedDate = DateTime.Now;
                            userDetail.UserId = userId;
                            db.UserDetails.Add(userDetail);
                            await db.SaveChangesAsync();

                            baseResponse.Success = true;
                            baseResponse.Message = CustomErrorMessages.PLAN_UPDATED_SUCCESSFULLY;
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;

        }


        public async Task<Stream> DownloadInvoice(int InvoiceId)
        {
            var output = new MemoryStream();
            try
            {
                //baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                    if (userId > 0)
                    {
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_Get_Invoice\"('Invoices', " + InvoiceId + ",'" + loggedInUser + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Invoices'").FirstOrDefaultAsync();
                        var LogoPath = HttpContext.Current.Server.MapPath("~/Uploads/Logo/fpp_logo.jpg");
                        var Stamp = HttpContext.Current.Server.MapPath("~/Uploads/Logo/Facepinpoint_stamp.png");

                        StringReader sr = new StringReader(templateResponse.Template.ToString());
                        iTextSharp.text.Document pdfDoc = new iTextSharp.text.Document(PageSize.A4, 10f, 10f, 105f, 0f);
                        iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(LogoPath);
                        jpg.Alignment = Element.ALIGN_TOP;
                        jpg.ScaleAbsolute(220f, 130f);
                        jpg.SetAbsolutePosition(340f, 700f);

                        iTextSharp.text.Image stamp = iTextSharp.text.Image.GetInstance(Stamp);
                        //stamp.Alignment = Element.ALIGN_TOP;
                        stamp.ScaleAbsolute(80f, 80f);
                        stamp.SetAbsolutePosition(420f, 200f);


                        var writer = PdfWriter.GetInstance(pdfDoc, output);
                        writer.CloseStream = false;

                        pdfDoc.Open();
                        pdfDoc.Add(jpg);
                        pdfDoc.Add(stamp);

                        XMLWorkerHelper.GetInstance().ParseXHtml(writer, pdfDoc, sr);
                        pdfDoc.Close();

                        output.Seek(0, SeekOrigin.Begin);
                    }

                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                //baseResponse.Success = false;
                //baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            //return baseResponse;
            return output;
        }
        public async Task<BaseResponse> DeactiveUserStatus()
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            var SU = db.system_user.Where(x => x.id == userId).FirstOrDefault<system_user>();
                            SU.enabled = "0";
                            db.SaveChanges();

                            var q = db.UserDetails.Where(x => x.UserId == userId).FirstOrDefault<UserDetail>();
                            q.Active = "N";
                            db.SaveChanges();

                            baseResponse.Success = true;
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public IsCurrentUserEmailResponse IsCurrentUserEmail(string email)
        {
            try
            {
                isCurrentUserEmailResponse = new IsCurrentUserEmailResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (loggedInUser == email)
                {
                    isCurrentUserEmailResponse.IsCurrentUserEmail = true;
                }
                else
                {
                    isCurrentUserEmailResponse.IsCurrentUserEmail = false;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return isCurrentUserEmailResponse;
        }

        public async Task<IsCurrentUserPasswordResponse> IsCurrentUserPassword(string password)
        {
            try
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        isCurrentUserPasswordResponse = new IsCurrentUserPasswordResponse();

                        string systemUserPassword = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.password).FirstOrDefaultAsync();
                        var DecryptedPassword = AesEncryptionDecryption.Decrypt(systemUserPassword);

                        if (password == DecryptedPassword)
                        {
                            isCurrentUserPasswordResponse.IsCurrentUserPassword = true;
                        }
                        else
                        {
                            isCurrentUserPasswordResponse.IsCurrentUserPassword = false;
                        }
                    }
                    else
                    {
                        isCurrentUserPasswordResponse.IsCurrentUserPassword = false;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return isCurrentUserPasswordResponse;
        }

        public async Task<BaseResponse> GenerateDMCANotice(DMCANoticeGenerateRequest DMCAnoticeGenerateRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            var SQL_query = "SELECT \"public\".\"FN_GernateDMCANotice\"(" + userId + ") AS json";
                            var SitesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();

                            if (SitesJson != null)
                            {
                                var SiteResults = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SiteDetail>>(SitesJson.json);

                                int DocumentCount = 0;

                                foreach (var row in SiteResults)
                                {
                                    // DMCA LETTER GENERATION
                                    string test = "SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_getDMCAnotice\"( " + userId + ",'" + DMCAnoticeGenerateRequest.FirstName + " " + DMCAnoticeGenerateRequest.LastName + "','" + DMCAnoticeGenerateRequest.Email + "'," + row.SiteId + "," + row.SiteName + "','" + row.WebsiteAddress + "','DMCA Notice') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='DMCA Notice'";
                                    var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_getDMCAnotice\"( " + userId + ",'" + DMCAnoticeGenerateRequest.FirstName + " " + DMCAnoticeGenerateRequest.LastName + "','" + DMCAnoticeGenerateRequest.Email + "'," + row.SiteId + ",'" + row.SiteName + "','" + row.WebsiteAddress + "','DMCA Notice') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='DMCA Notice'").FirstOrDefaultAsync();

                                    pdfresponse = new PdfResponse();
                                    pdfresponse = AccountRepository.PdfGeneration(templateResponse.Template.ToString(), "LINK_REMOVAL");

                                    var SaveDMCADocument_query = "SELECT \"public\".\"FN_SaveDMCADocument\"(" + userId + ", '" + pdfresponse.Filename + "', '" + pdfresponse.FilePath + "', " + row.SiteId + " , " + row.Count + ") AS json";
                                    var SaveDMCADocumentJson = await db.Database.SqlQuery<Boolean>(SaveDMCADocument_query).FirstOrDefaultAsync();

                                    // DUNNING LETTER GENERATION
                                    templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getsecondattempt\"( " + userId + ",'" + DMCAnoticeGenerateRequest.FirstName + " " + DMCAnoticeGenerateRequest.LastName + "','" + DMCAnoticeGenerateRequest.Email + "', 'Lawyer Letter Removal Second Attempt'," + row.SiteId + ") AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Lawyer Letter Removal Second Attempt'").FirstOrDefaultAsync();
                                    pdfresponse = AccountRepository.PdfGeneration(templateResponse.Template.ToString(), "DUNNING");

                                    var SaveDunningDocument_query = "SELECT \"public\".\"FN_SaveDunningLetterDocument\"(" + userId + ", '" + pdfresponse.Filename + "', '" + pdfresponse.FilePath + "', " + row.SiteId + ") AS json";
                                    var SaveDunningDocumentJson = await db.Database.SqlQuery<Boolean>(SaveDunningDocument_query).FirstOrDefaultAsync();

                                    DocumentCount = DocumentCount + 2;
                                }

                                baseResponse.Success = true;
                                baseResponse.Message = (DocumentCount + 1).ToString();

                            }
                            else
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = null;
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<PayDMCANoticeList> GetDMCADocuments()
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    payDMCANoticeList = new PayDMCANoticeList();
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            var DocumentsType = new List<string> { "DMCA", "DUNNING" };
                            payDMCANoticeList.PayDMCANotice = await (from p in db.UserDocuments
                                                                     join P in db.Documents on p.DocumentId equals P.DocumentId
                                                                     where p.UserId == userId
                                                                     && DocumentsType.Contains(P.DocumentType)
                                                                     select new PayDMCANotice
                                                                     {
                                                                         DocumentId = P.DocumentId,
                                                                         UserDocumentId = p.UserDocumentId,
                                                                         DocumentName = P.DocumentName,
                                                                         DocumentPath = P.DocumentPath,
                                                                         DocumentType = P.DocumentType,
                                                                         RequiresSignature = P.RequiresSignature,
                                                                         Subject = p.Subject,
                                                                         Signed = p.Signed,
                                                                         DocumentDate = P.CreatedDate
                                                                     }).ToListAsync();

                            payDMCANoticeList.PendingSignDocument = await (from UD in db.UserDocuments
                                                                           where UD.UserId == userId && UD.Signed == 0
                                                                           select UD.UserDocumentId
                                                                        ).CountAsync();

                            int count = await (from DR in db.DMCARemovalLinks
                                               where DR.UserId == userId && DR.DMCADocumentId == null && DR.SiteId > 0
                                               select DR.LinkId
                                    ).CountAsync();

                            payDMCANoticeList.AccessDMCANotice = (count > 0) ? true : false;
                            payDMCANoticeList.Success = true;
                        }
                        else
                        {
                            payDMCANoticeList.Success = false;
                            payDMCANoticeList.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }

                    else
                    {
                        payDMCANoticeList.Success = false;
                        payDMCANoticeList.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                payDMCANoticeList.Success = false;
                payDMCANoticeList.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return payDMCANoticeList;
        }

        public async Task<CheckUserStatus> CheckStatusOfCurrentUser()
        {
            try
            {
                checkUserStatus = new CheckUserStatus();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        checkUserStatus.UserStatus = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.enabled).FirstOrDefaultAsync();
                        checkUserStatus.Success = true;
                        checkUserStatus.Message = null;
                    }
                }
                else
                {
                    checkUserStatus.Success = false;
                    checkUserStatus.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                checkUserStatus.Success = false;
                checkUserStatus.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return checkUserStatus;
        }

        public async Task<bool> CheckAccessOnNoticeGenerater()
        {
            try
            {

                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                        if (userId > 0)
                        {
                            int count = await (from DR in db.DMCARemovalLinks
                                               where DR.UserId == userId && DR.DMCADocumentId == null && DR.SiteId > 0
                                               select DR.LinkId
                                    ).CountAsync();

                            return (count > 0) ? true : false;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                return false;
            }
        }

        public async Task<TaxResponse> GetLoggedInUserTax()
        {
            try
            {
                taxResponse = new TaxResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var client = new TaxjarApi(ApplicationConfiguration.TAX_JAR_ACCESS_KEY);

                        var systemUser = await db.system_user.Where(x => x.email == loggedInUser && x.Blocked == "N").FirstOrDefaultAsync();
                        if (systemUser.id > 0)
                        {
                            //var rates = client.RatesForLocation(systemUser.ZipCode.ToString(), new { });
                            var tax = client.TaxForOrder(new
                            {
                                from_zip = systemUser.ZipCode.ToString()
                            });
                            taxResponse.combined_rate = tax.Rate;
                        }
                        else
                        {
                            taxResponse.Success = false;
                            taxResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                }
                else
                {
                    taxResponse.Success = false;
                    taxResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                taxResponse.Success = false;
                taxResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return taxResponse;
        }

        public async Task<TaxResponse> GetTax(TaxJarRequest taxJarRequest)
        {
            try
            {
                taxResponse = new TaxResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var client = new TaxjarApi(ApplicationConfiguration.TAX_JAR_ACCESS_KEY);


                    if (!string.IsNullOrEmpty(taxJarRequest.UserEmail))
                    {
                        var systemUser = await db.system_user.Where(x => x.email == taxJarRequest.UserEmail && x.Blocked == "N").FirstOrDefaultAsync();
                        if (systemUser.id > 0)
                        {
                            //var rates = client.RatesForLocation(systemUser.ZipCode.ToString(), new { });
                            var tax = client.TaxForOrder(new
                            {
                                from_zip = systemUser.ZipCode.ToString()
                            });
                            taxResponse.combined_rate = tax.Rate;
                        }
                        else
                        {
                            taxResponse.Success = false;
                            taxResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                    else
                    {
                        taxResponse.Success = false;
                        taxResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                    }
                    taxResponse.Success = true;
                    taxResponse.Message = null;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                taxResponse.Success = false;
                taxResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return taxResponse;
        }

        public async Task<SignResponse> SignDocument(SignDocumentRequest signDocumentRequest)
        {
            try
            {
                signResponse = new SignResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    int userId = await db.system_user.Where(x => x.email == loggedInUser).Select(x => x.id).FirstOrDefaultAsync();
                    if (userId > 0)
                    {
                        SignDocumentResponse signDocumentResponse = new SignDocumentResponse();

                        var DocumentDetail = await (from p in db.UserDocuments
                                                    join P in db.Documents on p.DocumentId equals P.DocumentId
                                                    join S in db.Sites on P.SiteId equals S.SiteId into Sites
                                                    from S in Sites.DefaultIfEmpty()
                                                    where p.UserId == userId && p.UserDocumentId == signDocumentRequest.UserDocumentId
                                                    select new SignDocumentResponse
                                                    {
                                                        DocumentId = P.DocumentId,
                                                        UserDocumentId = p.UserDocumentId,
                                                        DocumentName = P.DocumentName,
                                                        DocumentPath = P.DocumentPath,
                                                        DocumentType = P.DocumentType,
                                                        RequiresSignature = P.RequiresSignature,
                                                        Signed = p.Signed,
                                                        AgentEmail = S.AgentEmail
                                                    }).FirstOrDefaultAsync();

                        if (DocumentDetail.RequiresSignature == 1 && DocumentDetail.Signed == 0)
                        {
                            System.DateTime myDate = DateTime.Now;
                            int year = myDate.Year;
                            int month = myDate.Month;
                            var PartialPath = "/Uploads/Documents/" + year + "/" + month;

                            var FilePath = "~" + PartialPath;

                            bool exists = Directory.Exists(HttpContext.Current.Server.MapPath(FilePath));

                            if (!exists)
                            {
                                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(FilePath));
                            }

                            string FileName = "";

                            switch (DocumentDetail.DocumentType)
                            {
                                case "DMCA":
                                    FileName = "LinkRemoval_" + Guid.NewGuid().ToString() + ".pdf";
                                    break;

                                case "DUNNING":
                                    FileName = "Dunning_" + Guid.NewGuid().ToString() + ".pdf";
                                    break;

                                default:
                                    FileName = "LinkRemoval_" + Guid.NewGuid().ToString() + ".pdf";
                                    break;
                            }

                            var FilePathWithFilename = Path.Combine(HttpContext.Current.Server.MapPath(FilePath), FileName);

                            string path = saveImageInFolder(signDocumentRequest.Base64Image, "PNG");
                            using (Stream inputPdfStream = new FileStream(HttpContext.Current.Server.MapPath("~" + DocumentDetail.DocumentPath), FileMode.Open, FileAccess.Read, FileShare.Read))
                            using (Stream inputImageStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
                            using (Stream outputPdfStream = new FileStream(FilePathWithFilename, FileMode.Create, FileAccess.Write, FileShare.None))
                            {
                                var reader = new PdfReader(inputPdfStream);
                                var stamper = new PdfStamper(reader, outputPdfStream);
                                var pdfContentByte = stamper.GetOverContent(1);

                                Image image = Image.GetInstance(inputImageStream);
                                image.ScaleAbsolute(100f, 80f);
                                image.SetAbsolutePosition(400, 350);
                                pdfContentByte.AddImage(image);
                                stamper.Close();
                            }


                            Document document = await db.Documents.Where(x => x.DocumentId == DocumentDetail.DocumentId).FirstOrDefaultAsync();
                            document.DocumentPath = PartialPath + "/" + FileName;
                            document.DocumentName = FileName;
                            await db.SaveChangesAsync();

                            UserDocument userdocument = await db.UserDocuments.Where(x => x.UserDocumentId == DocumentDetail.UserDocumentId).FirstOrDefaultAsync();
                            userdocument.Signed = 1;
                            userdocument.SignedDate = DateTime.Now;
                            await db.SaveChangesAsync();

                            FileInfo file = new FileInfo(HttpContext.Current.Server.MapPath(DocumentDetail.DocumentPath));
                            if (file.Exists)
                            {
                                file.Delete();
                            }


                            if (DocumentDetail.DocumentType == "DMCA")
                            {
                                var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "DMCA Notice Email").FirstOrDefaultAsync();

                                mailContent = new MailContent();
                                mailContent.ToEmail = DocumentDetail.AgentEmail;

                                string[] attachments = new string[] { FilePathWithFilename };
                                mailContent.MsgSubject = templateResponse.Subject;
                                mailContent.MsgBody = templateResponse.Template;
                                mailContent.Attachments = attachments;
                                EmailSender.MailSender(mailContent);
                            }

                            signResponse.Success = true;
                            signResponse.DocumentPath = PartialPath + "/" + FileName;
                            signResponse.TypeOfDocument = DocumentDetail.DocumentType;
                        }
                        else
                        {
                            signResponse.Success = false;
                            signResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                signResponse.Success = false;
                signResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return signResponse;

        }


        public async Task<BaseResponse> SavePayDetail(PayDetailsRequest payDetailsRequest)
        {
            try
            {
                baseResponse = new BaseResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //PaymentDetail paymentDetail = new PaymentDetail();
                    //paymentDetail.PayerEmailId = payDetailsRequest.PayerEmailId;
                    //paymentDetail.Source = payDetailsRequest.Source;
                    //paymentDetail.TrackingNumber = payDetailsRequest.TrackingNumber;
                    //paymentDetail.Amount = (float)payDetailsRequest.Amount;
                    //paymentDetail.PaymentId = payDetailsRequest.PaymentId;
                    //paymentDetail.Processed = "N";
                    //paymentDetail.CreatedDate = DateTime.Now;
                    //db.PaymentDetails.Add(paymentDetail);

                    //Payment payment = await db.Payments.Where(x => x.PaymentId == payDetailsRequest.PaymentId).FirstOrDefaultAsync();
                    //payment.TrackingNumber = payDetailsRequest.TrackingNumber;

                    //await db.SaveChangesAsync();

                    //public.FN_SaveTemporaryPayment("PayerEmail" text, "Source character, TrackingNumber text, PaymentId int)

                    await db.Database.SqlQuery<JsonRespone>("SELECT \"public\".\"FN_SaveTemporaryPayment\"('" + payDetailsRequest.PayerEmailId + "', '" + payDetailsRequest.Source + "', " + (float)payDetailsRequest.Amount + ", '" + payDetailsRequest.TrackingNumber + "', " + payDetailsRequest.PaymentId + ")").FirstOrDefaultAsync();

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> UpdatePaymentDetail(int paymentId)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {

                    //// changing payment status to 1
                    //Payment payment = await db.Payments.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //payment.Status = 1;

                    //// change paymentDetail to Y
                    //PaymentDetail paymentDetail = await db.PaymentDetails.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //paymentDetail.Processed = "Y";

                    //// change UserDetails Active to Y
                    //UserDetail userDetail = await db.UserDetails.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //userDetail.Active = "Y";

                    //await db.SaveChangesAsync();

                    // var packageName = await db.Packages.Where(x => x.PackageId == userDetail.PackageId && x.Active=="Y").Select(x=>x.Type).FirstOrDefaultAsync();

                    var Status = "";
                    var result = await db.Database.SqlQuery<JsonRespone>("SELECT \"public\".\"FN_UpdatePayementDetail\"(" + paymentId + ") as json").FirstOrDefaultAsync();
                    if (result != null)
                    {
                        PaymentFunctionResponse paymentFunctionResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<PaymentFunctionResponse>(result.json);

                        if (paymentFunctionResponse.PType == "DMCA")
                        {
                            //var DR = db.DMCARemovalLinks.Where(x => x.UserId == userDetail.UserId && x.PaymentId == paymentId).ToList<DMCARemovalLink>();
                            //DR.ForEach(a => a.Status = "P");

                            Status = "0";
                        }
                        else
                        {
                            if (paymentFunctionResponse.UBID > 0)
                            {
                                await InvokeUserSearch(paymentFunctionResponse.UBID, paymentFunctionResponse.UEmail);
                            }
                            Status = "1";
                        }

                        // change system_user to enable 
                        system_user system_user = await db.system_user.Where(x => x.id == paymentFunctionResponse.UID).FirstOrDefaultAsync();
                        system_user.enabled = Status;

                        await db.SaveChangesAsync();

                        string Password = AesEncryptionDecryption.Decrypt(system_user.password);

                        string TemplateName = (Status == "1") ? "SignUp" : "DMCA SignUp";
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getSignUpTemplate\"('" + TemplateName + "', '" + system_user.email + "', '" + Password + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='" + TemplateName + "'").FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = system_user.email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> DMCAUpdatePaymentDetail(int paymentId)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //// changing payment status to 1
                    //Payment payment = await db.Payments.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //payment.Status = 1;

                    //// change paymentDetail to Y
                    //PaymentDetail paymentDetail = await db.PaymentDetails.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //paymentDetail.Processed = "Y";

                    //var DR = db.DMCARemovalLinks.Where(x => x.UserId == payment.UserId && x.PaymentId == paymentId).ToList<DMCARemovalLink>();
                    //DR.ForEach(a => a.Status = "P");

                    //await db.SaveChangesAsync();

                    await db.Database.SqlQuery<JsonRespone>("SELECT \"public\".\"FN_UpdatePayementDetail\"(" + paymentId + ") as json").FirstOrDefaultAsync();

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> FRUpdatePaymentDetail(int paymentId)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //// changing payment status to 1
                    //Payment payment = await db.Payments.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //payment.Status = 1;

                    //// change paymentDetail to Y
                    //PaymentDetail paymentDetail = await db.PaymentDetails.Where(x => x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //paymentDetail.Processed = "Y";

                    //// change Previous plan to N
                    //var UD =  db.UserDetails.Where(x => x.UserId == payment.UserId).ToList<UserDetail>();
                    //UD.ForEach(a => a.Active = "N");

                    //// change UserDetails Active to Y
                    //UserDetail userDetail = await db.UserDetails.Where(x => x.UserId == payment.UserId && x.PaymentId == paymentId).FirstOrDefaultAsync();
                    //userDetail.Active = "Y";

                    //var UserDetail = await (from SU in db.system_user
                    //                        join UB in db.userbiometrics on SU.email equals UB.email
                    //                        where SU.id == userDetail.UserId
                    //                        select new UserDetailWithBiometricResponse
                    //                        {
                    //                            UserId = SU.id,
                    //                            UserBiomerticId = UB.id,
                    //                            UserEmail = SU.email
                    //                        }).FirstOrDefaultAsync();

                    var result = await db.Database.SqlQuery<JsonRespone>("SELECT \"public\".\"FN_UpdatePayementDetail\"(" + paymentId + ") as json").FirstOrDefaultAsync();
                    if (result != null)
                    {
                        PaymentFunctionResponse paymentFunctionResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<PaymentFunctionResponse>(result.json);

                        // change system_user to enable 
                        system_user system_user = await db.system_user.Where(x => x.id == paymentFunctionResponse.UID).FirstOrDefaultAsync();
                        system_user.enabled = "1";

                        await db.SaveChangesAsync();

                        if (paymentFunctionResponse.UBID > 0)
                        {
                            await InvokeUserSearch(paymentFunctionResponse.UBID, paymentFunctionResponse.UEmail);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<PaymentDetailResponse> GetPaymentDetailByPaymentId(int paymentId)
        {
            try
            {
                paymentDetailResponse = new PaymentDetailResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    paymentDetailResponse.Processed = await db.PaymentDetails.Where(x => x.PaymentId == paymentId).Select(x => x.Processed).FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                paymentDetailResponse.Success = false;
                paymentDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return paymentDetailResponse;
        }

        public async Task<BaseResponse> InvokeUserSearch(int? UserBiomerticId, string UserEmail)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var reconizeFaceByUserBiometerics = ReconizeFaceByUserBiometericsId(UserBiomerticId);
                    var reconizeFaceByUserBiometericsResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<UserSearchResultData>(reconizeFaceByUserBiometerics.Content);


                    // Sending Mail for Search Results
                    MailContent mailContent = new MailContent();

                    if (reconizeFaceByUserBiometericsResponse.candidateFaceList.Count > 0)
                    {
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_FaceSearchTemplate\"('SEARCH_SUCCESS'," + reconizeFaceByUserBiometericsResponse.candidateFaceList.Count + ") AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='SEARCH_SUCCESS'").FirstOrDefaultAsync();
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;
                    }
                    else
                    {
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_FaceSearchTemplate\"('SEARCH_FAILURE',0) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='SEARCH_FAILURE'").FirstOrDefaultAsync();
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                    }
                    mailContent.ToEmail = UserEmail;
                    EmailSender.MailSender(mailContent);
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public UserEmailResponse GetCurrentUserEmail()
        {
            try
            {
                userEmailResponse = new UserEmailResponse();

                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    userEmailResponse.Email = loggedInUser;
                    userEmailResponse.Success = true;
                    userEmailResponse.Message = null;
                }
                else
                {
                    userEmailResponse.Success = false;
                    userEmailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userEmailResponse.Success = false;
                userEmailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userEmailResponse;
        }

        public async Task<IsUserBlockedResponse> IsUserBlocked()
        {
            try
            {
                isUserBlockedResponse = new IsUserBlockedResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        system_user system_user = await db.system_user.Where(x => x.email == loggedInUser).FirstOrDefaultAsync();
                        if (system_user != null)
                        {
                            if (system_user.Blocked == "Y")
                            {
                                isUserBlockedResponse.Blocked = true;
                            }
                            else
                            {
                                isUserBlockedResponse.Blocked = false;
                            }
                            isUserBlockedResponse.Success = true;
                            isUserBlockedResponse.Message = null;
                        }
                        else
                        {
                            isUserBlockedResponse.Success = false;
                            isUserBlockedResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        isUserBlockedResponse.Success = false;
                        isUserBlockedResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                isUserBlockedResponse.Success = false;
                isUserBlockedResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return isUserBlockedResponse;
        }

        public async Task<BaseResponse> SaveUserEmailRegistration(UserEmailRegistrationRequest userEmailRegistrationRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    bool alreadyExist = await db.UserEmailRegistrations.Where(x => x.Email == userEmailRegistrationRequest.Email).AnyAsync();
                    if (!alreadyExist)
                    {
                        string updateSqlQuery = "SELECT public.\"FN_InsertUserEmailRegistration\"('" + userEmailRegistrationRequest.Email + "') as json";
                        await db.Database.SqlQuery<bool>(updateSqlQuery).FirstOrDefaultAsync();

                        var templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_getInstantRegistrationEmail\"('User_Registration_Email', '" + userEmailRegistrationRequest.Email + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='User_Registration_Email'").FirstOrDefaultAsync();
                        mailContent = new MailContent();
                        mailContent.ToEmail = userEmailRegistrationRequest.Email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;
                        EmailSender.MailSender(mailContent);
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.USER_ALREADY_EXIST;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> UserEmailRegistrationToken(string token)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    UserEmailRegistrationToken userEmailRegistrationToken = EncodeDecodeForgetPasswordToken.DecrypteUserEmailRegistrationToken(token);

                    var UserRegisteration = await db.UserEmailRegistrations.Where(x => x.UserEmailRegistrationId == userEmailRegistrationToken.UserEmailRegistrationId && x.Email == userEmailRegistrationToken.Email && x.IsProcessed == true).FirstOrDefaultAsync();
                    if (UserRegisteration != null)
                    {
                        baseResponse.Success = true;
                        baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public FaceBookPostsBaseResponse GetFaceBookPosts(FaceBookRequest faceBookRequest)
        {
            try
            {
                faceBookPostsBaseResponse = new FaceBookPostsBaseResponse();
                IRestResponse accessTokenResponse = GetFaceBookAccessToken(ApplicationConfiguration.AppId, ApplicationConfiguration.AppSecret);
                FaceBookAccessToken faceBookAccessToken = Newtonsoft.Json.JsonConvert.DeserializeObject<FaceBookAccessToken>(accessTokenResponse.Content);

                IRestResponse facebookPostResultResponse = GetFacebookPostResult(faceBookRequest.after, faceBookRequest.before, faceBookRequest.limit, faceBookAccessToken.access_token);
                faceBookPostsBaseResponse.faceBookPostsList = Newtonsoft.Json.JsonConvert.DeserializeObject<FaceBookPostsList>(facebookPostResultResponse.Content);

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                faceBookPostsBaseResponse.Success = false;
                faceBookPostsBaseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;

            }
            return faceBookPostsBaseResponse;
        }
        public IRestResponse GetFaceBookAccessToken(string AppId, string ClientSecret)
        {
            string url = "https://graph.facebook.com/oauth/access_token?client_id=" + AppId + "&client_secret=" + ClientSecret + "&grant_type=client_credentials";
            var client = new RestClient(url);
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse GetFacebookPostResult(string after, string before, int limit, string accessToken)
        {
            string url = "https://graph.facebook.com/facepinpoint/posts?fields=full_picture%2Cpicture%2Clink%2Cmessage%2Ccreated_time%2Cpermalink_url%2Cdescription&limit=" + limit + "&access_token=" + accessToken;
            if (after != null)
            {
                url += "&after=" + after;
            }
            else if (before != null)
            {
                url += "&before=" + before;
            }
            
            var client = new RestClient(url);
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        #endregion

        #region Amazon
        public static string AddRequiredParameters(string Amount, string CurrencyCode, string SellerNote, int PaymentId, bool signup)
        {
            if (String.IsNullOrEmpty(ApplicationConfiguration.SELLER_ID))
                throw new ArgumentNullException("sellerId", "sellerId is NULL, set the value in the configuration file ");
            if (String.IsNullOrEmpty(ApplicationConfiguration.ACCESS_KEY))
                throw new ArgumentNullException("accessKey", "accessKey is NULL, set the value in the configuration file ");
            if (String.IsNullOrEmpty(ApplicationConfiguration.SECRET_KEY))
                throw new ArgumentNullException("secretKey", "secretKey is NULL, set the value in the configuration file ");
            if (String.IsNullOrEmpty(ApplicationConfiguration.LWACLIENT_ID))
                throw new ArgumentNullException("lwaClientId", "lwaClientId is NULL, set the value in the configuration file ");

            string amount = Amount;

            /* Add http:// or https:// before your Return URL
             * Return URL - The webpage of your site where the buyer should be redirected to after the payment is successful.
             * Cancel Return URL - The webpage of your site where the buyer should be redirected to if the buyer abandons the checkout
             * or the transaction fails.
             */
            string returnURL = "";
            string cancelReturnURL = "";
            if (signup)
            {
                returnURL = ApplicationConfiguration.FPP_APIURL + "/PaymentConfirmationAmazon.aspx?status=success";
                cancelReturnURL = ApplicationConfiguration.FPP_APIURL + "/PaymentConfirmationAmazon.aspx?status=cancel";
            }
            else
            {
                returnURL = ApplicationConfiguration.FPP_APIURL + "/DMCAPaymentAmazon.aspx?status=success";
                cancelReturnURL = ApplicationConfiguration.FPP_APIURL + "/DMCAPaymentAmazon.aspx?status=cancel";
            }

            // Optional fields
            string currencyCode = CurrencyCode;
            string sellerNote = SellerNote;
            string sellerOrderId = PaymentId.ToString();
            string shippingAddressRequired = "false";
            string paymentAction = "AuthorizeAndCapture";

            IDictionary<String, String> parameters = new Dictionary<String, String>();
            parameters.Add("accessKey", ApplicationConfiguration.ACCESS_KEY);
            parameters.Add("sellerId", ApplicationConfiguration.SELLER_ID);
            parameters.Add("amount", amount);
            parameters.Add("returnURL", returnURL);
            parameters.Add("cancelReturnURL", cancelReturnURL);
            parameters.Add("lwaClientId", ApplicationConfiguration.LWACLIENT_ID);
            parameters.Add("sellerNote", sellerNote);
            parameters.Add("sellerOrderId", sellerOrderId);
            parameters.Add("currencyCode", currencyCode);
            parameters.Add("shippingAddressRequired", shippingAddressRequired);
            parameters.Add("paymentAction", paymentAction);

            string Signature = SignParameters(parameters, ApplicationConfiguration.SECRET_KEY);

            IDictionary<String, String> SortedParameters =
                      new SortedDictionary<String, String>(parameters, StringComparer.Ordinal);
            SortedParameters.Add("signature", UrlEncode(Signature, false));

            var jsonSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            return (jsonSerializer.Serialize(SortedParameters));

        }

        /**
          * Convert Dictionary of parameters to URL encoded query string
          */
        private static string GetParametersAsString(IDictionary<String, String> parameters)
        {
            StringBuilder data = new StringBuilder();
            foreach (String key in (IEnumerable<String>)parameters.Keys)
            {
                String value = parameters[key];
                if (value != null)
                {
                    data.Append(key);
                    data.Append('=');
                    data.Append(UrlEncode(value, false));
                    data.Append('&');
                }
            }
            String result = data.ToString();
            return result.Remove(result.Length - 1);
        }

        /**
         * Computes RFC 2104-compliant HMAC signature for request parameters
         * Implements AWS Signature, as per following spec:
         *
         * If Signature Version is 2, string to sign is based on following:
         *
         *    1. The HTTP Request Method followed by an ASCII newline (%0A)
         *    2. The HTTP Host header in the form of lowercase host, followed by an ASCII newline.
         *    3. The URL encoded HTTP absolute path component of the URI
         *       (up to but not including the query string parameters);
         *       if this is empty use a forward '/'. This parameter is followed by an ASCII newline.
         *    4. The concatenation of all query string components (names and values)
         *       as UTF-8 characters which are URL encoded as per RFC 3986
         *       (hex characters MUST be uppercase), sorted using lexicographic byte ordering.
         *       Parameter names are separated from their values by the '=' character
         *       (ASCII character 61), even if the value is empty.
         *       Pairs of parameter and values are separated by the '&' character (ASCII code 38).
         *
         */
        private static String SignParameters(IDictionary<String, String> parameters, String key)
        {
            String signatureVersion = "2";

            KeyedHashAlgorithm algorithm = new HMACSHA256();

            String stringToSign = null;
            if ("2".Equals(signatureVersion))
            {
                String signatureMethod = "HmacSHA256";
                algorithm = KeyedHashAlgorithm.Create(signatureMethod.ToUpper());
                stringToSign = CalculateStringToSignV2(parameters);
            }
            else
            {
                throw new Exception("Invalid Signature Version specified");
            }

            return Sign(stringToSign, key, algorithm);
        }


        private static String UrlEncode(String data, bool path)
        {
            StringBuilder encoded = new StringBuilder();
            String unreservedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~" + (path ? "/" : "");

            foreach (char symbol in System.Text.Encoding.UTF8.GetBytes(data))
            {
                if (unreservedChars.IndexOf(symbol) != -1)
                {
                    encoded.Append(symbol);
                }
                else
                {
                    encoded.Append("%" + String.Format("{0:X2}", (int)symbol));
                }
            }

            return encoded.ToString();

        }

        private static String CalculateStringToSignV2(IDictionary<String, String> parameters)
        {
            StringBuilder data = new StringBuilder();
            IDictionary<String, String> sorted =
                  new SortedDictionary<String, String>(parameters, StringComparer.Ordinal);
            data.Append("POST");
            data.Append("\n");
            data.Append("payments.amazon.com");
            data.Append("\n");
            data.Append("/");
            data.Append("\n");
            foreach (KeyValuePair<String, String> pair in sorted)
            {
                if (pair.Value != null)
                {
                    data.Append(UrlEncode(pair.Key, false));
                    data.Append("=");
                    data.Append(UrlEncode(pair.Value, false));
                    data.Append("&");
                }

            }

            String result = data.ToString();
            return result.Remove(result.Length - 1);
        }

        /**
         * Computes RFC 2104-compliant HMAC signature.
         */
        private static String Sign(String data, String key, KeyedHashAlgorithm algorithm)
        {
            Encoding encoding = new UTF8Encoding();
            algorithm.Key = encoding.GetBytes(key);
            return Convert.ToBase64String(algorithm.ComputeHash(
                encoding.GetBytes(data.ToCharArray())));
        }

        public BaseResponse AmazonRecurringPayment(int PaymentId, string amazonBillingAgreementId, Nullable<float> amount, string Note)
        {
            baseResponse = new BaseResponse();
            clientConfig = new AmazonPay.CommonRequests.Configuration();

            clientConfig.WithAccessKey(ApplicationConfiguration.ACCESS_KEY)
                .WithSecretKey(ApplicationConfiguration.SECRET_KEY)
                .WithMerchantId(ApplicationConfiguration.SELLER_ID)
                .WithClientId(ApplicationConfiguration.LWACLIENT_ID)
                .WithSandbox(true)
                .WithRegion(Regions.supportedRegions.us);

            client = new Client(clientConfig);
            string captureId = "";

            bool result = SetOrderReferenceDetailsApiCall(amazonBillingAgreementId, Note);

            if (result)
            {
                GetOrderReferenceDetailsApiCall(amazonBillingAgreementId, null);
                ConfirmBillingAgreementApiCall(amazonBillingAgreementId);

                string uniqueReferenceId = GenerateRandomUniqueString();

                AuthorizeOnBillingAgreementRequest authRequestParameters = new AuthorizeOnBillingAgreementRequest();

                authRequestParameters.WithAmazonBillingAgreementId(amazonBillingAgreementId.ToString())
                    .WithAmount((decimal)amount)
                    .WithSellerOrderId(PaymentId.ToString())
                    .WithCurrencyCode(Regions.currencyCode.USD)
                    .WithAuthorizationReferenceId(uniqueReferenceId)
                    .WithTransactionTimeout(0)
                    .WithCaptureNow(true)
                    .WithSellerAuthorizationNote(Note);

                AuthorizeResponse authResponse = client.AuthorizeOnBillingAgreement(authRequestParameters);
                //apiResponse["authorizeOnBillingAgreementResponse"] = authResponse.GetJson();

                if (!authResponse.GetSuccess())
                {
                    baseResponse.Success = false;
                    baseResponse.Message = authResponse.GetErrorMessage();

                }
                else
                {
                    uniqueReferenceId = GenerateRandomUniqueString();

                    // AuthorizeOnBillingAgreement was a success 
                    string amazonAuthorizationId = authResponse.GetAuthorizationId();

                    // Check if the Capture Now was set to true 
                    bool captureNow = authResponse.GetCaptureNow();

                    // If captureNow was true then the capture has already happened. Get the Capture ID(s) from the List
                    if (captureNow)
                    {
                        IList<string> amazonCaptureIdList = authResponse.GetCaptureIdList();

                        // The captureNow was true therefore just disply the Captured response details
                        GetCaptureDetailsRequest getCaptureRequestParameters = new GetCaptureDetailsRequest();
                        foreach (string id in amazonCaptureIdList)
                        {
                            // Here there can be multiple Capture ID's. For example purposes we are considering a single Capture ID.
                            captureId = id;
                        }
                        getCaptureRequestParameters.WithAmazonCaptureId(captureId);

                        CaptureResponse getCaptureDetailsResponse = client.GetCaptureDetails(getCaptureRequestParameters);
                        //apiResponse["captureResponse"] = getCaptureDetailsResponse.GetJson();
                        //if (getCaptureDetailsResponse.GetSuccess())
                        //{
                        //    return apiResponse;
                        //}
                    }
                    else
                    {
                        // If the captureNow was not true then capture the amount for the Authorization ID

                        CaptureRequest captureRequestParameters = new CaptureRequest();
                        captureRequestParameters.WithAmazonAuthorizationId(amazonAuthorizationId)
                            .WithAmount((decimal)amount)
                            .WithCurrencyCode(Regions.currencyCode.USD)
                            .WithCaptureReferenceId(uniqueReferenceId)
                            .WithSellerCaptureNote(Note);

                        CaptureResponse captureResponse = client.Capture(captureRequestParameters);
                        //apiResponse["captureResponse"] = captureResponse.GetJson();

                        if (!captureResponse.GetSuccess())
                        {
                            // API CALL FAILED, get the Error code and Error Message
                            baseResponse.Success = false;
                            baseResponse.Message = captureResponse.GetErrorMessage();
                        }
                    }
                }
            }
            baseResponse.Success = true;
            baseResponse.Message = captureId;

            return baseResponse;
        }

        public static void GetOrderReferenceDetailsApiCall(string amazonBillingAgreementId, string addressConsentToken = null)
        {
            GetBillingAgreementDetailsRequest getRequestParameters = new GetBillingAgreementDetailsRequest();
            getRequestParameters.WithAmazonBillingAgreementId(amazonBillingAgreementId)
                .WithaddressConsentToken(null);

            BillingAgreementDetailsResponse getOrderReferenceDetailsResponse = client.GetBillingAgreementDetails(getRequestParameters);

            // IResponse is an interface method for common response methods for each response class 
            IResponse interfaceresp = (IResponse)getOrderReferenceDetailsResponse;

            var result = JObject.Parse(getOrderReferenceDetailsResponse.GetJson()).ToString();

        }

        public static bool SetOrderReferenceDetailsApiCall(string amazonBillingAgreementId, string Note)
        {
            SetBillingAgreementDetailsRequest setRequestParameters = new SetBillingAgreementDetailsRequest();
            setRequestParameters.WithAmazonBillingAgreementId(amazonBillingAgreementId)
                .WithSellerNote(Note);

            BillingAgreementDetailsResponse setResponse = client.SetBillingAgreementDetails(setRequestParameters);

            if (!setResponse.GetSuccess())
            {
                return false;
            }
            else
            {
                var data = setResponse.GetJson();
                return true;
            }
        }

        public static void ConfirmBillingAgreementApiCall(string amazonBillingAgreementId)
        {
            ConfirmBillingAgreementRequest getRequestParameters = new ConfirmBillingAgreementRequest();
            getRequestParameters.WithAmazonBillingreementId(amazonBillingAgreementId.ToString());

            ConfirmBillingAgreementResponse confirmBillingAgrementResponse = client.ConfirmBillingAgreement(getRequestParameters);
            //var test = confirmBillingAgrementResponse.GetJson();
        }

        public static string GenerateRandomUniqueString()
        {
            Guid g = Guid.NewGuid();
            string GuidString = Convert.ToBase64String(g.ToByteArray());
            GuidString = GuidString.Replace("=", "");
            GuidString = GuidString.Replace("+", "");
            GuidString = GuidString.Replace("/", "");
            return GuidString;
        }
        

        #endregion


        #region Static Function

        public static bool StaticGetUserDetailByUserEmail(string email, string password)
        {
            var userExists = false;
            try
            {

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    userExists = db.system_user.Where(x => x.email == email && x.password == password).Select(x => x.id).Any();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return userExists;

        }

        public static PdfResponse PdfGeneration(string Template, string DocType)
        {
            PdfResponse pdfresponse = new PdfResponse();

            System.DateTime myDate = DateTime.Now;
            int year = myDate.Year;
            int month = myDate.Month;

            var PartialPath = "/Uploads/Documents/" + year + "/" + month;

            var FilePath = "~" + PartialPath;


            bool exists = Directory.Exists(HttpContext.Current.Server.MapPath(FilePath));

            if (!exists)
            {
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(FilePath));
            }

            string FileName = "";

            switch (DocType)
            {
                case "LINK_REMOVAL":
                    FileName = "LinkRemoval_" + Guid.NewGuid().ToString() + ".pdf";
                    break;

                case "DUNNING":
                    FileName = "Dunning_" + Guid.NewGuid().ToString() + ".pdf";
                    break;

                default:
                    FileName = "LinkRemoval_" + Guid.NewGuid().ToString() + ".pdf";
                    break;
            }


            var FilePathWithFilename = Path.Combine(HttpContext.Current.Server.MapPath(FilePath), FileName);

            var LogoPath = HttpContext.Current.Server.MapPath("~/Uploads/Logo/fpp_logo.jpg");
            var Stamp = HttpContext.Current.Server.MapPath("~/Uploads/Logo/Facepinpoint_stamp.png");

            StringReader sr = new StringReader(Template);
            iTextSharp.text.Document pdfDoc = new iTextSharp.text.Document(PageSize.A4, 10f, 10f, 105f, 0f);

            iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(LogoPath);
            jpg.Alignment = Element.ALIGN_TOP;
            jpg.ScaleAbsolute(220f, 130f);
            jpg.SetAbsolutePosition(340f, 700f);


            iTextSharp.text.Image stamp = iTextSharp.text.Image.GetInstance(Stamp);
            //stamp.Alignment = Element.ALIGN_TOP;
            stamp.ScaleAbsolute(80f, 80f);
            stamp.SetAbsolutePosition(430f, 0f);

            //var output = new MemoryStream();
            // PdfWriter writer = PdfWriter.GetInstance(pdfDoc, output);
            HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
            PdfWriter.GetInstance(pdfDoc, new FileStream(FilePathWithFilename, FileMode.Create));
            pdfDoc.Open();
            pdfDoc.Add(jpg);
            pdfDoc.Add(stamp);

            // XMLWorkerHelper.GetInstance().ParseXHtml(writer, pdfDoc, sr);
            htmlparser.Parse(sr);
            pdfDoc.Close();
            //Response.Write(pdfDoc);
            //Response.End();

            pdfresponse.Filename = FileName;
            pdfresponse.FilePath = PartialPath + "/" + FileName;
            pdfresponse.FullPath = FilePathWithFilename;
            return pdfresponse;
        }

        public async Task<bool> SendTicketMail(TicketMailRequest TicketMail)
        {
            bool isMailSend = false;

            using (FacepinpointDBEntities db = new FacepinpointDBEntities())
            {
                MailContent mailContent = new MailContent();
                var templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_GetTicket\"('Ticket', '" + TicketMail.ticketId + "','" + TicketMail.UserEmail + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Ticket'").FirstOrDefaultAsync();

                mailContent.ToEmail = TicketMail.UserEmail;
                mailContent.MsgSubject = templateResponse.Subject;
                mailContent.MsgBody = templateResponse.Template;
                EmailSender.MailSender(mailContent);

                templateResponse = await db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"FN_Get_Ticket\"('TicketInvoice', " + TicketMail.ticketId + ") AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='TicketInvoice'").FirstOrDefaultAsync();
                mailContent.ToEmail = ApplicationConfiguration.EMAIL_RECEIVER;
                mailContent.MsgSubject = templateResponse.Subject;
                mailContent.MsgBody = templateResponse.Template;
                mailContent.Attachments = TicketMail.fileAttachments;
                EmailSender.MailSender(mailContent);
                isMailSend = true;
            }

            return isMailSend;
        }

        #endregion

        #region ConsoleApp
        public async Task<BaseResponse> GetUserDetailForSearchInvoked()
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ScheduleLog scheduleLog = new ScheduleLog();
                    scheduleLog.Name = "DailyUserSearchInvokeCron";
                    scheduleLog.StartTime = DateTime.Now;
                    db.ScheduleLogs.Add(scheduleLog);
                    db.SaveChanges();

                    var userDetailForSearchInvokedResponse = await db.Database.SqlQuery<UserDetailForSearchInvokedJson>("select \"public\".\"FN_GetUserDetailForSearchInvoked\"() as UserDetailForSearchInvokedJsonString").FirstOrDefaultAsync();
                    if (!string.IsNullOrEmpty(userDetailForSearchInvokedResponse.UserDetailForSearchInvokedJsonString))
                    {
                        List<UserDetailForSearchInvoked> packageFeatureDetailList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UserDetailForSearchInvoked>>(userDetailForSearchInvokedResponse.UserDetailForSearchInvokedJsonString);

                        if (packageFeatureDetailList.Count > 0)
                        {
                            foreach (var packageFeatureDetail in packageFeatureDetailList)
                            {
                                InvokeUserSearch(packageFeatureDetail.UserBiometericId, packageFeatureDetail.Email);
                            }
                        }
                    }
                    ScheduleLog scheduleLogUpdate = db.ScheduleLogs.Where(x => x.ScheduleLogId == scheduleLog.ScheduleLogId).FirstOrDefault();
                    scheduleLogUpdate.EndTime = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }
        public async Task<BaseResponse> SendMailToUnSigned()
        {
            try
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ScheduleLog scheduleLog = new ScheduleLog();
                    scheduleLog.Name = "SendMailtoUserIfDocNotSignedCron";
                    scheduleLog.StartTime = DateTime.Now;
                    db.ScheduleLogs.Add(scheduleLog);
                    db.SaveChanges();

                    baseResponse = new BaseResponse();
                    string sqlQuery = "select \"public\".\"FN_GetUnSignedUser\"() as json";
                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();

                    if (jsonResponse.json != null)
                    {
                        List<UnsignedUser> listUnsignedUser = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UnsignedUser>>(jsonResponse.json);

                        if (listUnsignedUser != null)
                        {
                            foreach (var unsignedUser in listUnsignedUser)
                            {
                                if (unsignedUser.dmca_signed == 0 && unsignedUser.dunning_signed == 0)
                                {
                                    var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "UnSigned").FirstOrDefaultAsync();
                                    mailContent = new MailContent();
                                    mailContent.ToEmail = unsignedUser.email;
                                    mailContent.MsgSubject = templateResponse.Subject;
                                    mailContent.MsgBody = templateResponse.Template;

                                    EmailSender.MailSender(mailContent);
                                }
                            }
                        }
                    }

                    ScheduleLog scheduleLogUpdate = db.ScheduleLogs.Where(x => x.ScheduleLogId == scheduleLog.ScheduleLogId).FirstOrDefault();
                    scheduleLogUpdate.EndTime = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }
        public async Task<BaseResponse> DunningLetter()
        {
            try
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ScheduleLog scheduleLog = new ScheduleLog();
                    scheduleLog.Name = "SendDunningLetterCron";
                    scheduleLog.StartTime = DateTime.Now;
                    db.ScheduleLogs.Add(scheduleLog);
                    db.SaveChanges();

                    baseResponse = new BaseResponse();
                    string sqlQuery = "select \"public\".\"FN_SendDunningLetter\"() as json";
                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();

                    if(jsonResponse.json != null)
                    {
                        List<DunningLetter> dunningLetters = Newtonsoft.Json.JsonConvert.DeserializeObject<List<DunningLetter>>(jsonResponse.json);

                        if (dunningLetters != null)
                        {
                            foreach (var dunningLetter in dunningLetters)
                            {
                                var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "DMCA Take down Notice").FirstOrDefaultAsync();

                                mailContent = new MailContent();
                                mailContent.ToEmail = dunningLetter.AgentEmail;

                                var FilePath = "~" + dunningLetter.DocumentPath;
                                var FilePathWithFilename = HttpContext.Current.Server.MapPath(FilePath);

                                string[] attachments = new string[] { FilePathWithFilename };
                                mailContent.MsgSubject = templateResponse.Subject;
                                mailContent.MsgBody = templateResponse.Template;
                                mailContent.Attachments = attachments;
                                EmailSender.MailSender(mailContent);

                            }
                        }
                    }

                    ScheduleLog scheduleLogUpdate = db.ScheduleLogs.Where(x => x.ScheduleLogId == scheduleLog.ScheduleLogId).FirstOrDefault();
                    scheduleLogUpdate.EndTime = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }
        public async Task<BaseResponse> AmazonPaymentScheduling()
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ScheduleLog scheduleLog = new ScheduleLog();
                    scheduleLog.Name = "AmazonRecurringPaymentCron";
                    scheduleLog.StartTime = DateTime.Now;
                    db.ScheduleLogs.Add(scheduleLog);
                    db.SaveChanges();

                    string sqlQuery = "select \"public\".\"FN_AmazonRecurringPayment\"() as json";
                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();

                    if(jsonResponse.json != null)
                    { 
                        List<AmzonRecurringPayment> amzonRecurringPayments = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AmzonRecurringPayment>>(jsonResponse.json);

                        if (amzonRecurringPayments != null)
                        {
                            foreach (var amzonRecurringPayment in amzonRecurringPayments)
                            {
                                string sellerNote = "FACE RECOGNITION : " + amzonRecurringPayment.SearchAllowed + " Search $ " + amzonRecurringPayment.Price + " USD";

                                string uniqueReferenceId = GenerateRandomUniqueString();
                                var amazonBillingAgreementId = amzonRecurringPayment.BillingId.ToString();
                                AuthorizeOnBillingAgreementRequest authRequestParameters = new AuthorizeOnBillingAgreementRequest();

                                authRequestParameters.WithAmazonBillingAgreementId(amazonBillingAgreementId)
                                    .WithAmount((decimal)amzonRecurringPayment.TotalOrder)
                                    .WithCurrencyCode(Regions.currencyCode.USD)
                                    .WithAuthorizationReferenceId(uniqueReferenceId)
                                    .WithTransactionTimeout(0)
                                    .WithCaptureNow(true)
                                    .WithSellerAuthorizationNote(sellerNote);

                                AuthorizeResponse authResponse = client.AuthorizeOnBillingAgreement(authRequestParameters);
                                var AuthAPIResponse = authResponse.GetJson();
                                if (!authResponse.GetSuccess())
                                {
                                    string errorCode = authResponse.GetErrorCode();
                                    string errorMessage = authResponse.GetErrorMessage();
                                }
                                else
                                {
                                    string errorCode = "";
                                    // AuthorizeOnBillingAgreement was a success 
                                    string amazonAuthorizationId = authResponse.GetAuthorizationId();

                                    // Check if the Capture Now was set to true 
                                    bool captureNow = authResponse.GetCaptureNow();

                                    IList<string> amazonCaptureIdList = new List<string>();
                                    // If captureNow was true then the capture has already happened. Get the Capture ID(s) from the List
                                    if (captureNow)
                                    {
                                        amazonCaptureIdList = authResponse.GetCaptureIdList();
                                    }


                                    string captureId = "";
                                    uniqueReferenceId = GenerateRandomUniqueString();

                                    // If the captureNow was not true then capture the amount for the Authorization ID
                                    if (!captureNow)
                                    {
                                        CaptureRequest captureRequestParameters = new CaptureRequest();
                                        captureRequestParameters.WithAmazonAuthorizationId(amazonAuthorizationId)
                                            // The below code can be used to get the amount from the session. the amount was added into session in the SetPaymentDetails.aspx
                                            //.WithAmount(decimal.Parse(Session["amount"].ToString()))

                                            //For example we will be authorizing amount value of 1.99
                                            .WithAmount((decimal)amzonRecurringPayment.TotalOrder)
                                            .WithCurrencyCode(Regions.currencyCode.USD)
                                            .WithCaptureReferenceId(uniqueReferenceId)
                                            .WithSellerCaptureNote(sellerNote);

                                        CaptureResponse captureResponse = client.Capture(captureRequestParameters);
                                        var CaptureAPIResponse = captureResponse.GetJson();

                                        if (!captureResponse.GetSuccess())
                                        {
                                            // API CALL FAILED, get the Error code and Error Message
                                            errorCode = captureResponse.GetErrorCode();
                                            string errorMessage = captureResponse.GetErrorMessage();
                                        }
                                    }
                                    else
                                    {
                                        // The captureNow was true therefore just disply the Captured response details
                                        GetCaptureDetailsRequest getCaptureRequestParameters = new GetCaptureDetailsRequest();
                                        foreach (string id in amazonCaptureIdList)
                                        {
                                            // Here there can be multiple Capture ID's. For example purposes we are considering a single Capture ID.
                                            captureId = id;
                                        }
                                        getCaptureRequestParameters.WithAmazonCaptureId(captureId);

                                        CaptureResponse getCaptureDetailsResponse = client.GetCaptureDetails(getCaptureRequestParameters);
                                        var CaptureDetailAPIResponse = getCaptureDetailsResponse.GetJson();

                                    }

                                    //CaptureApiCall(amzonRecurringPayment.TotalOrder, sellerNote, captureNow, amazonAuthorizationId, );

                                    if (errorCode == "")
                                    {
                                        Payment payment = new Payment();
                                        payment.PackageId = Convert.ToInt32(amzonRecurringPayment.PackageId);
                                        payment.CouponId = amzonRecurringPayment.CouponId;
                                        payment.Status = 0;
                                        payment.Type = "Search";
                                        payment.Discount = amzonRecurringPayment.Discount;
                                        payment.SubTotal = amzonRecurringPayment.SubTotal;
                                        payment.TotalOrder = amzonRecurringPayment.TotalOrder;
                                        payment.UserId = amzonRecurringPayment.id;
                                        payment.PaymentMethod = "Amazon";
                                        payment.PaymentDate = DateTime.Now;
                                        payment.LinksCount = 0;
                                        payment.SalesTax = amzonRecurringPayment.SalesTax;
                                        db.Payments.Add(payment);
                                        await db.SaveChangesAsync();


                                        PayDetailsRequest payDetailsRequest = new PayDetailsRequest();
                                        payDetailsRequest.PaymentId = payment.PaymentId;
                                        payDetailsRequest.TrackingNumber = captureId;
                                        payDetailsRequest.Amount = (double)payment.TotalOrder;
                                        payDetailsRequest.Source = "P";
                                        await SavePayDetail(payDetailsRequest);

                                        await UpdatePaymentDetail(payment.PaymentId);

                                    }
                                }
                            }
                        }
                    }

                    ScheduleLog scheduleLogUpdate = db.ScheduleLogs.Where(x => x.ScheduleLogId == scheduleLog.ScheduleLogId).FirstOrDefault();
                    scheduleLogUpdate.EndTime = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userDetailResponse.Success = false;
                userDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userDetailResponse;
        }
        public async Task<BaseResponse> SendEmailToRegisterUser()
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    ScheduleLog scheduleLog = new ScheduleLog();
                    scheduleLog.Name = "SendRegistrationURLtoUserCron";
                    scheduleLog.StartTime = DateTime.Now;
                    db.ScheduleLogs.Add(scheduleLog);
                    db.SaveChanges();

                    string sqlQuery = "select \"public\".\"FN_GetRegisteredUserEmail\"() as json";
                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                    if (jsonResponse.json != null)
                    {

                        List<EmailToRegisterUsers> emailToRegisterUsers = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EmailToRegisterUsers>>(jsonResponse.json);

                        foreach (var emailToRegisterUser in emailToRegisterUsers)
                        {
                            var createEncryptedUserEmailRegistrationToken = EncodeDecodeForgetPasswordToken.CreateEncryptedUserEmailRegistrationToken(emailToRegisterUser);
                            var SQL_Query = "SELECT \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_getuseremailregistrationtemplate\"('RegisterUserEmail','" + emailToRegisterUser.Email + "' ,'" + createEncryptedUserEmailRegistrationToken + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='RegisterUserEmail'";
                            var templateResponse = await db.Database.SqlQuery<TemplateDetail>(SQL_Query).FirstOrDefaultAsync();

                            mailContent = new MailContent();
                            mailContent.ToEmail = emailToRegisterUser.Email;
                            mailContent.MsgSubject = templateResponse.Subject;
                            mailContent.MsgBody = templateResponse.Template;

                            // Email sender
                            EmailSender.MailSender(mailContent);
                        }

                        string updateSqlQuery = "select \"public\".\"FN_UpdateRegisteredUser\"() as json";
                        await db.Database.SqlQuery<bool>(updateSqlQuery).FirstOrDefaultAsync();
                    }

                    ScheduleLog scheduleLogUpdate = db.ScheduleLogs.Where(x => x.ScheduleLogId == scheduleLog.ScheduleLogId).FirstOrDefault();
                    scheduleLogUpdate.EndTime = DateTime.Now;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }
        #endregion
    }
}
