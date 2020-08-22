using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.DataAccess;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using DitsPortal.Services.IServices;
using Microsoft.Extensions.Logging;

namespace DitsPortal.Services.Services
{
    public class UserService : IUserService
    {
        #region readonly
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private ILogger<UserService> _logger;
        #endregion

        #region Object Variables
        private MainResponse _response;
        private MainUserResponse _userResponse;
        private UserProfileResponse _userProfileResponse;
        private UploadImage _uploadImage;
        private BaseResponse _baseResponse;
        #endregion

        public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
        {

            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
            _response = new MainResponse();
            _uploadImage = new UploadImage();
            _userProfileResponse = new UserProfileResponse();
            _response.Status = false;
            _userResponse = new MainUserResponse();
        }


        public MainResponse Authenticate(UserLoginRequest login)
        {
            try
            {
                string encodePassword = EncodeComparePassword.GetMd5Hash(login.Password);
                var user = _userRepository.GetSingle(x => x.Email == login.Email.ToLower() && x.Password == encodePassword && x.IsApproved == true);
                var data = _userRepository.LoginUser(user.UserId);
                if (data != null)
                {
                    var userResponse = _mapper.Map<UserResponse>(data);
                    _response.userResponse = userResponse;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.LOGIN_FAILURE_MSG;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }
        public async Task<MainResponse> RegisterUser(UserRegisterRequest register)
        {
            try
            {
                var isEmailExist = _userRepository.GetSingle(x => x.Email == register.Email);
                if (isEmailExist != null)
                {
                    _response.Message = Constants.EMAIL_ALREADY_EXIST;
                    return _response;

                }
                if (register.UserName != null && register.UserName != "")
                {
                    _baseResponse = await _userRepository.AddUser(register);
                    _response.Status = _baseResponse.Status;
                    _response.Message = _baseResponse.Message;
                    return _response;
                }
                var user = _mapper.Map<User>(register);
                user.Password = EncodeComparePassword.GetMd5Hash(user.Password);
                user.CreatedOn = DateTime.Now;
                //user.CreatedBy = register.Username;
                user.IsActive = true;
                user.IsDeleted = false;
                user.IsApproved = false;
                var data = await _userRepository.AddAsync(user);

                if (data != null)
                {
                    var userResponse = _mapper.Map<UserResponse>(data);
                    _response.userResponse = userResponse;
                    _response.Status = true;
                    _response.Message = Constants.USER_REGISTERED;
                }
                else
                {
                    _response.Message = Constants.LOGIN_FAILURE_MSG;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }

        public async Task<MainResponse> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            try
            {
                var user = _userRepository.GetSingle(x => x.Email == changePasswordRequest.Email && x.IsDeleted == false);

                if (user != null)
                {
                    user.Password = EncodeComparePassword.GetMd5Hash(changePasswordRequest.NewPassword);
                    //user.ModifiedBy = changePasswordRequest.UserName;
                    user.ModifiedOn = DateTime.Now;
                    var data = await _userRepository.UpdateAsync(user);

                    if (data != null)
                    {
                        var userResponse = _mapper.Map<UserResponse>(data);
                        _response.userResponse = userResponse;
                        _response.Status = true;
                        _response.Message = Constants.PASSWORD_CHANGED;
                    }
                    else
                    {
                        _response.Message = Constants.LOGIN_FAILURE_MSG;
                    }
                }
                else
                {
                    _response.Status = false;
                    _response.Message = Constants.NO_RECORD_FOUND;
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }

        public async Task<MainResponse> SetResetPasswordToken(ForgotPasswordRequest forgotPasswordRequest, SmtpRequest smtpRequest)
        {

            try
            {
                var user = _userRepository.GetSingle(x => x.Email == forgotPasswordRequest.Email.ToLower() && x.IsActive == true);
                if (user != null)
                {
                    string guid = Guid.NewGuid().ToString();
                    user.ResetToken = guid;
                    user.ResetTokenExpired = DateTime.UtcNow.AddMinutes(60);
                    var data = await _userRepository.UpdateAsync(user);

                    bool SendEmail = NotificationHelper.SendPasswordResetEmail(forgotPasswordRequest, guid, smtpRequest);
                    _response.Status = true;
                    _response.Message = SendEmail ? Constants.RESET_PASSWORD_EMAIL : Constants.EMAIL_ERROR;
                    var userResponse = _mapper.Map<UserResponse>(data);
                    _response.userResponse = userResponse;
                }
                else
                {
                    _response.Status = false;
                    _response.Message = Constants.NO_RECORD_FOUND;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                _baseResponse.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }

            return _response;
        }

        public MainResponse ValidateResetPasswordToken(ValidateResetPasswordRequest validateResetPasswordRequest)
        {
            try
            {
                var users = _userRepository.GetSingle(x => x.Email == validateResetPasswordRequest.Email.ToLower() && x.IsActive == true);
                if (users != null)
                {
                    if (users.ResetTokenExpired > DateTime.UtcNow)
                    {
                        _response.Status = true;
                        _response.Message = Constants.RESET_PASSWORD_VALID_LINK;
                        var userResponse = _mapper.Map<UserResponse>(users);
                        _response.userResponse = userResponse;

                    }
                    else
                    {
                        _response.Status = false;
                        _response.Message = Constants.RESET_PASSWORD_EXPIRED_LINK;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                _baseResponse.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }

            return _response;
        }
        public async Task<UserProfileResponse> UpdateProfile(UserProfileRequest profileRequest)
        {
            try
            {
                var userProfile = _mapper.Map<User>(profileRequest);
                //var existingRecord = _userRepository.GetSingle(x=> x.UserId==profileRequest.UserId);
                var existingRecord = _userRepository.Get<User>(profileRequest.UserId);
                if (existingRecord != null)
                {
                    existingRecord.UserName = profileRequest.UserName;
                    existingRecord.FirstName = profileRequest.FirstName;
                    existingRecord.LastName = profileRequest.LastName;
                    existingRecord.DateOfBirth = profileRequest.DateOfBirth;
                    existingRecord.Gender = profileRequest.Gender;
                    existingRecord.Designation = profileRequest.Designation;
                    existingRecord.Phone = profileRequest.Phone;
                    existingRecord.AlternateNumber = profileRequest.AlternateNumber;
                    existingRecord.OfficialEmail = profileRequest.OfficialEmail;
                    existingRecord.Skype = profileRequest.Skype;
                    existingRecord.PAN = profileRequest.PAN;
                    existingRecord.BloodGroup = profileRequest.BloodGroup;
                    existingRecord.DateOfJoining = profileRequest.DateOfjoining;
                    existingRecord.DateOfLeaving = profileRequest.DateOfLeaving;
                    existingRecord.MediaId = profileRequest.MediaId;
                    existingRecord.ModifiedBy = profileRequest.UserName;
                    existingRecord.ModifiedOn = DateTime.Now;
                    _userRepository.Update(existingRecord);

                    if (profileRequest.updateUserRoles.Count > 0)
                    {
                        await _userRepository.UpdateUserRole(profileRequest);
                    }
                    _userProfileResponse.Status = true;
                    _userProfileResponse.Message = Constants.USER_PROFILE_UPDATE;
                    return _userProfileResponse;
                }
               
                _userProfileResponse.Message = Constants.USER_NOT_EXITS;
                _userProfileResponse.Status = false;
                return _userProfileResponse;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<UserProfileResponse> GetProfile(GetUserRequest getUserRequest)
        {
            try
            {
                //var userProfile = _mapper.Map<User>(register);
                var isExist = _userRepository.GetUser(getUserRequest);
                if (isExist.Result != null)
                {
                    _userProfileResponse.userResponse = isExist.Result;
                    _userProfileResponse.Status = true;
                    _userProfileResponse.Message = Constants.USER_EXITS;
                    return _userProfileResponse;
                }
                _userProfileResponse.Message = Constants.USER_NOT_EXITS;
                _userProfileResponse.Status = false;
                return await Task.FromResult(_userProfileResponse);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<MainUserResponse> GetAllUser(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                
                var isExist = _userRepository.GetAllUser(recordFilterRequest);
                if (isExist.Result != null)
                {
                    _userResponse.userResponseData = isExist.Result.userResponseData;
                    _userResponse.Status = true;
                    _userResponse.Message = Constants.USER_EXITS;
                    return _userResponse;
                }
                _userResponse.Message = Constants.USER_NOT_EXITS;
                _userResponse.Status = false;
                return await Task.FromResult(_userResponse);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<MainUserResponse> UserAccountApprove(AccountApproveRequest accountApproveRequest)
        {

            try
            {
                var existingRecord = _userRepository.Get<User>(accountApproveRequest.UserId);
                if (existingRecord != null)
                {
                    if (accountApproveRequest.Status==true)
                    {
                        existingRecord.IsApproved = accountApproveRequest.Status;
                        existingRecord.IsDeleted = false;
                        _userResponse.Message = Constants.ACCOUNT_APPROVED_SUCCESS;
                    }
                    else
                    {
                        existingRecord.IsDeleted = true;
                        existingRecord.IsApproved = accountApproveRequest.Status;
                        _userResponse.Message = Constants.ACCOUNT_APPROVAL_REJECT;
                    }

                    existingRecord.ModifiedOn = DateTime.Now;
                    _userRepository.Update(existingRecord);
                    _userResponse.Status = true;
                    return _userResponse;
                }
                _userProfileResponse.Message = Constants.USER_NOT_EXITS;
                _userProfileResponse.Status = false;
                return _userResponse;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}

