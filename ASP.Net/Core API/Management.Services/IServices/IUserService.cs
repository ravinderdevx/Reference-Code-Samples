using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;

namespace DitsPortal.Services.IServices
{
    public interface IUserService
    {
        MainResponse Authenticate(UserLoginRequest login);
        Task<MainResponse> RegisterUser(UserRegisterRequest register);
        Task<MainUserResponse> UserAccountApprove(AccountApproveRequest accountApproveRequest);

        Task<MainResponse> ChangePassword(ChangePasswordRequest changePasswordRequest);
         Task<MainResponse> SetResetPasswordToken(ForgotPasswordRequest forgotPasswordRequest, SmtpRequest smtpRequest);
        MainResponse ValidateResetPasswordToken(ValidateResetPasswordRequest validateResetPasswordRequest);

        Task<UserProfileResponse> UpdateProfile(UserProfileRequest register);
        Task<UserProfileResponse> GetProfile(GetUserRequest getUserRequest);
        Task<MainUserResponse> GetAllUser(RecordFilterRequest recordFilterRequest);
    }

}
