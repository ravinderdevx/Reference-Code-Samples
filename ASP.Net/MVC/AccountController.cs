using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Account.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using Account.Common;
using Core.Domain;
using System.Web.Script.Serialization;
using Account.Filter;
using System.Web.Security;
using WebMatrix.WebData;
using System.Security.Cryptography;
using System.Text;
using ServiceLayer.Services;
using ServiceLayer.Interfaces;
using System.Net;
using Newtonsoft.Json;
using MvcBasicSite.Models;

namespace Account.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        public AccountController()
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())))
        {
        }

        public AccountController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }
        public AccountController(IUserService _userService)
        {
            this.userService = _userService;
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }
        private readonly IUserService userService;
        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            if (ModelState.IsValid)
            {
                ModelState.Clear();
            }
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        /// <summary>
        /// Change the current culture.
        /// </summary>
        /// <param name="culture">The current selected culture.</param>
        /// <returns>The action result.</returns>
        [AllowAnonymous]
        public ActionResult ChangeCurrentCulture(int culture)
        {
            //
            // Change the current culture for this user.
            //
            SiteSession.CurrentUICulture = culture;
            //
            // Cache the new current culture into the user HTTP session. 
            //
            Session["CurrentUICulture"] = culture;
            //
            // Redirect to the same page from where the request was made! 
            //
            return Redirect(Request.UrlReferrer.ToString());
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult Login(LoginViewModel model, string returnUrl)
        {
            ServiceLayer.Services.ScreenPermissionService _ActionAccessPermissionService = new ServiceLayer.Services.ScreenPermissionService();

            #region Commented Code

            //if (ModelState.IsValid)
            //{
            //    var user = await UserManager.FindAsync(model.UserName, model.Password);
            //    if (user != null)
            //    {
            //        await SignInAsync(user, model.RememberMe);
            //        return RedirectToLocal(returnUrl);
            //    }
            //    else
            //    {
            //        ModelState.AddModelError("", "Invalid username or password.");
            //    }
            //}

            #endregion

            //// If we got this far, something failed, redisplay form
            //return View(model);
            if (ModelState.IsValid)
            {
                ServiceLayer.Services.ResetPasswordService _ResetPasswordService = new ServiceLayer.Services.ResetPasswordService();
                List<User> list = _ResetPasswordService.GetUsersByEmail(model.UserName.ToString());
                if (list.Count > 0)
                {
                    if (list[0].Active == true)
                    {
                        if (WebSecurity.Login(model.UserName, model.Password))
                        {
                            //if (list[0].Active == true)
                            //{
                            int cID = WebSecurity.GetUserId(model.UserName);
                            var username = WebSecurity.CurrentUserName;
                            // session["userid"] = cid;convert.toint32(membership.getuser().provideruserkey
                            string TokenID = _ActionAccessPermissionService.GetAuthorizeToken(Convert.ToInt32(cID));
                            Session["TokenID"] = TokenID;
                            if (Session["TokenID"] == "")
                            {
                                TokenID = _ActionAccessPermissionService.GetAuthorizeToken(Convert.ToInt32(cID));
                                Session["TokenID"] = TokenID;
                            }
                            if (returnUrl != null && returnUrl != "/")
                            {
                                return Redirect(returnUrl);
                            }
                            return RedirectToAction("Index", "Home");
                            //}
                            //else
                            //{
                            //    return RedirectToAction("AccountInActive", "Home");
                            //}
                        }
                        else
                        {
                            ModelState.AddModelError("", "Sorry,Username or Password is Invalid.");
                            return View(model);
                        }
                    }
                    else
                    {
                        return RedirectToAction("AccountInActive", "Account");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Sorry,Username or Password is Invalid.");
                    return View(model);
                }

            }
            ModelState.AddModelError("", "Sorry,Username or Password is Invalid.");
            return View(model);
        }



        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }
        public ActionResult LogOut()
        {
            WebSecurity.Logout();
            return RedirectToAction("Login", "Account");
        }
        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterViewModel model)
        {
            //Validating Captcha
            string stringResponse = string.Empty;
            if (!ValidateCaptcha(out stringResponse))
            {
                ModelState.AddModelError("", stringResponse);
                //Below code regarding Invalid captcha has been commented as currently we dont have any secret key for this application
                //return View(model);
            }
            ServiceLayer.Services.ResetPasswordService _ResetPasswordService = new ServiceLayer.Services.ResetPasswordService();

            //if (ModelState.IsValid)
            {
                #region Commented Code

                //var user = new ApplicationUser() { UserName = model.UserName };
                //var result = await UserManager.CreateAsync(user, model.Password);
                //if (result.Succeeded)
                //{
                //    await SignInAsync(user, isPersistent: false);
                //    return RedirectToAction("Index", "Home");
                //}
                //else
                //{
                //    AddErrors(result);
                //}
                #endregion

                try
                {
                    List<User> list = _ResetPasswordService.GetUsersByEmail(model.UserName.ToString());
                    int _userID = WebSecurity.GetUserId(model.UserName);
                    if (list.Count == 0 && _userID > 0)
                    {
                        ((SimpleMembershipProvider)Membership.Provider).DeleteUser(model.UserName.ToString(), true); // deletes record from webpages_Membership table
                    }

                    WebSecurity.CreateUserAndAccount(model.UserName, model.Password, new { Active = false });
                    //TODO This Code Use For Mainain Password History
                    string RetPassword = HashData(model.Password);
                    SecUserPasswordHistory _secUserPasswordHistory = new SecUserPasswordHistory();
                    byte[] array = Encoding.ASCII.GetBytes(RetPassword);

                    userService.UpdateUserInfo(model.UserName);
                    _secUserPasswordHistory.PasswordHash256 = array;
                    _secUserPasswordHistory.DeleteFlag = false;
                    _secUserPasswordHistory.RowVersion = null;
                    _secUserPasswordHistory.SecUserID = WebSecurity.GetUserId(model.UserName);
                    _ResetPasswordService.AddPasswordHistory(_secUserPasswordHistory);
                    //End
                    //  ModelState.AddModelError("", "User has been successfully created..");
                    return RedirectToAction("Index", "Home");
                    //  return null;
                }
                catch (Exception ex)
                {
                    // ModelState.AddModelError("", "User already exist..");
                }
            }
            ModelState.AddModelError("", "User already exist..");
            // If we got this far, something failed, redisplay form
            return View(model);
        }
        public class CaptchaResponse
        {
            [JsonProperty("success")]
            public bool Success { get; set; }

            [JsonProperty("error-codes")]
            public List<string> ErrorCodes { get; set; }
        }
        private bool ValidateCaptcha(out string stringResponse)
        {
            var response = Request["g-recaptcha-response"];
            //secret that was generated in key value pair
            const string secret = "6LfiS_8SAAAAABvF6ixcyP5MtsevE5RZ9dTorUWr";//Should be kept in config file
            stringResponse = string.Empty;
            var client = new WebClient();
            var reply =
                client.DownloadString(
                    string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", secret, response));

            var captchaResponse = JsonConvert.DeserializeObject<CaptchaResponse>(reply);

            //when response is false check for the error message
            if (!captchaResponse.Success)
            {
                if (captchaResponse.ErrorCodes.Count <= 0) return false;

                var error = captchaResponse.ErrorCodes[0].ToLower();
                switch (error)
                {
                    case ("missing-input-secret"):
                        stringResponse = "The secret parameter is missing.";
                        break;
                    case ("invalid-input-secret"):
                        stringResponse = "The secret parameter is invalid or malformed.";
                        break;

                    case ("missing-input-response"):
                        stringResponse = "The response parameter is missing.";
                        break;
                    case ("invalid-input-response"):
                        ViewBag.Message = "The response parameter is invalid or malformed.";
                        break;

                    default:
                        stringResponse = "Error occured. Please try again";
                        break;
                }
                return false;
            }
            else
            {
                return true;
            }
        }

        //
        // POST: /Account/Disassociate
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Disassociate(string loginProvider, string providerKey)
        {
            ManageMessageId? message = null;
            IdentityResult result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(loginProvider, providerKey));
            if (result.Succeeded)
            {
                message = ManageMessageId.RemoveLoginSuccess;
            }
            else
            {
                message = ManageMessageId.Error;
            }
            return RedirectToAction("Manage", new { Message = message });
        }

        //
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : message == ManageMessageId.Error ? "An error has occurred."
                : "";
            ViewBag.HasLocalPassword = HasPassword();
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }

        //
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Manage(ManageUserViewModel model)
        {

            bool hasPassword = HasPassword();
            ViewBag.HasLocalPassword = hasPassword;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasPassword)
            {
                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }
            else
            {
                // User does not have a password so remove any validation errors caused by a missing OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var user = await UserManager.FindAsync(loginInfo.Login);
            if (user != null)
            {
                await SignInAsync(user, isPersistent: false);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                // If the user does not have an account, then prompt the user to create an account
                ViewBag.ReturnUrl = returnUrl;
                ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { UserName = loginInfo.DefaultUserName });
            }
        }

        //
        // POST: /Account/LinkLogin
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LinkLogin(string provider)
        {
            // Request a redirect to the external login provider to link a login for the current user
            return new ChallengeResult(provider, Url.Action("LinkLoginCallback", "Account"), User.Identity.GetUserId());
        }

        //
        // GET: /Account/LinkLoginCallback
        public async Task<ActionResult> LinkLoginCallback()
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync(XsrfKey, User.Identity.GetUserId());
            if (loginInfo == null)
            {
                return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
            }
            var result = await UserManager.AddLoginAsync(User.Identity.GetUserId(), loginInfo.Login);
            if (result.Succeeded)
            {
                return RedirectToAction("Manage");
            }
            return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
        }

        [AllowAnonymous]
        public ActionResult AccountInActive()
        {
            return View();
        }
        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser() { UserName = model.UserName };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInAsync(user, isPersistent: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult RemoveAccountList()
        {
            var linkedAccounts = UserManager.GetLogins(User.Identity.GetUserId());
            ViewBag.ShowRemoveButton = HasPassword() || linkedAccounts.Count > 1;
            return (ActionResult)PartialView("_RemoveAccountPartial", linkedAccounts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && UserManager != null)
            {
                UserManager.Dispose();
                UserManager = null;
            }
            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            // var user = WebSecurity.GetUserId(User.Identity.GetUserName());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            Error
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        private class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties() { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion



        #region Login Verification


        //public ActionResult AuthenticateUser(User model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        // Check if user name and password not enter
        //        if (string.IsNullOrWhiteSpace(model.Email) && string.IsNullOrWhiteSpace(model.Password))
        //        {
        //            TempData["UserStatus"] = "User name and password invalid please try again!!";
        //            return RedirectToAction("Index");
        //        }
        //        // Check if user name not enter
        //        if (string.IsNullOrWhiteSpace(model.Email))
        //        {
        //            TempData["UserStatus"] = "Please enter user name!!";
        //            return RedirectToAction("Index");
        //        }

        //        // Check if password not enter
        //        if (string.IsNullOrWhiteSpace(model.Password))
        //        {
        //            TempData["UserStatus"] = "Please enter password!!";
        //            return RedirectToAction("Index");
        //        }

        //        // Check status user status
        //        string userStatus = ((UserLoginMessage)_IFrontEndUserService.AuthenticateUser(model.Email, model.Password, ref model)).ToString();

        //        if (userStatus == UserLoginMessage.ValidUser.ToString())
        //        {
        //            //Create Authorized Cookies
        //            CreateAuthorizedCookiesFronEndUser(model);
        //            return RedirectToAction("Index", "Home", new { @Area = "User" });
        //        }
        //        else
        //        {
        //            if (userStatus == "NotExits")
        //                TempData["UserStatus"] = "User name and password invalid please try again!!";
        //            return RedirectToAction("Index");
        //        }
        //    }
        //}

        /// <summary>
        /// Create cookie for authentication
        /// </summary>
        /// <param name="model"></param>
        private void CreateAuthorizedCookiesFronEndUser(User model)
        {

            CustomPrincipalSerializeModel serializeModel = new CustomPrincipalSerializeModel();
            serializeModel.UserId = model.UserId;
            serializeModel.FirstName = model.FirstName;
            serializeModel.Email = model.Email;
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            //serialize user data and add to cookie
            string userData = serializer.Serialize(serializeModel);

            FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(
                1,
                model.Email,
                DateTime.Now,
                DateTime.Now.AddMinutes(30),
                false, userData);

            string encTicket = FormsAuthentication.Encrypt(authTicket);

            HttpCookie faCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encTicket);
            Response.Cookies.Add(faCookie);
        }

        /// <summary>
        /// LogOut User
        /// </summary>
        /// <returns></returns>
        public ActionResult UserLogout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }
        #endregion

        #region ForgotPassword
        // [HttpPost]
        //   [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword()
        {


            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword(ManageUserViewModel model)
        {
            if (ModelState.IsValid)
            {
                ServiceLayer.Services.ResetPasswordService _ResetPasswordService = new ServiceLayer.Services.ResetPasswordService();
                var token = "";
                string UserName = WebSecurity.CurrentUserName;
                //check user existance


                var user = Membership.GetUser(UserName);

                bool changePasswordSucceeded;
                changePasswordSucceeded = user.ChangePassword(model.OldPassword, model.NewPassword);

                if (!changePasswordSucceeded)
                {
                    return Content("Current password is not correct.");
                }

                if (user == null)
                {
                    TempData["Message"] = "User Not exist.";
                }
                else
                {
                    //generate password token
                    token = WebSecurity.GeneratePasswordResetToken(UserName);
                    //create url with above token
                }
                bool any = _ResetPasswordService.UpdatePassword(UserName, token);
                bool response = false;
                if (any == true)
                {
                    response = WebSecurity.ResetPassword(token, model.NewPassword);
                    if (response == true)
                    {
                        try
                        {
                            //  Here Maintain Password History
                            //  MembershipUser u = Membership.GetUser(WebSecurity.CurrentUserName, false);

                            string RetPassword = HashData(model.NewPassword);
                            SecUserPasswordHistory _secUserPasswordHistory = new SecUserPasswordHistory();
                            byte[] array = Encoding.ASCII.GetBytes(RetPassword);

                            _secUserPasswordHistory.PasswordHash256 = array;
                            _secUserPasswordHistory.DeleteFlag = false;
                            _secUserPasswordHistory.RowVersion = null;
                            _secUserPasswordHistory.SecUserID = (WebSecurity.CurrentUserId);
                            _ResetPasswordService.AddPasswordHistory(_secUserPasswordHistory);
                            TempData["Message"] = "Password changed.";
                        }
                        catch (Exception ex)
                        {
                            TempData["Message"] = "Error occured while changing Password." + ex.Message;
                        }
                    }
                    else
                    {
                        TempData["Message"] = "Hey, avoid random request on this page.";
                    }
                }
                else
                {
                    TempData["Message"] = "Username and token not maching.";
                }

            }
            return View(model);
        }

        static string HashData(string data)
        {

            SHA256 hasher = SHA256Managed.Create();

            byte[] hashedData = hasher.ComputeHash(

                Encoding.Unicode.GetBytes(data));



            // Now we'll make it into a hexadecimal string for saving

            StringBuilder sb = new StringBuilder(hashedData.Length * 2);

            foreach (byte b in hashedData)
            {

                sb.AppendFormat("{0:x2}", b);

            }

            return sb.ToString();

        }

        #endregion


        #region AddUser

        //public void CreateUser(UserInsert user)
        //{

        //    user.CreatedBy = 0;
        //    user.CreatedDate = DateTime.UtcNow;
        //    user.IsDeleted = false;
        //    user.UserType = 1;
        //    User _objUser = new User();
        //    _objUser.Active = user.Active;
        //    _objUser.AuthFacebookId = user.AuthFacebookId;
        //    _objUser.ConfirmPassword = user.ConfirmPassword;
        //    _objUser.CreatedBy = user.CreatedBy;
        //    _objUser.CreatedDate = user.CreatedDate;
        //    _objUser.DeletedBy = user.DeletedBy;
        //    _objUser.DeletedDate = user.DeletedDate;
        //    _objUser.Email = user.Email;
        //    _objUser.FirstName = user.FirstName;
        //    _objUser.IsDeleted = user.IsDeleted;
        //    _objUser.LastName = user.LastName;
        //    _objUser.Password = user.Password;
        //    _objUser.RoleIDs = user.RoleIDs;
        //    _objUser.UserId = user.UserId;
        //    _objUser.UserType = user.UserType;
        //    _objUser.IsSuperAdmin = user.IsSuperAdmin;
        //    uow.Repository<User>().Add(_objUser);
        //    uow.SaveChanges();
        //    int newIdentityValue = _objUser.UserId;
        //    try
        //    {
        //        if (!string.IsNullOrEmpty((_objUser.RoleIDs.ToString())))
        //        {
        //            string RoleIds = _objUser.RoleIDs.ToString();

        //            CreateUserRoles(newIdentityValue, RoleIds);
        //        }
        //    }
        //    catch (Exception Ex) { }
        //}
        #endregion
    }
}