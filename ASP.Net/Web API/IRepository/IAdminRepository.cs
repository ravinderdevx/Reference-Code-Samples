using FacePinPoint.Entities.Request;
using FacePinPoint.Entities.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace FacePinPoint.Repository.IRepository
{
    public interface IAdminRepository
    {
        Task<LoginResponse> Login(AdminLogin adminLogin);
        Task<BaseResponse> SaveAdminUserDetail(AdminUserDetail adminUserDetail);

        Task<SearchFacesResponse> GetAllFacesOFUser(int PageNumber);
        Task<SearchReportListResponse> GetAllSearchReports(SearchReportRequest SearchReportRequest);
        Task<UserFacesResponse> GetUserFaces(UserFacesRequest userFacesRequest);
        Task<SearchFacesResponse> GetFacesOfUserByHitrecordId(UserFacesWithPageNumberRequest userFacesWithPageNumberRequest);
        Task<UserByRoleListResponse> GetAllUserByRole(string Role, string searchString);
        Task<AssignSearchResponse> AssignSearchController(AssignSearchRequest assignSearchRequest);
        Task<BaseResponse> ProcessSearch(ProcessSearchRequest processSearchRequest);

        Task<ChildAbuseLinkListResponse> GetAllChildAbuseLink(ChildAbuseLinkRequest childAbuseLinkRequest);
        Task<BaseResponse> ApplyTagOnFace(ApplyTagOnFaceRequest applyTagOnFaceRequest);
        Task<BaseResponse> BlockClientProfile(BlockClientProfileRequest blockClientProfileRequest);
        Task<TagsDataResponse> GetAllTags(string tagSearch);

        Task<BlurUserImageResponse> BlurUserImage(BlurUserImageRequest blurUserImageRequest);
        Task<AdminTagsListResponse> GetAllTagList(AdminTagsRequest adminTagsRequest);

        Task<SaveTagResponse> SaveTags(TagRequest tagRequest);
        Task<BaseResponse> ActiveDeActiveTags(ActiveDeActiveTagRequest activeDeActiveTagRequest);
        Task<BaseResponse> DeleteTags(DeleteTagRequest deleteTagRequest);
        
        #region  Role
        Task<SingleRoleListResponse> GetAllRoles(RoleRequest roleRequest);
        Task<BaseResponse> DeleteRole(DeleteRoleRequest deleteRoleRequest);
        Task<CreateRoleResponse> CreateRole(CreateRoleRequest createRoleRequest);
        Task<BaseResponse> UpdateRole(UpdateRoleRequest updateRoleRequest);
        Task<BaseResponse> ActiveInActiveRole(ActiveDeActiveRoleRequest activeDeActiveRequest);
        Task<RolesExistsResponse> RoleExists(string role);

        #endregion

        #region User
        Task<AdminUserListResponse> GetAllAdminUser(AdminUserRequest adminUserRequest);
        Task<AdminUserListResponse> DeleteAdminUser(DeleteAdminUserRequest deleteAdminUserRequest);
        Task<BaseResponse> ActiveInActiveAdminUser(ActiveDeActiveAdminUserRequest activeDeActiveAdminUserRequest);
        Task<SingleUserReponse> ReadAdminUser(ReadAdminUserRequest readAdminUserRequest);
        Task<BaseResponse> UpdateAdminUser(UpdatAdminUserRequest updatAdminUserRequest);
        Task<SingleRoleListResponse> GetRoles();
        Task<CreateUserResponse> CreateAdminUser(CreateAdminUserRequest createAdminUserRequest);
        Task<EmailExistsResponse> AddAdminUserEmailExists(string email);
        #endregion

        #region Screen
        Task<SingleScreenListResponse> GetAllScreen(ScreenRequest screenRequest);

        Task<BaseResponse> DeleteScreen(DeleteScreenRequest deleteScreenRequest);

        Task<BaseResponse> CreateScreen(CreateScreenRequest createScreenequest);

        Task<BaseResponse> UpdateScreen(UpdateScreenRequest updateScreenRequest);

        Task<BaseResponse> ActiveInActiveScreen(ActiveDeActiveScreenRequest activeDeActiveScreenRequest);
        Task<ScreenExistsResponse> ScreenExists(string screen);

        #endregion

        #region Customer
        Task<GetCustomerListResponse> GetAllCustomers(CustomerRequest customerRequest);
        Task<BaseResponse> UpdateCustomer(UpdateCustomerRequest updateCustomerRequest);
        Task<BaseResponse> ActiveInActiveCustomer(ActiveDeActiveAdminCustomerRequest activeDeActiveAdminCustomerRequest);
        Task<EmailExistsResponse> CustomerEmailExists(string email, int? id);
        Task<BaseResponse> DeleteCustomer(DeleteCustomerRequest deleteCustomerRequest);
        #endregion
        Task<DashboardDetailsResponse> GetDashboardDetails();
        Task<EmailExistsResponse> EmailExists(string email, int? UserId);
        Task<GetUserMenuReponse> GetUserMenu();

        Task<AllScreenReponse> GetAllScreenList(int? RoleId);
        Task<AdminUserRegistrationListResponse> GetAllUserRegistrationEmail(AdminUserRegistrationRequest adminUserRegistrationRequest);
        Task<BaseResponse> SendEmailSelectedUser(AdminSelectedUserListRequest adminSelectedUserListRequest);
        Task<GetValidateScreenResponse> ValidateScreen(ValidateScreen validateScreen);
        Task<SearchFacesResponse> GetAllVerifiedFaces(VerifiedFaceRequest verifiedFaceRequest);
        Task<AdminUserListResponse> GetTeam();
        #region Twilio
        Task<BaseResponse> SaveVideoSchedule(VideoScheduleRequest videoScheduleRequest);
        Task<BaseResponse> ValidateVideoCall(string token);
        Task<BaseResponse> AcceptVideoCall(string token);
        Task<BaseResponse> ReScheduleVideoCall(string token, VideoCallReScheduleRequest videoCallReScheduleRequest);
        Task<BaseResponse> CheckVideoCallToken(string token);
        #endregion
        Task<AdminChangePasswordResponse> AdminChangePassword(AdminChangePasswordRequest adminChangePasswordRequest);
        #region Coupon
        Task<SingleCouponListResponse> GetAllCoupons(CouponsRequest couponRequest);
        Task<BaseResponse> CreateUpdateCoupons(CreateCouponRequest createCouponRequest);
        Task<BaseResponse> DeleteCoupons(DeleteCouponRequest deleteCouponRequest);
        Task<BaseResponse> ToggleCouponActivation(ActiveDeActiveCouponRequest activeDeActiveCouponRequest);

        #endregion

        #region ReferralCoupon
        Task<AllReferralResponse> GetAllReferrals(ReferralRequest referralRequest);
        Task<BaseResponse> CreateUpdateReferralsCoupons(CreateReferralRequest createReferralRequest);
        Task<BaseResponse> DeleteReferralsCoupons(DeleteReferralsCouponsRequest deleteReferralsCouponsRequest);
        Task<BaseResponse> ToggleReferralsCouponActivation(ReferralsCouponActivationRequest referralsCouponActivationRequest);
        #endregion

        #region ReferralUserList
        Task<RefferalUserListBaseResponse> GetAllReferralUserList(ReferralUserRequest referralUserRequest);
        #endregion

    }
}
