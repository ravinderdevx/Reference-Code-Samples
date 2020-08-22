using FacePinPoint.Entities.Common;
using FacePinPoint.Entities.Request;
using FacePinPoint.Entities.Response;
using FacePinPoint.Repository.IRepository;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace FacePinPoint.Repository.Repository
{
    public class AdminRepository : IAdminRepository
    {
        #region Private 
        private MailContent mailContent = null;
        private LoginResponse loginResponse = null;
        private AdminDetailResponse adminDetailResponse = null;
        private BaseResponse baseResponse = null;
        private SearchFacesResponse searchFacesResponse = null;
        private SearchReportListResponse searchReportResponse = null;
        private UserFacesResponse userFacesResponse = null;
        private UserByRoleListResponse userByRoleListResponse = null;
        private AssignSearchResponse assignSearchResponse = null;
        private ChildAbuseLinkListResponse childAbuseLinkListResponse = null;
        private TagsDataResponse tagsDataResponse = null;
        private AdminUserListResponse adminUserListResponse = null;
        private BlurUserImageResponse blurUserImageResponse = null;
        private AdminTagsListResponse adminTagsListResponse = null;

        private SingleRoleListResponse singleRoleListResponse = null;
        private SingleUserReponse singleUserReponse = null;
        private SingleScreenListResponse singleScreenListResponse = null;
        private CreateUserResponse createUserResponse = null;
        private EmailExistsResponse emailExistsResponse = null;
        private RolesExistsResponse rolesExistsResponse = null;
        private GetCustomerListResponse getCustomerListResponse = null;
        private system_user system_user = null;
        private ScreenExistsResponse screenExistsResponse = null;
        private DashboardDetailsResponse dashboardDetailsResponse = null;
        private GetUserMenuReponse getUserMenuReponse = null;
        private AllScreenReponse allScreenReponse = null;
        private AdminUserRegistrationListResponse adminUserRegistrationListResponse = null;
        private GetValidateScreenResponse getValidateScreenResponse = null;
        private AdminChangePasswordResponse adminChangePasswordResponse = null;
        private SaveTagResponse saveTagResponse = null;
        private CreateRoleResponse createRoleResponse = null;
        private SingleCouponListResponse singleCouponListResponse = null;
        private AllReferralResponse allReferralResponse = null;
        private RefferalUserListBaseResponse refferalUserListBaseResponse = null;
        #endregion

        #region public
        public async Task<AdminDetailResponse> GetAdminDetailByEmail(string email)
        {
            try
            {
                adminDetailResponse = new AdminDetailResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    //adminDetailResponse.AdminDetail = await db.Admins.Where(x => x.Email == email).Select(x => new AdminDetail { Email = x.Email, Password = x.Password, Active = x.Active, AdminId = x.AdminId, CreatedDate = x.CreatedDate }).FirstOrDefaultAsync();
                    adminDetailResponse.AdminDetail = await (from U in db.Users
                                                             join UR in db.UserRoles on U.UserId equals UR.UserId
                                                             join R in db.Roles on UR.RoleId equals R.RoleId
                                                             where U.Email == email.ToLower() && U.Active == "Y" && UR.Active == "Y"
                                                             select new AdminDetail
                                                             {
                                                                 AdminId = U.UserId,
                                                                 Email = U.Email,
                                                                 Password = U.Password,
                                                                 RoleId = UR.RoleId,
                                                                 RoleName = R.RoleName
                                                             }).FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminDetailResponse.Success = false;
                adminDetailResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminDetailResponse;
        }
        public async Task<LoginResponse> Login(AdminLogin adminLogin)
        {
            try
            {
                loginResponse = new LoginResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var userDetailResponse = await GetAdminDetailByEmail(adminLogin.Email);
                    if (userDetailResponse.AdminDetail != null && userDetailResponse.Success)
                    {
                        var DecryptedPassword = AesEncryptionDecryption.Decrypt(userDetailResponse.AdminDetail.Password);

                        if (adminLogin.Password != DecryptedPassword)
                        {
                            loginResponse.IsLogin = false;
                            loginResponse.Success = false;
                            loginResponse.Message = CustomErrorMessages.INVALID_USERNAME_PASSWORD;
                        }
                        else
                        {
                            loginResponse.Token = EncodeDecodeToken.CreateEncryptedAuthenticateTicket(userDetailResponse.AdminDetail);
                            loginResponse.IsLogin = true;
                            loginResponse.Success = true;
                            loginResponse.Email = userDetailResponse.AdminDetail.Email;
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
        public async Task<BaseResponse> SaveAdminUserDetail(AdminUserDetail adminUserDetail)
        {
            try
            {
                baseResponse = new BaseResponse();
                var userDetailResponse = await GetAdminDetailByEmail(adminUserDetail.Email);
                if (userDetailResponse.AdminDetail == null && userDetailResponse.Success)
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        User createAdminUserDetail = new User();
                        createAdminUserDetail.Email = adminUserDetail.Email;
                        createAdminUserDetail.Password = AesEncryptionDecryption.Encrypt(adminUserDetail.ConfirmPassword);
                        createAdminUserDetail.CreatedDate = DateTime.Now;
                        createAdminUserDetail.Active = "Y";
                        db.Users.Add(createAdminUserDetail);
                        await db.SaveChangesAsync();

                        baseResponse.Success = true;
                        baseResponse.Message = null;
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.USER_ALREADY_EXIST;
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

        public async Task<SearchFacesResponse> GetAllFacesOFUser(int PageNumber)
        {
            try
            {
                searchFacesResponse = new SearchFacesResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT \"public\".\"fn_getAllSearchFaces\"(" + PageNumber + ")";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var hitRecordJsonStringResult = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                        searchFacesResponse.searchFaces = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SearchFaces>>(hitRecordJsonStringResult);
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                searchFacesResponse.Success = false;
                searchFacesResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return searchFacesResponse;
        }

        public async Task<SearchReportListResponse> GetAllSearchReports(SearchReportRequest SearchReportRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var UserDetail = await db.Users.Where(x => x.Email == loggedInUser && x.Active == "Y" && x.IsDeleted == false).FirstOrDefaultAsync();

                        if (UserDetail.UserId > 0)
                        {
                            searchReportResponse = new SearchReportListResponse();
                            string SQL_Query = "SELECT \"public\".\"fN_GetAllSearches\"(" + SearchReportRequest.PageNo + "," + SearchReportRequest.PageSize + ",'" + SearchReportRequest.SortColumn + "','" + SearchReportRequest.SortOrder + "','" + SearchReportRequest.UserEmail + "','" + SearchReportRequest.Status + "','" + SearchReportRequest.ControllerEmail + "', " + (SearchReportRequest.HitRecordid != null ? SearchReportRequest.HitRecordid : 0) + ",'" + SearchReportRequest.DateTime + "') AS json";
                            var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_Query).FirstOrDefaultAsync();
                            //var SearchesJson = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                            var jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject<SearchReportJson>(SearchesJson.json);
                            searchReportResponse.searchReport = jsonResult.array_to_json;
                            searchReportResponse.totalcount = jsonResult.count;
                            searchReportResponse.ControllerEmail = loggedInUser;
                            searchReportResponse.ControllerId = UserDetail.UserId;
                        }
                        else
                        {
                            searchReportResponse.Success = false;
                            searchReportResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                searchReportResponse.Success = false;
                searchReportResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return searchReportResponse;
        }
        public async Task<SearchFacesResponse> GetFacesOfUserByHitrecordId(UserFacesWithPageNumberRequest userFacesWithPageNumberRequest)
        {
            try
            {
                searchFacesResponse = new SearchFacesResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT \"public\".\"FN_GetUserSearchFaces\"(" + userFacesWithPageNumberRequest.HitrecordId + ',' + userFacesWithPageNumberRequest.PageNumber + ")";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var hitRecordJsonStringResult = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                        var searchFacesListJson = Newtonsoft.Json.JsonConvert.DeserializeObject<SearchFacesList>(hitRecordJsonStringResult);
                        searchFacesResponse.searchFaces = searchFacesListJson.results;
                        searchFacesResponse.totalCount = searchFacesListJson.totalCount;
                    }

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                searchFacesResponse.Success = false;
                searchFacesResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return searchFacesResponse;
        }

        public async Task<UserFacesResponse> GetUserFaces(UserFacesRequest userFacesRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var UserDetail = await db.Users.Where(x => x.Email == loggedInUser && x.Active == "Y" && x.IsDeleted == false).FirstOrDefaultAsync();

                        if (UserDetail.UserId > 0)
                        {
                            var q = db.SearchStatus.Where(x => x.HitRecordId == userFacesRequest.HitrecordId && x.ControllerUserId == UserDetail.UserId).FirstOrDefault<SearchStatu>();
                            q.Status = "I";
                            db.SaveChanges();

                            userFacesResponse = new UserFacesResponse();

                            var jsonResponse = await db.Database.SqlQuery<JsonRespone>("select \"public\".\"FN_GetUserFacesByHitrecord\"(" + userFacesRequest.HitrecordId + ") as json").FirstOrDefaultAsync();
                            var userfaceResonseList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UserFaces>>(jsonResponse.json);
                            userFacesResponse.UserFaces = userfaceResonseList.FirstOrDefault();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userFacesResponse.Success = false;
                userFacesResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userFacesResponse;
        }

        public async Task<UserByRoleListResponse> GetAllUserByRole(string Role, string searchString)
        {
            try
            {
                userByRoleListResponse = new UserByRoleListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    string sqlQuery = "select \"public\".\"FN_GetUsersByRole\"('" + Role + "','" + searchString + "') as json";
                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                    userByRoleListResponse.UserByRoles = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UserByRole>>(jsonResponse.json);
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                userByRoleListResponse.Success = false;
                userByRoleListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return userByRoleListResponse;
        }

        public async Task<AssignSearchResponse> AssignSearchController(AssignSearchRequest assignSearchRequest)
        {
            try
            {
                assignSearchResponse = new AssignSearchResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        string sqlQuery = "select \"public\".\"FN_AssignSearchToController\"(" + assignSearchRequest.Hitrecord + "," + assignSearchRequest.ControllerUserId + ",'" + loggedInUser + "') as json";
                        var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                        var jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject<AssignSearchJson>(jsonResponse.json);
                        assignSearchResponse.IsAssigned = jsonResult.lassigned;
                        assignSearchResponse.IsRedirect = jsonResult.lredirect;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                assignSearchResponse.Success = false;
                assignSearchResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return assignSearchResponse;
        }

        public async Task<BaseResponse> ProcessSearch(ProcessSearchRequest processSearchRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                //var loggedInUser = "admin@gmail.com";
                IRestResponse result;

                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var UserDetail = await db.Users.Where(x => x.Email == loggedInUser && x.Active == "Y" && x.IsDeleted == false).FirstOrDefaultAsync();

                        if (UserDetail.UserId > 0)
                        {
                            DeleteMultipleFacebiometricsResponse jsonResult = new DeleteMultipleFacebiometricsResponse();
                            switch (processSearchRequest.Action)
                            {
                                // Delete fake image
                                case 1:
                                    int[] FakeIdList = processSearchRequest.SelectedFaces.Select(x => x.ResultId).ToArray();
                                    result = DeleteMultipleFaceBiometricsList(FakeIdList);
                                    jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject<DeleteMultipleFacebiometricsResponse>(result.Content);
                                    if (jsonResult == null || jsonResult.result == false)
                                    {
                                        baseResponse.Success = false;
                                        baseResponse.Message = jsonResult.message;
                                        return baseResponse;
                                    }
                                    break;

                                // Delete child abuse
                                case 2:

                                    foreach (var image in processSearchRequest.SelectedFaces)
                                    {
                                        ChildAbuseLink childAbuseLink = new ChildAbuseLink();
                                        childAbuseLink.parentfilename = image.ParentFilename;
                                        childAbuseLink.DateTime = DateTime.Now;
                                        childAbuseLink.Active = "Y";
                                        childAbuseLink.ControllerId = UserDetail.UserId;
                                        db.ChildAbuseLinks.Add(childAbuseLink);
                                    }

                                    int[] ChildIdList = processSearchRequest.SelectedFaces.Select(x => x.ResultId).ToArray();
                                    result = DeleteMultipleFaceBiometricsList(ChildIdList);
                                    jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject<DeleteMultipleFacebiometricsResponse>(result.Content);
                                    if (jsonResult == null || jsonResult.result == false)
                                    {
                                        baseResponse.Success = false;
                                        baseResponse.Message = jsonResult.message;
                                        return baseResponse;
                                    }
                                    await db.SaveChangesAsync();
                                    break;

                                // Verify Images
                                case 3:
                                    if (processSearchRequest.FlagedFaces != null && processSearchRequest.FlagedFaces.Count > 0)
                                    {
                                        foreach (var image in processSearchRequest.FlagedFaces)
                                        {
                                            ChildAbuseLink childAbuseLink = new ChildAbuseLink();
                                            childAbuseLink.parentfilename = image.ParentFilename;
                                            childAbuseLink.DateTime = DateTime.Now;
                                            childAbuseLink.Active = "Y";
                                            childAbuseLink.ControllerId = UserDetail.UserId;
                                            db.ChildAbuseLinks.Add(childAbuseLink);
                                        }
                                        int[] FlagedIdList = processSearchRequest.FlagedFaces.Select(x => x.ResultId).ToArray();
                                        result = DeleteMultipleFaceBiometricsList(FlagedIdList);

                                        jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject<DeleteMultipleFacebiometricsResponse>(result.Content);
                                        if (jsonResult == null || jsonResult.result == false)
                                        {
                                            baseResponse.Success = false;
                                            baseResponse.Message = jsonResult.message;
                                            return baseResponse;
                                        }
                                        await db.SaveChangesAsync();

                                    }

                                    int[] idList = processSearchRequest.SelectedFaces.Select(x => x.ResultId).ToArray();
                                    var multiplefacebiometrics = db.multiplefacebiometrics.Where(f => idList.Contains(f.id)).ToList();
                                    multiplefacebiometrics.ForEach(a => a.verified = true);
                                    await db.SaveChangesAsync();

                                    string resultString = string.Join(",", idList);
                                    string sqlQuery = "select \"public\".\"fn_SaveUserSearch\"(" + processSearchRequest.HitRecordId + ",'" + resultString + "') as json";
                                    var jsonResponse = await db.Database.SqlQuery<bool>(sqlQuery).FirstOrDefaultAsync();

                                    var q = db.SearchStatus.Where(x => x.HitRecordId == processSearchRequest.HitRecordId && x.ControllerUserId == UserDetail.UserId).FirstOrDefault<SearchStatu>();
                                    q.Status = "C";
                                    db.SaveChanges();
                                    break;
                            }
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

        public async Task<ChildAbuseLinkListResponse> GetAllChildAbuseLink(ChildAbuseLinkRequest childAbuseLinkRequest)
        {
            try
            {
                childAbuseLinkListResponse = new ChildAbuseLinkListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"FN_GetAllChildAbuseLink\"(" + childAbuseLinkRequest.PageNo + "," + childAbuseLinkRequest.PageSize + ",'" + childAbuseLinkRequest.SortColumn + "','" + childAbuseLinkRequest.SortOrder + "','" + childAbuseLinkRequest.Email + "'," + (childAbuseLinkRequest.ChildAbuseLinkId > 0 ? childAbuseLinkRequest.ChildAbuseLinkId : 0) + ",'" + childAbuseLinkRequest.DateTime + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<ChildAbuseLinkList>(SearchesJson.json);
                    childAbuseLinkListResponse.resultdata = resultJson.resultdata;
                    childAbuseLinkListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                childAbuseLinkListResponse.Success = false;
                childAbuseLinkListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return childAbuseLinkListResponse;
        }

        public async Task<BaseResponse> ApplyTagOnFace(ApplyTagOnFaceRequest applyTagOnFaceRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;

                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var UserDetail = await db.Users.Where(x => x.Email == loggedInUser && x.Active == "Y" && x.IsDeleted == false).FirstOrDefaultAsync();

                        if (UserDetail.UserId > 0)
                        {
                            int[] idList = applyTagOnFaceRequest.faceImage.Select(x => x.ResultId).ToArray();
                            int[] tagList = applyTagOnFaceRequest.Tags.Select(x => x.TagId).ToArray();

                            string sqlQuery = "select \"public\".\"fn_attachtags\"('" + String.Join(",", tagList) + "','{" + String.Join(",", idList) + "}'," + UserDetail.UserId + ") as json";
                            var jsonResponse = await db.Database.SqlQuery<bool>(sqlQuery).FirstOrDefaultAsync();
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

        public async Task<BaseResponse> BlockClientProfile(BlockClientProfileRequest blockClientProfileRequest)
        {
            try
            {
                    baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    system_user systemUser = await db.system_user.Where(x => x.id == blockClientProfileRequest.UserId).FirstOrDefaultAsync();
                    systemUser.Blocked = "Y";
                    await db.SaveChangesAsync();

                    var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_get_block_unblockemail\"('BlockedEmail', '" + systemUser.FirstName + "','" + systemUser.LastName + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\" = 'Block'").FirstOrDefaultAsync();
                    mailContent = new MailContent();
                    mailContent.ToEmail = systemUser.email;
                    mailContent.MsgSubject = templateResponse.Subject;
                    mailContent.MsgBody = templateResponse.Template;

                    // Email sender
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

        public async Task<TagsDataResponse> GetAllTags(string tagSearch)
        {
            try
            {
                tagsDataResponse = new TagsDataResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    string SQL_Query = "SELECT \"public\".\"fn_getalltags\"('" + tagSearch + "') AS json";
                    var TagsJson = await db.Database.SqlQuery<JsonRespone>(SQL_Query).FirstOrDefaultAsync();

                    tagsDataResponse.TagsData = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AdminTags>>(TagsJson.json);

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                tagsDataResponse.Success = false;
                tagsDataResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return tagsDataResponse;
        }

        public async Task<User> GetUserDetail(string userName)
        {
            User UserDetail = new User();
            if (!string.IsNullOrEmpty(userName))
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    UserDetail = await db.Users.Where(x => x.Email == userName && x.Active == "Y" && x.IsDeleted == false).FirstOrDefaultAsync();
                }
            }
            return UserDetail;
        }

        public async Task<int> GetUserId(string userName)
        {
            int userId = 0;
            if (!string.IsNullOrEmpty(userName))
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    userId = await db.Users.Where(x => x.Email == userName && x.Active == "Y" && x.IsDeleted == false).Select(x => x.UserId).FirstOrDefaultAsync();
                }
            }
            return userId;
        }

        public async Task<AdminUserListResponse> GetAllAdminUser(AdminUserRequest adminUserRequest)
        {
            try
            {
                adminUserListResponse = new AdminUserListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_getalladminuser\"(" + adminUserRequest.PageNo + "," + adminUserRequest.PageSize + ",'" + adminUserRequest.SortColumn + "','" + adminUserRequest.SortOrder + "', " + (adminUserRequest.UserId > 0 ? adminUserRequest.UserId : 0) + ",'" + adminUserRequest.Email + "','" + adminUserRequest.RoleId + "','" + adminUserRequest.FirstName + "','" + adminUserRequest.LastName + "','" + adminUserRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<AdminUserList>(SearchesJson.json);
                    adminUserListResponse.resultdata = resultJson.resultdata;
                    adminUserListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminUserListResponse.Success = false;
                adminUserListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminUserListResponse;
        }

        public async Task<BlurUserImageResponse> BlurUserImage(BlurUserImageRequest blurUserImageRequest)
        {
            try
            {
                blurUserImageResponse = new BlurUserImageResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;

                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var MultipleFaceBiometricDetails = await db.multiplefacebiometrics.Where(x => x.id == blurUserImageRequest.MultipleFaceBiometricId).FirstOrDefaultAsync();
                                            
                        if (MultipleFaceBiometricDetails != null)
                        {
                            var checkBlurred = await db.Blurreds.Where(x => x.PreviousId == blurUserImageRequest.MultipleFaceBiometricId).FirstOrDefaultAsync();
                            string ImageFilePath = "";
                            var image = "";
                            if (checkBlurred == null)
                            {
                                ImageFilePath = MultipleFaceBiometricDetails.facefilepath;
                            }
                            else
                            {
                                ImageFilePath = checkBlurred.NewFilePath;
                            }

                            using (Bitmap BitMapImageVar = new Bitmap(ImageFilePath))
                            {

                                //Bitmap BitMapImage = new Bitmap("F:\\testing\\2017-10-17_13.36.3_d8e2352b-6bd7-452d-bc92-e3ff37401ccc.jpg");

                                Bitmap BitMapImage = Blur(BitMapImageVar, new Rectangle(blurUserImageRequest.x1, blurUserImageRequest.y1, blurUserImageRequest.width, blurUserImageRequest.height), 3);

                                System.DateTime myDate = DateTime.Now;
                                int year = myDate.Year;
                                int month = myDate.Month;
                                int day = myDate.Day;
                                int hour = myDate.Hour;
                                int minute = myDate.Minute;
                                int second = myDate.Second;

                                var FilePath = ApplicationConfiguration.FACE_IMAGES_LOCAL_URL + "faces\\multi\\" + year + "-" + month + "-" + day;
                                //var FilePath ="F:\\faces\\multi\\" + year + "-" + month + "-"+day;

                                if (!Directory.Exists(FilePath))  // if it doesn't exist, create
                                    Directory.CreateDirectory(FilePath);

                                image = FilePath + "\\" + year + "-" + month + "-" + day + "_" + hour + "." + minute + "." + second + "_" + Guid.NewGuid() + ".jpg";
                                BitMapImage.Save(image);
                            }


                            if (checkBlurred == null)
                            {
                                Blurred blurred = new Blurred();
                                blurred.CreatedDate = DateTime.Now;
                                blurred.NewFilePath = image;
                                blurred.PreviousId = blurUserImageRequest.MultipleFaceBiometricId;
                                db.Blurreds.Add(blurred);
                            }
                            else
                            {
                                FileInfo file = new FileInfo(checkBlurred.NewFilePath);
                                if (file.Exists)
                                {
                                    file.Delete();
                                }
                                checkBlurred.CreatedDate = DateTime.Now;
                                checkBlurred.NewFilePath = image;
                                checkBlurred.PreviousId = blurUserImageRequest.MultipleFaceBiometricId;
                            }

                            await db.SaveChangesAsync();
                            StringBuilder builder = new StringBuilder(image);
                            builder.Replace(ApplicationConfiguration.FACE_IMAGES_LOCAL_URL, ApplicationConfiguration.FACE_IMAGES_URL);
                            builder.Replace(@"\", "/");

                            blurUserImageResponse.BlurImagePath = builder.ToString();
                        }
                        else
                        {

                        }
                    }
                }
                else
                {

                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                blurUserImageResponse.Success = false;
                blurUserImageResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return blurUserImageResponse;
        }

        public async Task<AdminTagsListResponse> GetAllTagList(AdminTagsRequest adminTagsRequest)
        {
            try
            {
                adminTagsListResponse = new AdminTagsListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"FN_getTags\"(" + adminTagsRequest.PageNo + "," + adminTagsRequest.PageSize + ",'" + adminTagsRequest.SortColumn + "','" + adminTagsRequest.SortOrder + "', " + (adminTagsRequest.TagId > 0 ? adminTagsRequest.TagId : 0) + ",'" + adminTagsRequest.TagName + "', '" + adminTagsRequest.Active + "', '" + adminTagsRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<AdminTagsList>(SearchesJson.json);
                    adminTagsListResponse.resultdata = resultJson.resultdata;
                    adminTagsListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminTagsListResponse.Success = false;
                adminTagsListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminTagsListResponse;
        }

        public async Task<SaveTagResponse> SaveTags(TagRequest tagRequest)
        {
            try
            {
                saveTagResponse = new SaveTagResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    Tag tag = new Tag();
                    tag.TagName = tagRequest.TagName;
                    tag.ImageFilePath = tagRequest.ImageFilePath;
                    tag.CreatedDate = DateTime.Now;
                    tag.Active = "Y";

                    db.Tags.Add(tag);
                    await db.SaveChangesAsync();


                    AdminTags adminTags = new AdminTags();
                    adminTags.Active = tag.Active;
                    adminTags.CreatedDate = tag.CreatedDate;
                    adminTags.TagId = tag.TagId;
                    adminTags.TagName = tag.TagName;
                    adminTags.ImageFilePath = tag.ImageFilePath;

                    saveTagResponse.NewTag = adminTags;

                    saveTagResponse.Success = true;
                    saveTagResponse.Message = null;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                saveTagResponse.Success = false;
                saveTagResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return saveTagResponse;
        }

        public async Task<BaseResponse> DeleteTags(DeleteTagRequest deleteTagRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Tag tag = db.Tags.Where(x => x.TagId == deleteTagRequest.TagId).FirstOrDefault();
                            

                            FileInfo file = new FileInfo(HttpContext.Current.Server.MapPath(tag.ImageFilePath));
                            if (file.Exists)
                            {
                                file.Delete();
                            }

                            db.Tags.Remove(tag);
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<BaseResponse> ActiveDeActiveTags(ActiveDeActiveTagRequest activeDeActiveTagRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Tag tag = db.Tags.Where(x => x.TagId == activeDeActiveTagRequest.TagId).FirstOrDefault();
                            tag.Active = activeDeActiveTagRequest.Active;
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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
        #region AdminDashboard
        public async Task<DashboardDetailsResponse> GetDashboardDetails()
        {
            try
            {
                dashboardDetailsResponse = new DashboardDetailsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var adminDashboardDetailsResponse = await db.Database.SqlQuery<DashboardDetails>("select \"public\".\"fn_getDashboardDetails\"() as \"counts\"").FirstOrDefaultAsync();

                    dashboardDetailsResponse.dashboardCounts = Newtonsoft.Json.JsonConvert.DeserializeObject<DashboardCounts>(adminDashboardDetailsResponse.counts);

                    dashboardDetailsResponse.Success = true;
                    dashboardDetailsResponse.Message = null;
                }

            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                dashboardDetailsResponse.Success = false;
                dashboardDetailsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return dashboardDetailsResponse;
        }

        #endregion

        #region Role
        public async Task<SingleRoleListResponse> GetAllRoles(RoleRequest roleRequest)
        {
            try
            {
                singleRoleListResponse = new SingleRoleListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_getallroles\"(" + roleRequest.PageNo + "," + roleRequest.PageSize + ",'" + roleRequest.SortColumn + "','" + roleRequest.SortOrder + "', " + (roleRequest.RoleId > 0 ? roleRequest.RoleId : 0) + ",'" + roleRequest.RoleName + "','" + roleRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<SingleRoleList>(SearchesJson.json);
                    singleRoleListResponse.resultdata = resultJson.resultdata;
                    singleRoleListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                singleRoleListResponse.Success = false;
                singleRoleListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return singleRoleListResponse;
        }

        public async Task<SingleRoleListResponse> GetRoles()
        {
            try
            {
                singleRoleListResponse = new SingleRoleListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    singleRoleListResponse.resultdata = await db.Roles.Where(x => x.Active == "Y" && x.IsDeleted == false).Select(x => new SingleRole
                    {
                        RoleId = x.RoleId,
                        RoleName = x.RoleName,
                        CreatedDate = x.CreatedDate,
                        Active = x.Active
                    }).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                singleRoleListResponse.Success = false;
                singleRoleListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return singleRoleListResponse;
        }

        public async Task<BaseResponse> DeleteRole(DeleteRoleRequest deleteRoleRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    var isAdmin = await CheckUserEmailRole(loggedInUser);
                    if (isAdmin)
                    {

                        using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                Role roleDate = await db.Roles.Where(x => x.RoleId == deleteRoleRequest.RoleId).FirstOrDefaultAsync();
                                roleDate.DeletedBy = userID;
                                roleDate.DeletedDate = DateTime.Now;
                                roleDate.IsDeleted = true;
                                await db.SaveChangesAsync();
                            }
                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<CreateRoleResponse> CreateRole(CreateRoleRequest createRoleRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                createRoleResponse = new CreateRoleResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userID = await GetUserId(loggedInUser);
                        if (userID > 0)
                        {
                            int RoleCount = await db.Roles.Where(x => x.RoleName == createRoleRequest.RoleName && x.IsDeleted == false).CountAsync();
                            if (RoleCount == 0)
                            {
                                string resultString = string.Join(",", createRoleRequest.MenuIds);
                                string sqlQuery = "select \"public\".\"FN_CreateUpdateRole\"(" + 0 + ",'" + createRoleRequest.RoleName + "','" + resultString + "') as json";
                                var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                                var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<SingleRole>(jsonResponse.json);
                                createRoleResponse.NewRoleDetails = resultJson;
                                createRoleResponse.Success = true;
                                createRoleResponse.Message = null;
                            }
                            else
                            {
                                createRoleResponse.Success = false;
                                createRoleResponse.Message = CustomErrorMessages.ROLE_ALREADY_EXIST;
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                createRoleResponse.Success = false;
                createRoleResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return createRoleResponse;
        }

        public async Task<BaseResponse> UpdateRole(UpdateRoleRequest updateRoleRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                int RoleCount = await db.Roles.Where(x => x.RoleName == updateRoleRequest.RoleName && x.RoleId != updateRoleRequest.RoleId && x.IsDeleted == false).CountAsync();
                                if (RoleCount == 0)
                                {
                                    string resultString = string.Join(",", updateRoleRequest.MenuIds);
                                    string sqlQuery = "select \"public\".\"FN_CreateUpdateRole\"(" + updateRoleRequest.RoleId + ",'" + updateRoleRequest.RoleName + "','" + resultString + "') as json";
                                    var jsonResponse = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.ROLE_ALREADY_EXIST;
                                }
                            }
                            else
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<BaseResponse> ActiveInActiveRole(ActiveDeActiveRoleRequest activeDeActiveRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                Role role = new Role();
                                role = await db.Roles.Where(x => x.RoleId == activeDeActiveRequest.RoleId).FirstOrDefaultAsync();
                                role.Active = activeDeActiveRequest.Active;
                                role.ModifiedBy = userID;
                                await db.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<RolesExistsResponse> RoleExists(string role)
        {
            try
            {
                rolesExistsResponse = new RolesExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    rolesExistsResponse.IsRoleExists = await db.Roles.Where(x => x.RoleName.ToLower() == role.ToLower()).AnyAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                rolesExistsResponse.Success = false;
                rolesExistsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return rolesExistsResponse;
        }

        public async Task<AllScreenReponse> GetAllScreenList(int? RoleId)
        {
            try
            {
                allScreenReponse = new AllScreenReponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    string sqlQuery = "select \"public\".\"GetAllMenus\"(" + (RoleId != null ? RoleId : 0) + ") as json";
                    var ScreenJson = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AdminMenuList>>(ScreenJson.json);
                    allScreenReponse.ScreenList = resultJson;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                allScreenReponse.Success = false;
                allScreenReponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return allScreenReponse;
        }
        #endregion

        #region User 
        public async Task<CreateUserResponse> CreateAdminUser(CreateAdminUserRequest createAdminUserRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                createUserResponse = new CreateUserResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int userID = await GetUserId(loggedInUser);
                        if (userID > 0)

                        {
                            //user.UserDetail.Password = AesEncryptionDecryption.Decrypt(user.UserDetail.Password);
                            // system_user.password = AesEncryptionDecryption.Encrypt(changePasswordRequest.NewPassword);
                            var EmailCheck = await AddAdminUserEmailExists(createAdminUserRequest.Email);
                            if (EmailCheck.IsEmailExists == false)
                            {
                                string RandomPassword = CreateRandomPassword(8);
                                var EncryptPassword = AesEncryptionDecryption.Encrypt(RandomPassword);

                                User user = new User();
                                user.FirstName = createAdminUserRequest.FirstName;
                                user.LastName = createAdminUserRequest.LastName;
                                user.Password = EncryptPassword;
                                user.Email = createAdminUserRequest.Email.ToLower();
                                user.IsDeleted = false;
                                user.Active = "Y";
                                user.CreatedBy = userID;
                                user.CreatedDate = DateTime.Now;
                                db.Users.Add(user);
                                await db.SaveChangesAsync();

                                var DecryptPassword = AesEncryptionDecryption.Decrypt(EncryptPassword);

                                UserRole userRole = new FacePinPoint.Repository.UserRole();
                                userRole.RoleId = createAdminUserRequest.RoleId;
                                userRole.Active = "Y";
                                userRole.IsDeleted = false;
                                userRole.CreatedBy = userID;
                                userRole.CreatedDate = DateTime.Now;
                                userRole.UserId = user.UserId;
                                db.UserRoles.Add(userRole);
                                await db.SaveChangesAsync();

                                createUserResponse.NewUserDetails = await (from USR in db.Users
                                                                           join UR in db.UserRoles on USR.UserId equals UR.UserId
                                                                           join R in db.Roles on UR.RoleId equals R.RoleId
                                                                           where USR.UserId == user.UserId && USR.IsDeleted == false
                                                                           select new AdminUser
                                                                           {
                                                                               Active = USR.Active,
                                                                               RoleName = R.RoleName,
                                                                               Email = USR.Email,
                                                                               CreatedDate = USR.CreatedDate,
                                                                               FirstName = USR.FirstName,
                                                                               LastName = USR.LastName,
                                                                               UserId = USR.UserId,
                                                                               RoleId = R.RoleId
                                                                           }).FirstOrDefaultAsync();
                                mailContent = new MailContent();
                                mailContent.ToEmail = user.Email;
                                mailContent.bcc = ApplicationConfiguration.EMAIL_RECEIVER;
                                mailContent.MsgSubject = "Credentials Details";
                                mailContent.MsgBody = "Email : " + user.Email + " and Password : " + DecryptPassword;
                                EmailSender.MailSender(mailContent);
                                createUserResponse.Success = true;
                                createUserResponse.Message = null;
                            }
                            else
                            {
                                baseResponse.Success = false;
                                baseResponse.Message = CustomErrorMessages.EMAIL_ALREADY_EXIST;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                createUserResponse.Success = false;
                createUserResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return createUserResponse;
        }

        public async Task<AdminUserListResponse> DeleteAdminUser(DeleteAdminUserRequest deleteAdminUserRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                adminUserListResponse = new AdminUserListResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    var isAdmin = await CheckUserEmailRole(loggedInUser);
                    if (isAdmin)
                    {
                        using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                User userdetail = await db.Users.Where(x => x.UserId == deleteAdminUserRequest.UserId).FirstOrDefaultAsync();
                                userdetail.IsDeleted = true;
                                userdetail.DeletedBy = userID;
                                userdetail.DeletedDate = DateTime.Now;
                                await db.SaveChangesAsync();

                                //SearchStatu searchStatus = await db.SearchStatus.Where(x => x.com== deleteAdminUserRequest.UserId && x=>x.Status).FirstOrDefaultAsync();
                                //db.SearchStatus.Remove(searchStatus);
                                //await db.SaveChangesAsync();


                                adminUserListResponse.Success = true;
                                adminUserListResponse.Message = null;
                            }
                        }
                    }
                    else
                    {
                        adminUserListResponse.Success = false;
                        adminUserListResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminUserListResponse.Success = false;
                adminUserListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminUserListResponse;
        }

        public async Task<BaseResponse> ActiveInActiveAdminUser(ActiveDeActiveAdminUserRequest activeDeActiveAdminUserRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                // var loggedInUser = "admin@gmail.com";
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    var isAdmin = await CheckUserEmailRole(loggedInUser);
                    if (isAdmin)
                    {
                        using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                User userDetail = new User();
                                userDetail = await db.Users.Where(x => x.UserId == activeDeActiveAdminUserRequest.UserId).FirstOrDefaultAsync();
                                userDetail.Active = activeDeActiveAdminUserRequest.Active;
                                userDetail.ModifiedBy = userID;
                                await db.SaveChangesAsync();
                            }
                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<SingleUserReponse> ReadAdminUser(ReadAdminUserRequest readAdminUserRequest)
        {
            try
            {
                singleUserReponse = new SingleUserReponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    string sqlQuery = "select \"public\".\"FN_GetUserWithRole\"(" + readAdminUserRequest.UserId + ") as json";
                    singleUserReponse.SingleUser = await db.Database.SqlQuery<SingleUser>(sqlQuery).FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                singleUserReponse.Success = false;
                singleUserReponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return singleUserReponse;
        }

        public async Task<BaseResponse> UpdateAdminUser(UpdatAdminUserRequest updatAdminUserRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    var isAdmin = await CheckUserEmailRole(loggedInUser);
                    if (isAdmin)
                    {
                        using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                baseResponse = new BaseResponse();
                                var EmailCheck = await EmailExists(updatAdminUserRequest.Email, updatAdminUserRequest.UserId);

                                if (EmailCheck.IsEmailExists == false)
                                {
                                    if (!string.IsNullOrEmpty(updatAdminUserRequest.Email) && !string.IsNullOrEmpty(updatAdminUserRequest.FirstName) && !string.IsNullOrEmpty(updatAdminUserRequest.LastName))
                                    {
                                        User userDetail = await db.Users.Where(x => x.UserId == updatAdminUserRequest.UserId).FirstOrDefaultAsync();
                                        userDetail.FirstName = updatAdminUserRequest.FirstName;
                                        userDetail.LastName = updatAdminUserRequest.LastName;
                                        userDetail.Email = updatAdminUserRequest.Email.ToLower();
                                        userDetail.ModifiedBy = userID;
                                        userDetail.ModifiedDate = DateTime.Now;
                                    }
                                    if (updatAdminUserRequest.RoleId > 0)
                                    {
                                        UserRole userRoleDetail = await db.UserRoles.Where(x => x.UserId == updatAdminUserRequest.UserId).FirstOrDefaultAsync();
                                        userRoleDetail.RoleId = Convert.ToInt32(updatAdminUserRequest.RoleId);
                                        userRoleDetail.ModifiedBy = userID;
                                        userRoleDetail.ModifiedDate = DateTime.Now;
                                    }
                                    await db.SaveChangesAsync();
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.EMAIL_ALREADY_EXIST;
                                }

                            }
                        }
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<EmailExistsResponse> AddAdminUserEmailExists(string email)
        {
            try
            {
                emailExistsResponse = new EmailExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    emailExistsResponse.IsEmailExists = await db.Users.Where(x => x.Email == email && x.IsDeleted == false).AnyAsync();
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
        #endregion

        #region customers
        public async Task<GetCustomerListResponse> GetAllCustomers(CustomerRequest customerRequest)
        {
            try
            {
                getCustomerListResponse = new GetCustomerListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"FN_getAllCustomersList\"(" + customerRequest.PageNo + "," + customerRequest.PageSize + ",'" + customerRequest.SortColumn + "','" + customerRequest.SortOrder + "', " + (customerRequest.id > 0 ? customerRequest.id : 0) + ",'" + customerRequest.FirstName + "','" + customerRequest.LastName + "','" + customerRequest.Email + "','" + customerRequest.enabled + "','" + customerRequest.Blocked + "','" + customerRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<GetCustomerList>(SearchesJson.json);
                    getCustomerListResponse.resultdata = resultJson.resultdata;
                    getCustomerListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminUserListResponse.Success = false;
                adminUserListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return getCustomerListResponse;
        }

        public async Task<BaseResponse> UpdateCustomer(UpdateCustomerRequest updateCustomerRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                if (updateCustomerRequest.id > 0)
                                {
                                    var EmailCheck = await CustomerEmailExists(updateCustomerRequest.Email, updateCustomerRequest.id);

                                    if (EmailCheck.IsEmailExists == false)
                                    {
                                        system_user system_user = new system_user();
                                        system_user = await db.system_user.Where(x => x.id == updateCustomerRequest.id).FirstOrDefaultAsync();
                                        system_user.FirstName = updateCustomerRequest.FirstName;
                                        system_user.LastName = updateCustomerRequest.LastName;
                                        system_user.email = updateCustomerRequest.Email;
                                        await db.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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
        public async Task<BaseResponse> ActiveInActiveCustomer(ActiveDeActiveAdminCustomerRequest activeDeActiveAdminCustomerRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                baseResponse = new BaseResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                if (activeDeActiveAdminCustomerRequest.id > 0)
                                {
                                    system_user system_user = new system_user();
                                    system_user = await db.system_user.Where(x => x.id == activeDeActiveAdminCustomerRequest.id).FirstOrDefaultAsync();
                                    system_user.Blocked = activeDeActiveAdminCustomerRequest.Blocked;
                                    //userDetail.ModifiedBy = userID;
                                    await db.SaveChangesAsync();
                                }
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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
        public async Task<EmailExistsResponse> CustomerEmailExists(string email, int? id)
        {
            try
            {
                emailExistsResponse = new EmailExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    if (id > 0)
                    {
                        emailExistsResponse.IsEmailExists = await db.system_user.Where(x => x.email == email && x.id != id).AnyAsync();
                    }
                    else
                    {
                        emailExistsResponse.IsEmailExists = await db.system_user.Where(x => x.email == email).AnyAsync();
                    }
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
        public async Task<BaseResponse> DeleteCustomer(DeleteCustomerRequest deleteCustomerRequest)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                UserDetail userDetail = new FacePinPoint.Repository.UserDetail();
                baseResponse = new BaseResponse();

                adminUserListResponse = new AdminUserListResponse();
                if (!string.IsNullOrEmpty(loggedInUser))
                {

                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            int userID = await GetUserId(loggedInUser);
                            if (userID > 0)
                            {
                                if (deleteCustomerRequest.id > 0)
                                {
                                    system_user system_user = await db.system_user.Where(x => x.id == deleteCustomerRequest.id).FirstOrDefaultAsync();
                                    system_user.IsDeleted = true;
                                    await db.SaveChangesAsync();
                                    userDetail = await db.UserDetails.Where(x => x.UserId == deleteCustomerRequest.id).FirstOrDefaultAsync();
                                    if (userDetail != null)
                                    {
                                        userDetail.Active = "N";
                                        await db.SaveChangesAsync();
                                    }

                                    baseResponse.Success = true;
                                    baseResponse.Message = null;
                                }
                            }
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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


        #endregion

        #region  Screen

        public async Task<SingleScreenListResponse> GetAllScreen(ScreenRequest screenRequest)
        {
            try
            {
                singleScreenListResponse = new SingleScreenListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_getallscreen\"(" + screenRequest.PageNo + "," + screenRequest.PageSize + ",'" + screenRequest.SortColumn + "','" + screenRequest.SortOrder + "', " + (screenRequest.ScreenId > 0 ? screenRequest.ScreenId : 0) + ",'" + screenRequest.ScreenName + "','" + screenRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<SingleScreenList>(SearchesJson.json);
                    singleScreenListResponse.resultdata = resultJson.resultdata;
                    singleScreenListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                singleScreenListResponse.Success = false;
                singleScreenListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return singleScreenListResponse;
        }

        public async Task<BaseResponse> DeleteScreen(DeleteScreenRequest deleteScreenRequest)
        {
            try
            {
                baseResponse = new BaseResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {

                    Screen screenDate = await db.Screens.Where(x => x.ScreenId == deleteScreenRequest.ScreenId).FirstOrDefaultAsync();
                    screenDate.IsDeleted = true;
                    await db.SaveChangesAsync();

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
        public async Task<BaseResponse> CreateScreen(CreateScreenRequest createScreenequest)
        {
            try
            {

                baseResponse = new BaseResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    Screen screen = new Screen();
                    screen.ScreenName = createScreenequest.ScreenName;
                    screen.IsDeleted = false;
                    screen.Active = "Y";
                    screen.CreatedDate = DateTime.Now;
                    db.Screens.Add(screen);
                    await db.SaveChangesAsync();

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
        public async Task<BaseResponse> UpdateScreen(UpdateScreenRequest updateScreenRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {

                    Screen screen = new Screen();
                    screen = await db.Screens.Where(x => x.ScreenId == updateScreenRequest.ScreenId).FirstOrDefaultAsync();
                    screen.ScreenName = updateScreenRequest.ScreenName;
                    await db.SaveChangesAsync();
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
        public async Task<ScreenExistsResponse> ScreenExists(string screen)
        {
            try
            {
                screenExistsResponse = new ScreenExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    screenExistsResponse.IsScreenExists = await db.Screens.Where(x => x.ScreenName == screen).AnyAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                rolesExistsResponse.Success = false;
                rolesExistsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return screenExistsResponse;
        }
        public async Task<BaseResponse> ActiveInActiveScreen(ActiveDeActiveScreenRequest activeDeActiveScreenRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    Screen screen = new Screen();
                    screen = await db.Screens.Where(x => x.ScreenId == activeDeActiveScreenRequest.ScreenId).FirstOrDefaultAsync();
                    screen.Active = activeDeActiveScreenRequest.Active;
                    screen.CreatedDate = DateTime.Now;
                    await db.SaveChangesAsync();
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

        #region Coupons
        public async Task<SingleCouponListResponse> GetAllCoupons(CouponsRequest couponRequest)
        {
            try
            {
                singleCouponListResponse = new SingleCouponListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_get_all_coupons\"(" + couponRequest.PageNo + "," + couponRequest.PageSize + ",'" + couponRequest.SortColumn + "','" + couponRequest.SortOrder + "', '" + (couponRequest.CouponId > 0 ? couponRequest.CouponId : 0) + "','" + couponRequest.CouponName + "','" + couponRequest.CouponCode + "','" + couponRequest.ExpiryDate + "','" +couponRequest.Active + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<SingleCouponList>(SearchesJson.json);
                    singleCouponListResponse.resultdata = resultJson.resultdata;
                    singleCouponListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                singleRoleListResponse.Success = false;
                singleRoleListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return singleCouponListResponse;
        }
        public async Task<BaseResponse> CreateUpdateCoupons(CreateCouponRequest createCouponRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Coupon coupon = null;
                            if (createCouponRequest.CouponId > 0)
                            {
                                // Update
                                coupon = new Coupon();
                                coupon = await db.Coupons.Where(x => x.CouponId != createCouponRequest.CouponId && x.CouponCode == createCouponRequest.CouponCode && x.IsDeleted == false).FirstOrDefaultAsync();
                                if (createCouponRequest.CouponCode == null)
                                {
                                    Coupon updateCoupon = new Coupon();
                                    updateCoupon = await db.Coupons.Where(x => x.CouponId == createCouponRequest.CouponId && x.IsDeleted == false).FirstOrDefaultAsync();
                                    updateCoupon.CouponName = createCouponRequest.CouponName;
                                    updateCoupon.CouponCode = createCouponRequest.CouponCode;
                                    updateCoupon.Discount = createCouponRequest.Discount;
                                    updateCoupon.ExpiryDate = createCouponRequest.ExpiryDateTime;
                                    updateCoupon.IsDeleted = false;
                                    updateCoupon.NoExpiry = false;
                                    updateCoupon.Active = "Y";
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.COUPON_ALREADY_EXIST;
                                }
                            }
                            else
                            {
                                // Create
                                coupon = await db.Coupons.Where(x => x.CouponCode == createCouponRequest.CouponCode && x.IsDeleted == false).FirstOrDefaultAsync();
                                if (coupon == null)
                                {
                                    coupon = new Coupon();
                                    coupon.CouponName = createCouponRequest.CouponName;
                                    coupon.CouponCode = createCouponRequest.CouponCode;
                                    coupon.Discount = createCouponRequest.Discount;
                                    coupon.ExpiryDate = createCouponRequest.ExpiryDateTime;
                                    coupon.IsDeleted = false;
                                    coupon.NoExpiry = false;
                                    coupon.Active = "Y";
                                    db.Coupons.Add(coupon);
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.COUPON_ALREADY_EXIST;
                                }
                            }
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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
        public async Task<BaseResponse> DeleteCoupons(DeleteCouponRequest deleteCouponRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {

                            Coupon coupon = await db.Coupons.Where(x => x.CouponId == deleteCouponRequest.CouponId && x.IsDeleted == false).FirstOrDefaultAsync();
                            coupon.IsDeleted = true;
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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
        public async Task<BaseResponse> ToggleCouponActivation(ActiveDeActiveCouponRequest activeDeActiveCouponRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Coupon couponDate = await db.Coupons.Where(x => x.CouponId == activeDeActiveCouponRequest.CoponId).FirstOrDefaultAsync();
                            couponDate.Active = activeDeActiveCouponRequest.Active;
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        #region ReferralCoupon

        public async Task<AllReferralResponse> GetAllReferrals(ReferralRequest referralRequest)
        {
            try
            {
                allReferralResponse = new AllReferralResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_get_all_referrals\"(" + referralRequest.PageNo + "," + referralRequest.PageSize + ",'" + referralRequest.SortColumn + "','" + referralRequest.SortOrder + "', " + (referralRequest.ReferralId > 0 ? referralRequest.ReferralId : 0) + ", '" + referralRequest.FirstName + "', '" + referralRequest.LastName + "', '" + referralRequest.Email + "', '" + referralRequest.CouponCode + "','" + referralRequest.ExpiryDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<ReferralList>(SearchesJson.json);
                    allReferralResponse.resultdata = resultJson.resultdata;
                    allReferralResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                allReferralResponse.Success = false;
                allReferralResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return allReferralResponse;
        }

        public async Task<BaseResponse> CreateUpdateReferralsCoupons(CreateReferralRequest createReferralRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Referral referral = null;
                            if (createReferralRequest.ReferralId > 0)
                            {
                                // Update
                                referral = new Referral();
                                referral = await db.Referrals.Where(x => x.Email == createReferralRequest.Email && x.ReferralId != createReferralRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                                if (referral == null)
                                {
                                    Referral updateReferral = new Referral();
                                    updateReferral = await db.Referrals.Where(x => x.ReferralId == createReferralRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                                    updateReferral.FirstName = createReferralRequest.FirstName;
                                    updateReferral.LastName = createReferralRequest.LastName;
                                    updateReferral.ProfitPercentage = createReferralRequest.ProfitPercentage;
                                    updateReferral.Email = createReferralRequest.Email;
                                    updateReferral.CreatedDate = DateTime.Now;
                                    updateReferral.ProfitPercentage = createReferralRequest.ProfitPercentage;
                                    updateReferral.IsDeleted = false;
                                    updateReferral.Active = "Y";


                                    Coupon updateCoupon = new Coupon();
                                    updateCoupon = await db.Coupons.Where(x => x.ReferralId == createReferralRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                                    updateCoupon.Discount = createReferralRequest.Discount;
                                    updateCoupon.ExpiryDate = createReferralRequest.ExpiryDateTime;
                                    updateCoupon.IsDeleted = false;
                                    updateCoupon.NoExpiry = false;
                                    updateCoupon.Active = "Y";
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.EMAIL_ALREADY_EXIST;
                                }
                            }
                            else
                            {
                                // Create
                                referral = await db.Referrals.Where(x => x.Email == createReferralRequest.Email && x.IsDeleted == false).FirstOrDefaultAsync();
                                if (referral == null)
                                {
                                    referral = new Referral();
                                    referral.FirstName = createReferralRequest.FirstName;
                                    referral.LastName = createReferralRequest.LastName;
                                    referral.ProfitPercentage = createReferralRequest.ProfitPercentage;
                                    referral.ReferralId = createReferralRequest.ReferralId;
                                    referral.Email = createReferralRequest.Email;
                                    referral.CreatedDate = DateTime.Now;
                                    referral.ProfitPercentage = createReferralRequest.ProfitPercentage;
                                    referral.IsDeleted = false;
                                    referral.Active = "Y";
                                    db.Referrals.Add(referral);
                                    await db.SaveChangesAsync();

                                    Coupon createReferralCoupon = new Coupon();
                                    string couponCode = referral.FirstName.Substring(3).ToUpper();
                                    couponCode = couponCode + referral.ReferralId.ToString().PadLeft(5, '0');
                                    createReferralCoupon.CouponCode = couponCode;
                                    createReferralCoupon.Discount = createReferralRequest.Discount;
                                    createReferralCoupon.ExpiryDate = createReferralRequest.ExpiryDateTime;
                                    createReferralCoupon.IsDeleted = false;
                                    createReferralCoupon.NoExpiry = false;
                                    createReferralCoupon.Active = "Y";
                                    createReferralCoupon.ReferralId = referral.ReferralId;
                                }
                                else
                                {
                                    baseResponse.Success = false;
                                    baseResponse.Message = CustomErrorMessages.EMAIL_ALREADY_EXIST;
                                }
                            }
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<BaseResponse> DeleteReferralsCoupons(DeleteReferralsCouponsRequest deleteReferralsCouponsRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Coupon coupon = await db.Coupons.Where(x => x.ReferralId == deleteReferralsCouponsRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                            coupon.IsDeleted = true;
                            Referral referral = await db.Referrals.Where(x => x.ReferralId == deleteReferralsCouponsRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                            referral.IsDeleted = true;
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        public async Task<BaseResponse> ToggleReferralsCouponActivation(ReferralsCouponActivationRequest referralsCouponActivationRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        var isAdmin = await CheckUserEmailRole(loggedInUser);
                        if (isAdmin)
                        {
                            Coupon coupon = await db.Coupons.Where(x => x.ReferralId == referralsCouponActivationRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                            coupon.Active = referralsCouponActivationRequest.Active;
                            Referral referral = await db.Referrals.Where(x => x.ReferralId == referralsCouponActivationRequest.ReferralId && x.IsDeleted == false).FirstOrDefaultAsync();
                            referral.Active = referralsCouponActivationRequest.Active;
                            await db.SaveChangesAsync();
                        }
                        else
                        {
                            baseResponse.Success = false;
                            baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
                        }
                    }
                }
                else
                {
                    baseResponse.Success = false;
                    baseResponse.Message = CustomErrorMessages.UNAUTHORIZED_ACCESS;
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

        #region ReferralUserList
        
        public async Task<RefferalUserListBaseResponse> GetAllReferralUserList(ReferralUserRequest referralUserRequest)
        {
            try
            {
                refferalUserListBaseResponse = new RefferalUserListBaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"fn_getallreferralcoupon\"(" + referralUserRequest.PageNo + "," + referralUserRequest.PageSize + ",'" + referralUserRequest.SortColumn + "','" + referralUserRequest.SortOrder + "', " + (referralUserRequest.ReferralId > 0 ? referralUserRequest.ReferralId : 0) + ", " + (referralUserRequest.UserId > 0 ? referralUserRequest.UserId : 0) + ", " + (referralUserRequest.PaymentId > 0 ? referralUserRequest.PaymentId : 0) + ", '" + referralUserRequest.FirstName + "', '" + referralUserRequest.LastName + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<RefferalUserList>(SearchesJson.json);
                    refferalUserListBaseResponse.amount = resultJson.amount;
                    refferalUserListBaseResponse.record = resultJson.record;
                    refferalUserListBaseResponse.referral = resultJson.referral;
                    refferalUserListBaseResponse.Success = true;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                allReferralResponse.Success = false;
                allReferralResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return refferalUserListBaseResponse;
        }


        #endregion

        #endregion

        public async Task<bool> CheckUserEmailRole(string Email)
        {
            bool SearchesJson = false;
            try
            {
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT public.\"FN_CheckUserEmailRole\"('" + Email + "', 'Admin') AS json";
                    SearchesJson = await db.Database.SqlQuery<bool>(SQL_query).FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return SearchesJson;
        }

        public async Task<GetUserMenuReponse> GetUserMenu()
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                //var loggedInUser = "fpp@gmail.com";
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    getUserMenuReponse = new GetUserMenuReponse();
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        string sqlQuery = "select \"public\".\"FN_GetUserMenu\"('" + loggedInUser + "') as json";
                        var ScreenJson = await db.Database.SqlQuery<JsonRespone>(sqlQuery).FirstOrDefaultAsync();
                        var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<GetUserMenu>(ScreenJson.json);
                        getUserMenuReponse.menudetail = resultJson.menudetail;
                        getUserMenuReponse.userdetail = resultJson.userdetail;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                getUserMenuReponse.Success = false;
                getUserMenuReponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return getUserMenuReponse;
        }

        public async Task<EmailExistsResponse> EmailExists(string email, int? UserId)
        {
            try
            {
                emailExistsResponse = new EmailExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    if (UserId > 0)
                    {
                        emailExistsResponse.IsEmailExists = await db.Users.Where(x => x.Email == email && x.UserId != UserId).AnyAsync();
                    }
                    else
                    {
                        emailExistsResponse.IsEmailExists = await db.Users.Where(x => x.Email == email).AnyAsync();
                    }
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

        public async Task<AdminUserRegistrationListResponse> GetAllUserRegistrationEmail(AdminUserRegistrationRequest adminUserRegistrationRequest)
        {
            try
            {
                adminUserRegistrationListResponse = new AdminUserRegistrationListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SQL_query = "SELECT \"public\".\"FN_getAllUserRegistrationeEmail\"('" + adminUserRegistrationRequest.PageNo + "','" + adminUserRegistrationRequest.PageSize + "','" + adminUserRegistrationRequest.SortColumn + "','" + adminUserRegistrationRequest.SortOrder + "','" + adminUserRegistrationRequest.Email + "', " + (adminUserRegistrationRequest.UserEmailRegistrationId > 0 ? adminUserRegistrationRequest.UserEmailRegistrationId : 0) + ",'" + adminUserRegistrationRequest.IsProcessed + "','" + adminUserRegistrationRequest.CreatedDate + "') AS json";
                    var SearchesJson = await db.Database.SqlQuery<JsonRespone>(SQL_query).FirstOrDefaultAsync();
                    var resultJson = Newtonsoft.Json.JsonConvert.DeserializeObject<AdminUserRegistrationList>(SearchesJson.json);
                    adminUserRegistrationListResponse.resultdata = resultJson.resultdata;
                    adminUserRegistrationListResponse.totalcount = resultJson.totalcount;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminUserRegistrationListResponse.Success = false;
                adminUserRegistrationListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminUserRegistrationListResponse;
        }

        public async Task<BaseResponse> SendEmailSelectedUser(AdminSelectedUserListRequest adminSelectedUserListRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    foreach (var emailToRegisterUser in adminSelectedUserListRequest.SelectedUser)
                    {
                        Entities.Response.EmailToRegisterUsers emailToRegisterUsers = new Entities.Response.EmailToRegisterUsers();
                        emailToRegisterUsers.Email = emailToRegisterUser.Email;
                        emailToRegisterUsers.UserEmailRegistrationId = emailToRegisterUser.UserEmailRegistrationId;

                        var createEncryptedUserEmailRegistrationToken = EncodeDecodeForgetPasswordToken.CreateEncryptedUserEmailRegistrationToken(emailToRegisterUsers);
                        var SQL_Query = "SELECT \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_getuseremailregistrationtemplate\"('RegisterUserEmail','" + emailToRegisterUser.Email + "' ,'" + createEncryptedUserEmailRegistrationToken + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='RegisterUserEmail'";
                        var templateResponse = await db.Database.SqlQuery<TemplateDetail>(SQL_Query).FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = emailToRegisterUser.Email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                    int[] UserEmailRegistrationIdArr = adminSelectedUserListRequest.SelectedUser.Select(x => x.UserEmailRegistrationId).ToArray();
                    List<int> UserEmailRegistrationIdList = UserEmailRegistrationIdArr.OfType<int>().ToList();


                    List<UserEmailRegistration> UserEmailRegistrationUpdate = db.UserEmailRegistrations.Where(x => UserEmailRegistrationIdList.Contains(x.UserEmailRegistrationId)).ToList();
                    UserEmailRegistrationUpdate.ForEach(a => a.IsProcessed = true);
                    db.SaveChanges();

                    baseResponse.Success = true;
                    baseResponse.Message = null;
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

        public async Task<GetValidateScreenResponse> ValidateScreen(ValidateScreen validateScreen)
        {
            try
            {
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    getValidateScreenResponse = new GetValidateScreenResponse();
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        string sqlQuery = "select \"public\".\"fn_validatescreen\"('" + loggedInUser + "','" + validateScreen.MenuUrl + "') as json";
                        var ScreenJson = await db.Database.SqlQuery<bool>(sqlQuery).FirstOrDefaultAsync();

                        getValidateScreenResponse.isValid = ScreenJson;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                getValidateScreenResponse.Success = false;
                getValidateScreenResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return getValidateScreenResponse;
        }

        public async Task<AdminUserListResponse> GetTeam()
        {
            try
            {
                adminUserListResponse = new AdminUserListResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    adminUserListResponse.resultdata = await db.Users.Where(x => x.Active == "Y" && x.IsDeleted == false).Select(x => new AdminUser
                    {
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Active = x.Active,
                        Email = x.Email,
                        UserId = x.UserId,
                        CreatedDate = x.CreatedDate,

                    }).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminUserListResponse.Success = false;
                adminUserListResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminUserListResponse;
        }
        public async Task<SearchFacesResponse> GetAllVerifiedFaces(VerifiedFaceRequest verifiedFaceRequest)
        {
            try
            {
                searchFacesResponse = new SearchFacesResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT \"public\".\"fn_getAllVerifiedFaces\"(" + verifiedFaceRequest.PageNumber + ", " + (verifiedFaceRequest.TeamMemberId > 0 ? verifiedFaceRequest.TeamMemberId : 0) + ")";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var VerifiedFacesJsonStringResult = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).FirstOrDefault();
                        if(VerifiedFacesJsonStringResult != null)
                            searchFacesResponse.searchFaces = Newtonsoft.Json.JsonConvert.DeserializeObject<List<SearchFaces>>(VerifiedFacesJsonStringResult);
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                searchFacesResponse.Success = false;
                searchFacesResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return searchFacesResponse;
        }

        #region Twilio

        public async Task<BaseResponse> SaveVideoSchedule(VideoScheduleRequest videoScheduleRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                //var loggedInUser = "neerajsainiwins@gmail.com";
                if (!string.IsNullOrEmpty(loggedInUser))
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        int controllerId = await GetUserId(loggedInUser);
                        if (controllerId > 0)
                        {
                            VideoScheduling videoScheduling = new VideoScheduling();
                            videoScheduling.Userid = videoScheduleRequest.UserId;
                            videoScheduling.ScheduleDatetime = videoScheduleRequest.DateTime;
                            videoScheduling.ScheduleTimezone = videoScheduleRequest.TimeZone;
                            videoScheduling.controllerid = controllerId;
                            videoScheduling.UserAcception = false;

                            db.VideoSchedulings.Add(videoScheduling);
                            await db.SaveChangesAsync();

                            var videoCallConfirmationToken = EncodeDecodeForgetPasswordToken.CreateEncryptedVideoCallConfirmation(videoScheduling.VideoScheduleId);
                            string SqlQuery = "select \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_videocallschedule\"('VideoCallSchedule', '" + videoCallConfirmationToken + "', "+ videoScheduling.VideoScheduleId + " ) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='VideoCallSchedule'";
                            var templateResponse = await db.Database.SqlQuery<TemplateDetail>(SqlQuery).FirstOrDefaultAsync();
                            //var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Active = x.Active, Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "FP").FirstOrDefaultAsync();

                            mailContent = new MailContent();
                            mailContent.ToEmail = videoScheduleRequest.UserEmail;
                            mailContent.MsgSubject = templateResponse.Subject;
                            mailContent.MsgBody = templateResponse.Template;
                            mailContent.bcc = ApplicationConfiguration.EMAIL_RECEIVER;

                            // Email sender
                            EmailSender.MailSender(mailContent);

                            baseResponse.Success = true;
                            baseResponse.Message = null;
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

        public async Task<BaseResponse> ValidateVideoCall(string token)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    VideoSchedulingToken decrypteVideoSchedulingToken = EncodeDecodeForgetPasswordToken.DecrypteVideoCallConfirmation(token);

                    bool isTokenValid = await db.VideoSchedulings.Where(x => x.VideoScheduleId == decrypteVideoSchedulingToken.VideoScheduleId && x.UserAcception == false).AnyAsync();
                    if (isTokenValid)
                    {
                        baseResponse.Success = true;
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.INVALID_TOKEN;
                    }
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INVALID_TOKEN;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> AcceptVideoCall(string token)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    VideoSchedulingToken decrypteVideoSchedulingToken = EncodeDecodeForgetPasswordToken.DecrypteVideoCallConfirmation(token);

                    var VideoSchedulings = await (from VS in db.VideoSchedulings
                                                  join SU in db.system_user on VS.Userid equals SU.id
                                                  where VS.VideoScheduleId == decrypteVideoSchedulingToken.VideoScheduleId && VS.UserAcception == false
                                                  select new VideoSchedule
                                                  {
                                                      VideoScheduleId = VS.VideoScheduleId,
                                                      controllerid = VS.controllerid,
                                                      Userid = VS.Userid,
                                                      ScheduleDatetime = VS.ScheduleDatetime,
                                                      RescheduleDatetime = VS.RescheduleDatetime,
                                                      ScheduleTimezone = VS.ScheduleTimezone,
                                                      RescheduleTimezone = VS.RescheduleTimezone,
                                                      UserAcception = VS.UserAcception,
                                                      UserEmail = SU.email
                                                  }).FirstOrDefaultAsync();

                    if (VideoSchedulings != null)
                    {
                        baseResponse.Success = true;
                        VideoSchedulings.UserAcception = true;
                        await db.SaveChangesAsync();

                        int VideoRoomId = GenerateRoomName(VideoSchedulings);

                        var videoCallConfirmationToken = EncodeDecodeForgetPasswordToken.CreateEncryptedVideoRoomToken(VideoRoomId);

                        string SqlQuery = "select \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_videocallaccepted\"('VideoCallAcceptance', '" + videoCallConfirmationToken + "', "+ VideoSchedulings.VideoScheduleId + " ) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='VideoCallAcceptance'";
                        var templateResponse = await db.Database.SqlQuery<TemplateDetail>(SqlQuery).FirstOrDefaultAsync();
                        //var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Active = x.Active, Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "FP").FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = VideoSchedulings.UserEmail;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;
                        mailContent.bcc = ApplicationConfiguration.EMAIL_RECEIVER;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.ALLREADY_ACCEPTED;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INVALID_TOKEN;
            }
            return baseResponse;
        }
        public async Task<BaseResponse> ReScheduleVideoCall(string token, VideoCallReScheduleRequest videoCallReScheduleRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    VideoSchedulingToken decrypteVideoSchedulingToken = EncodeDecodeForgetPasswordToken.DecrypteVideoCallConfirmation(token);

                    var VideoSchedulings = await (from VS in db.VideoSchedulings
                                                  join SU in db.system_user on VS.Userid equals SU.id
                                                  where VS.VideoScheduleId == decrypteVideoSchedulingToken.VideoScheduleId && VS.UserAcception == false
                                                  select new VideoSchedule
                                                  {
                                                      VideoScheduleId = VS.VideoScheduleId,
                                                      controllerid = VS.controllerid,
                                                      Userid = VS.Userid,
                                                      ScheduleDatetime = VS.ScheduleDatetime,
                                                      RescheduleDatetime = VS.RescheduleDatetime,
                                                      ScheduleTimezone = VS.ScheduleTimezone,
                                                      RescheduleTimezone = VS.RescheduleTimezone,
                                                      UserAcception = VS.UserAcception,
                                                      UserEmail = SU.email
                                                  }).FirstOrDefaultAsync();
                    if (VideoSchedulings != null)
                    {
                        VideoScheduling videoScheduling = await db.VideoSchedulings.Where(x => x.VideoScheduleId == decrypteVideoSchedulingToken.VideoScheduleId).FirstOrDefaultAsync();
                        
                        videoScheduling.RescheduleDatetime = videoCallReScheduleRequest.DateTime;
                        videoScheduling.RescheduleTimezone = videoCallReScheduleRequest.TimeZone;
                        videoScheduling.UserAcception = true;
                        await db.SaveChangesAsync();

                        int VideoRoomId = GenerateRoomName(VideoSchedulings);

                        var videoCallConfirmationToken = EncodeDecodeForgetPasswordToken.CreateEncryptedVideoRoomToken(VideoRoomId);
                        string SqlQuery = "select \"TemplateId\", \"TemplateName\", \"Subject\", public.\"fn_reschedulevideocall\"('RescheduleCallConfirm', '" + videoCallConfirmationToken + "', "+ VideoSchedulings.VideoScheduleId + " ) AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='RescheduleCallConfirm'";
                        var templateResponse = await db.Database.SqlQuery<TemplateDetail>(SqlQuery).FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = VideoSchedulings.UserEmail;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;
                        mailContent.bcc = ApplicationConfiguration.EMAIL_RECEIVER;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                        baseResponse.Success = true;
                    }
                    else
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.ALLREADY_ACCEPTED;
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
        public async Task<BaseResponse> CheckVideoCallToken(string token)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    DateTime? scheduleDateTime = null;
                    string timeZone = "";
                    var videoCallConfirmationToken = EncodeDecodeForgetPasswordToken.DecrypteVideoRoomToken(token);
                    var videoCallDetail = await (from VR in db.VideoRooms
                                                 join VS in db.VideoSchedulings on VR.VideoScheduleId equals VS.VideoScheduleId
                                                 where VR.VideoRoomId == videoCallConfirmationToken.VideoRoomId
                                                 select new
                                                 {
                                                     VS.ScheduleDatetime,
                                                     VS.RescheduleDatetime,
                                                     VS.ScheduleTimezone,
                                                     VS.RescheduleTimezone,
                                                     VS.controllerid,
                                                     VS.Userid,
                                                     VS.VideoScheduleId,
                                                     VR.VideoRoomId,
                                                     VR.RoomName
                                                 }).FirstOrDefaultAsync();

                    if (videoCallDetail != null && videoCallDetail.VideoRoomId > 0)
                    {

                        if (videoCallDetail.RescheduleDatetime != null)
                        {
                            scheduleDateTime = videoCallDetail.RescheduleDatetime;
                            timeZone = videoCallDetail.RescheduleTimezone;
                        }
                        else
                        {
                            scheduleDateTime = videoCallDetail.ScheduleDatetime;
                            timeZone = videoCallDetail.ScheduleTimezone;
                        }
                    }

                    //TimeZoneInfo timeZoneInfo;
                    // DateTime ConvertedDateTime;
                    //Set the time zone information to US Mountain Standard Time 
                    // timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                    //Get date and time in US Mountain Standard Time 
                    // ConvertedDateTime = TimeZoneInfo.ConvertTime(Convert.ToDateTime(scheduleDateTime), timeZoneInfo);


                    if (DateTime.Compare(DateTime.Now, Convert.ToDateTime(scheduleDateTime)) < 0)
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.VIDEO_SLOT_LESS_ERROR;
                    }
                    else if(DateTime.Compare(DateTime.Now.AddMinutes(30), Convert.ToDateTime(scheduleDateTime)) > 0 )
                    {
                        baseResponse.Success = false;
                        baseResponse.Message = CustomErrorMessages.VIDEO_SLOT_PASS_ERROR;
                    }
                    else
                    {
                        baseResponse.Success = true;
                        baseResponse.Message = videoCallDetail.RoomName;
                        return baseResponse;
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

        public int GenerateRoomName(VideoSchedule videoScheduling)
        {
            int VideoRoomId = 0;
            string videoRoomName = string.Empty;
            try
            {

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    VideoRoom videoRoom = new VideoRoom();
                    videoRoom.CreatedDate = DateTime.Now;
                    videoRoomName = "VR_" + videoScheduling.controllerid + "_" + videoScheduling.Userid;
                    videoRoom.RoomName = videoRoomName;
                    videoRoom.VideoScheduleId = videoScheduling.VideoScheduleId;
                    db.VideoRooms.Add(videoRoom);
                    db.SaveChanges();

                    VideoRoomId = videoRoom.VideoRoomId;
                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);

            }
            return VideoRoomId;
        }
        
        #endregion

        public async Task<AdminChangePasswordResponse> AdminChangePassword(AdminChangePasswordRequest adminChangePasswordRequest)
        {
            try
            {
                adminChangePasswordResponse = new AdminChangePasswordResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var loggedInUser = Thread.CurrentPrincipal.Identity.Name;
                    //var loggedInUser = "saddamhusaainwins@gmail.com";
                    if (!string.IsNullOrEmpty(loggedInUser))
                    {
                        User user = await db.Users.Where(x => x.Email == loggedInUser).FirstOrDefaultAsync();
                        if (user != null)
                        {
                            var decryptPassword = AesEncryptionDecryption.Decrypt(user.Password);

                            if (decryptPassword == adminChangePasswordRequest.OldPassword)
                            {
                                user.Password = AesEncryptionDecryption.Encrypt(adminChangePasswordRequest.NewPassword);
                                db.SaveChanges();

                                var adminDetailResponse = await GetAdminDetailByEmail(loggedInUser);
                                adminChangePasswordResponse.Token = EncodeDecodeToken.CreateEncryptedAuthenticateTicket(adminDetailResponse.AdminDetail);
                                adminChangePasswordResponse.Success = true;
                                adminChangePasswordResponse.Message = CustomErrorMessages.PASSWORD_CHANGEDSUCCESSFULLY;

                                mailContent = new MailContent();
                                mailContent.ToEmail = user.Email;
                                mailContent.MsgSubject = "New Credentials";
                                mailContent.MsgBody = "Email:" + user.Email + " and Password:" + user.Password;

                                EmailSender.MailSender(mailContent);

                            }
                            else
                            {
                                adminChangePasswordResponse.Success = false;
                                adminChangePasswordResponse.Message = CustomErrorMessages.OLDPASSWORD_NOTMATCHED;
                            }
                        }
                        else
                        {
                            adminChangePasswordResponse.Success = false;
                            adminChangePasswordResponse.Message = CustomErrorMessages.USER_DOES_NOT_EXISTS;
                        }
                    }
                    else
                    {
                        adminChangePasswordResponse.Success = false;
                        adminChangePasswordResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
                    }

                }
            }
            catch (Exception ex)
            {

                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                adminChangePasswordResponse.Success = false;
                adminChangePasswordResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return adminChangePasswordResponse;
        }

        #region RestFullAPI's

        public IRestResponse DeleteMultipleFaceBiometrics(int multipleFaceBiometricsId)
        {
            var path = ApplicationConfiguration.DELETE_MULTIPLEBIOMETRIC_PATH + multipleFaceBiometricsId;
            var client = new RestClient(path);
            var request = new RestRequest(Method.DELETE);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            IRestResponse response = client.Execute(request);

            return response;
        }

        public IRestResponse DeleteMultipleFaceBiometricsList(int[] multipleFaceBiometricsIdList)
        {
            var path = ApplicationConfiguration.DELETE_MULTIPLEBIOMETRICLIST_PATH;
            var client = new RestClient(path);
            var request = new RestRequest(Method.DELETE);
            request.AddHeader("authorization", ApplicationConfiguration.API_Authorization);
            request.AddParameter("application/json", "{\"idList\": [" + String.Join(",", multipleFaceBiometricsIdList) + "]}", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            return response;
        }
        #endregion

        #region Static
        public static bool StaticGetUserDetailByUserEmail(string email, string password)
        {
            var userExists = false;
            try
            {

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    userExists = db.Users.Where(x => x.Email == email && x.Password == password && x.Active == "Y").Select(x => x.UserId).Any();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return userExists;

        }

        private static Bitmap Blur(Bitmap image, Rectangle rectangle, Int32 blurSize)
        {
            Bitmap blurred = new Bitmap(image.Width, image.Height);

            // make an exact copy of the bitmap provided
            using (Graphics graphics = Graphics.FromImage(blurred))
                graphics.DrawImage(image,
                    new Rectangle(0, 0, image.Width, image.Height),
                    new Rectangle(0, 0, image.Width, image.Height), GraphicsUnit.Pixel);

            // look at every pixel in the blur rectangle
            for (int xx = rectangle.X; xx < rectangle.X + rectangle.Width; xx++)
            {
                for (int yy = rectangle.Y; yy < rectangle.Y + rectangle.Height; yy++)
                {
                    int avgR = 0, avgG = 0, avgB = 0;
                    int blurPixelCount = 0;

                    // average the color of the red, green and blue for each pixel in the
                    // blur size while making sure you don't go outside the image bounds
                    for (Int32 x = Math.Max(0, xx - blurSize); x <= Math.Min(xx + blurSize, image.Width - 1); x++)
                    {
                        for (Int32 y = Math.Max(0, yy - blurSize); y <= Math.Min(yy + blurSize, image.Height - 1); y++)
                        {
                            Color pixel = blurred.GetPixel(x, y);

                            avgR += pixel.R;
                            avgG += pixel.G;
                            avgB += pixel.B;

                            blurPixelCount++;
                        }
                    }

                    avgR = avgR / blurPixelCount;
                    avgG = avgG / blurPixelCount;
                    avgB = avgB / blurPixelCount;

                    // now that we know the average for the blur size, set each pixel to that color
                    for (Int32 x = Math.Max(0, xx - blurSize); x <= Math.Min(xx + blurSize, image.Width - 1); x++)
                        for (Int32 y = Math.Max(0, yy - blurSize); y <= Math.Min(yy + blurSize, image.Height - 1); y++)
                            blurred.SetPixel(x, y, Color.FromArgb(avgR, avgG, avgB));
                }
            }

            return blurred;
        }

        private static string CreateRandomPassword(int passwordLength)
        {
            string allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@$?_-";
            char[] chars = new char[passwordLength];
            Random rd = new Random();

            for (int i = 0; i < passwordLength; i++)
            {
                chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
            }

            return new string(chars);
        }
        #endregion

    }
}
