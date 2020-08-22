using FacePinPoint.Entities.Common;
using FacePinPoint.Entities.Request;
using FacePinPoint.Filter;
using FacePinPoint.Service.IService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace FacePinPoint.Controllers
{
    [RoutePrefix("AdminAPI")]
    public class AdminAPIController : ApiController
    {
        #region Private

        private IAdminService _IAdminService = null;
        private System.Net.Http.HttpResponseMessage httpResponseMessage = null;

        #endregion

        public AdminAPIController(IAdminService IAdminService)
        {
            _IAdminService = IAdminService;
        }

        #region Public Function

        [HttpPost]
        [Route("Login")]
        [ActionName("Login")]
        public async Task<HttpResponseMessage> Login(AdminLogin adminLogin)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && adminLogin != null)
            {
                var loginResponse = await _IAdminService.Login(adminLogin);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, loginResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SaveAdminUserDetail")]
        [ActionName("SaveAdminUserDetail")]
        public async Task<HttpResponseMessage> SaveAdminUserDetail(AdminUserDetail adminUserDetail)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && adminUserDetail != null)
            {
                var adminUserDetailResponse = await _IAdminService.SaveAdminUserDetail(adminUserDetail);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, adminUserDetailResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetAllFacesOFUser")]
        [ActionName("GetAllFacesOFUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllFacesOFUser(int PageNumber)
        {
            if (PageNumber > 0 && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var GetAllFacesOFUser = await _IAdminService.GetAllFacesOFUser(PageNumber);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetAllFacesOFUser);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetAllSearchReports")]
        [ActionName("GetAllSearchReports")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllSearchReports(SearchReportRequest searchReportRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && searchReportRequest != null)
            {
                var getAllSearchReportsResponse = await _IAdminService.GetAllSearchReports(searchReportRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllSearchReportsResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetUserFaces")]
        [ActionName("GetUserFaces")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUserFaces(UserFacesRequest userFacesRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (ModelState.IsValid && userFacesRequest != null)
            {
                var getUserFacesResponse = await _IAdminService.GetUserFaces(userFacesRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getUserFacesResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetFacesOfUserByHitrecordId")]
        [ActionName("GetFacesOfUserByHitrecordId")]
        public async Task<HttpResponseMessage> GetFacesOfUserByHitrecordId(UserFacesWithPageNumberRequest userFacesWithPageNumberRequest)
        {
            if (userFacesWithPageNumberRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var GetFacesOfUserByHitrecordId = await _IAdminService.GetFacesOfUserByHitrecordId(userFacesWithPageNumberRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetFacesOfUserByHitrecordId);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetAllUserByRole")]
        [ActionName("GetAllUserByRole")]
        public async Task<HttpResponseMessage> GetAllUserByRole(string Role, string searchString)
        {
            if (Role != null)
            {
                httpResponseMessage = new HttpResponseMessage();
                var GetFacesOfUserByHitrecordId = await _IAdminService.GetAllUserByRole(Role, searchString);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetFacesOfUserByHitrecordId);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("AssignSearchController")]
        [ActionName("AssignSearchController")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> AssignSearchController(AssignSearchRequest assignSearchRequest)
        {
            if (assignSearchRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var AssignSearchController = await _IAdminService.AssignSearchController(assignSearchRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, AssignSearchController);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ProcessSearch")]
        [ActionName("ProcessSearch")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ProcessSearch(ProcessSearchRequest processSearchRequest)
        {
            if (processSearchRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var processSearchController = await _IAdminService.ProcessSearch(processSearchRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, processSearchController);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("GetAllChildAbuseLink")]
        [ActionName("GetAllChildAbuseLink")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllChildAbuseLink(ChildAbuseLinkRequest childAbuseLinkRequest)
        {
            if (childAbuseLinkRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllChildAbuseLinkResponse = await _IAdminService.GetAllChildAbuseLink(childAbuseLinkRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllChildAbuseLinkResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ApplyTagOnFace")]
        [ActionName("ApplyTagOnFace")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ApplyTagOnFace(ApplyTagOnFaceRequest applyTagOnFaceRequest)
        {
            if (applyTagOnFaceRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var applyTagOnFaceResponse = await _IAdminService.ApplyTagOnFace(applyTagOnFaceRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, applyTagOnFaceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("BlockClientProfile")]
        [ActionName("BlockClientProfile")]
        public async Task<HttpResponseMessage> BlockClientProfile(BlockClientProfileRequest blockClientProfileRequest)
        {
            if (blockClientProfileRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var applyTagOnFaceResponse = await _IAdminService.BlockClientProfile(blockClientProfileRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, applyTagOnFaceResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }



        [HttpGet]
        [Route("GetAllTags")]
        [ActionName("GetAllTags")]
        public async Task<HttpResponseMessage> GetAllTags(string q)
        {
            httpResponseMessage = new HttpResponseMessage();
            var applyTagOnFaceResponse = await _IAdminService.GetAllTags(q);
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, applyTagOnFaceResponse);
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetAllAdminUser")]
        [ActionName("GetAllAdminUser")]
        public async Task<HttpResponseMessage> GetAllAdminUser(AdminUserRequest adminUserRequest)
        {
            if (adminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserReponse = await _IAdminService.GetAllAdminUser(adminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("BlurUserImage")]
        [ActionName("BlurUserImage")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> BlurUserImage(BlurUserImageRequest blurUserImageRequest)
        {
            if (blurUserImageRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var blurUserImageReponse = await _IAdminService.BlurUserImage(blurUserImageRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, blurUserImageReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetAllTagList")]
        [ActionName("GetAllTagList")]
        public async Task<HttpResponseMessage> GetAllTagList(AdminTagsRequest adminTagsRequest)
        {
            if (adminTagsRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserReponse = await _IAdminService.GetAllTagList(adminTagsRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SaveTags")]
        [ActionName("SaveTags")]
        public async Task<HttpResponseMessage> SaveTags()
        {
            httpResponseMessage = new HttpResponseMessage();
            TagRequest tagRequest = null;
            try
            {

                if (System.Web.HttpContext.Current.Request.Form.AllKeys.Length > 0)
                {
                    tagRequest = new TagRequest();
                    // Show all the key-value pairs.
                    foreach (var key in System.Web.HttpContext.Current.Request.Form.AllKeys)
                    {
                        foreach (var val in System.Web.HttpContext.Current.Request.Form.GetValues(key))
                        {
                            switch (key.ToLower())
                            {
                                case "tagname":
                                    tagRequest.TagName = val;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                else
                {
                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
                    return httpResponseMessage;
                }

                var listOfStrings = new List<string>();
                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count > 0)
                {
                    int iUploadedCnt = 0;
                    // CHECK THE FILE COUNT.
                    for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
                    {
                        System.DateTime myDate = DateTime.Now;
                        int year = myDate.Year;
                        int month = myDate.Month;
                        var PartialPath = "/Uploads/Tags/" + year + "/" + month + "/";
                        var FilePath = "~" + PartialPath;
                        bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(FilePath));
                        if (!exists)
                        {
                            System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(FilePath));
                        }
                        System.Web.HttpPostedFile hpf = hfc[iCnt];
                        if (hpf.ContentLength > 0)
                        {
                            string FileName = "Tag_" + Guid.NewGuid().ToString() + Path.GetExtension(hpf.FileName);
                            // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)
                            if (!File.Exists(FilePath + FileName))
                            {
                                var FilePathWithFilename = Path.Combine(HttpContext.Current.Server.MapPath(FilePath), FileName);

                                // SAVE THE FILES IN THE FOLDER.
                                hpf.SaveAs(FilePathWithFilename);
                                listOfStrings.Add(FilePathWithFilename);
                                iUploadedCnt = iUploadedCnt + 1;

                                tagRequest.ImageFilePath = PartialPath + "/" + FileName;
                            }
                        }
                    }
                    var SaveTagResponse = await _IAdminService.SaveTags(tagRequest);

                    httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, SaveTagResponse);
                }
            }
            catch (System.Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INTERNAL_ERROR, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ActiveDeActiveTags")]
        [ActionName("ActiveDeActiveTags")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ActiveDeActiveTags(ActiveDeActiveTagRequest activeDeActiveTagRequest)
        {
            if (activeDeActiveTagRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var activeDeActiveTagReponse = await _IAdminService.ActiveDeActiveTags(activeDeActiveTagRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, activeDeActiveTagReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("DeleteTags")]
        [ActionName("DeleteTags")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteTags(DeleteTagRequest deleteTagRequest)
        {
            if (deleteTagRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserReponse = await _IAdminService.DeleteTags(deleteTagRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetAllScreenList")]
        [ActionName("GetAllScreenList")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllScreenList(int? RoleId)
        {
            httpResponseMessage = new HttpResponseMessage();
            var GetAllScreenListReponse = await _IAdminService.GetAllScreenList(RoleId);
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetAllScreenListReponse);

            return httpResponseMessage;
        }

        #region Role

        [HttpPost]
        [Route("GetAllRoles")]
        [ActionName("GetAllRoles")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllRoles(RoleRequest roleRequest)
        {
            if (roleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllRolesReponse = await _IAdminService.GetAllRoles(roleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllRolesReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("RoleExists")]
        [ActionName("RoleExists")]
        public async Task<bool> RoleExists(string role)
        {
            if (role != null)
            {
                var roleexistsResponse = await _IAdminService.RoleExists(role);
                if (roleexistsResponse.Success)
                {
                    return !roleexistsResponse.IsRoleExists;
                }
            }
            return false;
        }

        [HttpPost]
        [Route("DeleteRole")]
        [ActionName("DeleteRole")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteRole(DeleteRoleRequest deleteRoleRequest)
        {
            if (deleteRoleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteRoleResponse = await _IAdminService.DeleteRole(deleteRoleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetRoles")]
        [ActionName("GetRoles")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetRoles()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getAllRolesReponse = await _IAdminService.GetRoles();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllRolesReponse);
            return httpResponseMessage;
        }

        [Route("CreateRole")]
        [ActionName("CreateRole")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateRole(CreateRoleRequest createRoleRequest)
        {
            if (createRoleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteRoleResponse = await _IAdminService.CreateRole(createRoleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [Route("UpdateRole")]
        [ActionName("UpdateRole")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> UpdateRole(UpdateRoleRequest updateRoleRequest)
        {
            if (updateRoleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteRoleResponse = await _IAdminService.UpdateRole(updateRoleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [Route("ActiveInActiveRole")]
        [ActionName("ActiveInActiveRole")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ActiveInActiveRole(ActiveDeActiveRoleRequest activeDeActiveRequest)
        {
            if (activeDeActiveRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteRoleResponse = await _IAdminService.ActiveInActiveRole(activeDeActiveRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        #endregion

        #region User
        [Route("CreateAdminUser")]
        [ActionName("CreateAdminUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateAdminUser(CreateAdminUserRequest createAdminUserRequest)
        {
            if (createAdminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var CreateAdminUser = await _IAdminService.CreateAdminUser(createAdminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, CreateAdminUser);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("DeleteAdminUser")]
        [ActionName("DeleteAdminUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteAdminUser(DeleteAdminUserRequest deleteAdminUserRequest)
        {
            if (deleteAdminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteAdminUserReponse = await _IAdminService.DeleteAdminUser(deleteAdminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [Route("UpdateAdminUser")]
        [ActionName("UpdateAdminUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> UpdateAdminUser(UpdatAdminUserRequest updatAdminUserRequest)
        {
            if (updatAdminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var updateRoleResponse = await _IAdminService.UpdateAdminUser(updatAdminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, updateRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("ActiveInActiveAdminUser")]
        [ActionName("ActiveInActiveAdminUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ActiveInActiveAdminUser(ActiveDeActiveAdminUserRequest activeDeActiveAdminUserRequest)
        {
            if (activeDeActiveAdminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteAdminUserReponse = await _IAdminService.ActiveInActiveAdminUser(activeDeActiveAdminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ReadAdminUser")]
        [ActionName("ReadAdminUser")]
        public async Task<HttpResponseMessage> ReadAdminUser(ReadAdminUserRequest readAdminUserRequest)
        {
            if (readAdminUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteAdminUserReponse = await _IAdminService.ReadAdminUser(readAdminUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpGet]
        [Route("AddAdminUserEmailExists")]
        [ActionName("AddAdminUserEmailExists")]
        public async Task<bool> AddAdminUserEmailExists(string email)
        {
            if (email != null)
            {
                var emailexistsResponse = await _IAdminService.AddAdminUserEmailExists(email);
                if (emailexistsResponse.Success)
                {
                    return !emailexistsResponse.IsEmailExists;
                }
            }
            return false;
        }
        #endregion

        #region Screen

        [HttpPost]
        [Route("GetAllScreen")]
        [ActionName("GetAllScreen")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllScreen(ScreenRequest screenRequest)
        {
            if (screenRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllScreenReponse = await _IAdminService.GetAllScreen(screenRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllScreenReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("DeleteScreen")]
        [ActionName("DeleteScreen")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteScreen(DeleteScreenRequest deleteScreenRequest)
        {
            if (deleteScreenRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteScreenResponse = await _IAdminService.DeleteScreen(deleteScreenRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteScreenResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [Route("CreateScreen")]
        [ActionName("CreateScreen")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateScreen(CreateScreenRequest createScreenRequest)
        {
            if (createScreenRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var createScreenResponse = await _IAdminService.CreateScreen(createScreenRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, createScreenResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [Route("UpdateScreen")]
        [ActionName("UpdateScreen")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> UpdateScreen(UpdateScreenRequest updateScreenRequest)
        {
            if (updateScreenRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var updateScreenResponse = await _IAdminService.UpdateScreen(updateScreenRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, updateScreenResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [Route("ActiveInActiveScreen")]
        [ActionName("ActiveInActiveScreen")]
        public async Task<HttpResponseMessage> ActiveInActiveScreen(ActiveDeActiveScreenRequest activeDeActiveScreenRequest)
        {
            if (activeDeActiveScreenRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteRoleResponse = await _IAdminService.ActiveInActiveScreen(activeDeActiveScreenRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteRoleResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpGet]
        [Route("ScreenExists")]
        [ActionName("ScreenExists")]
        public async Task<bool> ScreenExists(string screen)
        {
            if (screen != null)
            {
                var screenexistsResponse = await _IAdminService.ScreenExists(screen);
                if (screenexistsResponse.Success)
                {
                    return !screenexistsResponse.IsScreenExists;
                }
            }
            return false;
        }
        #endregion

        #region Customer
        [HttpPost]
        [Route("GetAllCustomers")]
        [ActionName("GetAllCustomers")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllCustomers(CustomerRequest customerRequest)
        {
            if (customerRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserReponse = await _IAdminService.GetAllCustomers(customerRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [Route("UpdateCustomer")]
        [ActionName("UpdateCustomer")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> UpdateCustomer(UpdateCustomerRequest updateCustomerRequest)
        {
            if (updateCustomerRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var updatecustomerResponse = await _IAdminService.UpdateCustomer(updateCustomerRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, updatecustomerResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("ActiveInActiveCustomer")]
        [ActionName("ActiveInActiveCustomer")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ActiveInActiveCustomer(ActiveDeActiveAdminCustomerRequest activeDeActiveAdminCustomerRequest)
        {
            if (activeDeActiveAdminCustomerRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var activeDeActiveAdminCustomerReponse = await _IAdminService.ActiveInActiveCustomer(activeDeActiveAdminCustomerRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, activeDeActiveAdminCustomerReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpGet]
        [Route("CustomerEmailExists")]
        [ActionName("CustomerEmailExists")]
        public async Task<bool> CustomerEmailExists(string email, int? id)
        {
            if (email != null)
            {
                var customerEmailExists = await _IAdminService.CustomerEmailExists(email, id);
                if (customerEmailExists.Success)
                {
                    return !customerEmailExists.IsEmailExists;
                }
            }
            return false;
        }

        [HttpPost]
        [Route("DeleteCustomer")]
        [ActionName("DeleteCustomer")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteCustomer(DeleteCustomerRequest deleteCustomerRequest)
        {
            if (deleteCustomerRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deleteAdminUserReponse = await _IAdminService.DeleteCustomer(deleteCustomerRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deleteAdminUserReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        #endregion
        [HttpGet]
        [Route("GetDashboardDetails")]
        [ActionName("GetDashboardDetails")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetDashboardDetails()
        {
            httpResponseMessage = new HttpResponseMessage();
            var dashboardRecords =  await _IAdminService.GetDashboardDetails();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, dashboardRecords);

            return httpResponseMessage;
        }
        [HttpGet]
        [Route("GetUserMenu")]
        [ActionName("GetUserMenu")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetUserMenu()
        {
            httpResponseMessage = new HttpResponseMessage();
            var GetUserMenuReponseReponse = await _IAdminService.GetUserMenu();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetUserMenuReponseReponse);

            return httpResponseMessage;
        }
        [HttpGet]
        [Route("IsEmailExists")]
        [ActionName("IsEmailExists")]
        public async Task<bool> IsEmailExists(string email, int? UserId)
        {
            if (email != null)
            {
                var emailexistsResponse = await _IAdminService.EmailExists(email, UserId);
                if (emailexistsResponse.Success)
                {
                    return !emailexistsResponse.IsEmailExists;
                }
            }
            return false;
        }

        [HttpPost]
        [Route("GetAllUserRegistrationEmail")]
        [ActionName("GetAllUserRegistrationEmail")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllUserRegistrationEmail(AdminUserRegistrationRequest adminUserRegistrationRequest)
        {
            if (adminUserRegistrationRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserRegistrationReponse = await _IAdminService.GetAllUserRegistrationEmail(adminUserRegistrationRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserRegistrationReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SendEmailSelectedUser")]
        [ActionName("SendEmailSelectedUser")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SendEmailSelectedUser(AdminSelectedUserListRequest adminSelectedUserListRequest)
        {
            if (adminSelectedUserListRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserRegistrationReponse = await _IAdminService.SendEmailSelectedUser(adminSelectedUserListRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserRegistrationReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("ValidateScreen")]
        [ActionName("ValidateScreen")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ValidateScreen(ValidateScreen validateScreen)
        {
            if (validateScreen != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var validateScreenReponse = await _IAdminService.ValidateScreen(validateScreen);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, validateScreenReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("GetAllVerifiedFaces")]
        [ActionName("GetAllVerifiedFaces")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllVerifiedFaces(VerifiedFaceRequest verifiedFaceRequest)
        {
            if (verifiedFaceRequest.PageNumber > 0 && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var GetAllVerifiedFaces = await _IAdminService.GetAllVerifiedFaces(verifiedFaceRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, GetAllVerifiedFaces);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetTeam")]
        [ActionName("GetTeam")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetTeam()
        {
            httpResponseMessage = new HttpResponseMessage();
            var getAllRolesReponse = await _IAdminService.GetTeam();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllRolesReponse);
            return httpResponseMessage;
        }
        #region Twilio

        [HttpPost]
        [Route("SaveVideoSchedule")]
        [ActionName("SaveVideoSchedule")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> SaveVideoSchedule(VideoScheduleRequest videoScheduleRequest)
        {
            if (videoScheduleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllAdminUserRegistrationReponse = await _IAdminService.SaveVideoSchedule(videoScheduleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllAdminUserRegistrationReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("ValidateVideoCall")]
        [ActionName("ValidateVideoCall")]
        public async Task<HttpResponseMessage> ValidateVideoCall([FromUri]string token)
        {
            if (token != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var validateVideoCallReponse = await _IAdminService.ValidateVideoCall(token);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, validateVideoCallReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("AcceptVideoCall")]
        [ActionName("AcceptVideoCall")]
        public async Task<HttpResponseMessage> AcceptVideoCall([FromUri]string token)
        {
            if (token != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var acceptVideoCallReponse = await _IAdminService.AcceptVideoCall(token);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, acceptVideoCallReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("ReScheduleVideoCall")]
        [ActionName("ReScheduleVideoCall")]
        public async Task<HttpResponseMessage> ReScheduleVideoCall([FromUri]string token, [FromBody]VideoCallReScheduleRequest videoCallReScheduleRequest)
        {
            if (token != null && videoCallReScheduleRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var reScheduleVideoCallReponse = await _IAdminService.ReScheduleVideoCall(token, videoCallReScheduleRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, reScheduleVideoCallReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [HttpPost]
        [Route("CheckVideoCallToken")]
        [ActionName("CheckVideoCallToken")]
        public async Task<HttpResponseMessage> CheckVideoCallToken(string token)
        {
            if (token != null && token != "null")
            {
                httpResponseMessage = new HttpResponseMessage();
                var checkVideoCallTokenReponse = await _IAdminService.CheckVideoCallToken(token);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, checkVideoCallTokenReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        #endregion

        [HttpPost]
        [Route("AdminChangePassword")]
        [ActionName("AdminChangePassword")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> AdminChangePassword(AdminChangePasswordRequest adminChangePasswordRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (adminChangePasswordRequest != null && ModelState.IsValid)
            {
                var changePasswordResponse = await _IAdminService.AdminChangePassword(adminChangePasswordRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, changePasswordResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("GetAllCoupons")]
        [ActionName("GetAllCoupons")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllCoupons(CouponsRequest couponRequest)
        {
            if (couponRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllCouponReponse = await _IAdminService.GetAllCoupons(couponRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllCouponReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [Route("CreateUpdateCoupons")]
        [ActionName("CreateUpdateCoupons")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateCoupons(CreateCouponRequest createCouponRequest)
        {
            if (createCouponRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var createCoupon = await _IAdminService.CreateUpdateCoupons(createCouponRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, createCoupon);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [HttpPost]
        [Route("DeleteCoupons")]
        [ActionName("DeleteCoupons")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteCoupons(DeleteCouponRequest deleteCouponRequest)
        {
            if (deleteCouponRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deletecoupon = await _IAdminService.DeleteCoupons(deleteCouponRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deletecoupon);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }


        [HttpPost]
        [Route("ToggleCouponActivation")]
        [ActionName("ToggleCouponActivation")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ToggleCouponActivation(ActiveDeActiveCouponRequest activeDeActiveCouponRequest)
        {
            if (activeDeActiveCouponRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var toggleCouponActivation = await _IAdminService.ToggleCouponActivation(activeDeActiveCouponRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, toggleCouponActivation);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        



        [HttpPost]
        [Route("GetAllReferrals")]
        [ActionName("GetAllReferrals")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> GetAllReferrals(ReferralRequest referralRequest)
        {
            if (referralRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllCouponReponse = await _IAdminService.GetAllReferrals(referralRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllCouponReponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        [Route("CreateUpdateReferralsCoupons")]
        [ActionName("CreateUpdateReferralsCoupons")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> CreateUpdateReferralsCoupons(CreateReferralRequest createReferralRequest)
        {
            if (createReferralRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var createreferralReCoupon = await _IAdminService.CreateUpdateReferralsCoupons(createReferralRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, createreferralReCoupon);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [Route("DeleteReferralsCoupons")]
        [ActionName("DeleteReferralsCoupons")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> DeleteReferralsCoupons(DeleteReferralsCouponsRequest deleteReferralsCouponsRequest)
        {
            if (deleteReferralsCouponsRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var deletereferralReCoupon = await _IAdminService.DeleteReferralsCoupons(deleteReferralsCouponsRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, deletereferralReCoupon);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        [Route("ToggleReferralsCouponActivation")]
        [ActionName("ToggleReferralsCouponActivation")]
        [BasicAuthenticationAttribute]
        public async Task<HttpResponseMessage> ToggleReferralsCouponActivation(ReferralsCouponActivationRequest referralsCouponActivationRequest)
        {
            if (referralsCouponActivationRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var TogglereferralReCoupon = await _IAdminService.ToggleReferralsCouponActivation(referralsCouponActivationRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, TogglereferralReCoupon);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }
        #endregion


        #region ReferralUserList
       
        [HttpPost]
        [Route("GetAllReferralUserList")]
        [ActionName("GetAllReferralUserList")]
        public async Task<HttpResponseMessage> GetAllReferralUserList(ReferralUserRequest referralUserRequest)
        {
            if (referralUserRequest != null && ModelState.IsValid)
            {
                httpResponseMessage = new HttpResponseMessage();
                var getAllReferralUserListResponse = await _IAdminService.GetAllReferralUserList(referralUserRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, getAllReferralUserListResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }
            return httpResponseMessage;
        }

        #endregion
    }
}
