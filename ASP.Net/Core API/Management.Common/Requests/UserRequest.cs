using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using DitsPortal.Common.StaticResources;

namespace DitsPortal.Common.Requests
{
    public class UserLoginRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }

    public class AddUserRole
    {
        public int RoleId { get; set; }
    }
    public class UpdateUserRole
    {
        public int RoleId { get; set; }
    }
    public class UserRegisterRequest
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string UserName { get; set; }
        public int? Gender { get; set; }

        public int? Designation { get; set; }

        public string Phone { get; set; }

        public string AlternateNumber { get; set; }

        public string OfficialEmail { get; set; }

        public string Skype { get; set; }
        public string PAN { get; set; }
        public int? BloodGroup { get; set; }
        public DateTime? DateOfjoining { get; set; }
        public DateTime? DateOfLeaving { get; set; }
        public int? MediaId { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public bool IsApproved { get; set; }
        public List<AddUserRole> addUserRoles { get; set; }
    }
    public class AccountApproveRequest {
        public int UserId { get; set; }
        public bool Status { get; set; }
        public int ActionBy { get; set; }
    }
    public class UserProfileRequest
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string UserName { get; set; }
        public int? Gender { get; set; }

        public int? Designation { get; set; }

        public string Phone { get; set; }

        public string AlternateNumber { get; set; }

        public string OfficialEmail { get; set; }

        public string Skype { get; set; }
        public string PAN { get; set; }
        public int? BloodGroup { get; set; }
        public DateTime? DateOfjoining { get; set; }
        public DateTime? DateOfLeaving { get; set; }
        public int? MediaId { get; set; }
        public List<UpdateUserRole> updateUserRoles { get; set; }
    }

    public class UpdateUserRequest:BaseRequest
    {
        [Required]
        [EmailAddress]
        public string EmailId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
     
        public int? Role { get; set; }
        
    }
    public class ChangePasswordRequest: BaseRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }

    }


    public class UpdateProfilePhotoRequest:BaseRequest
    {
        public string UserProfilePhoto { get; set; }
        public string Type { get; set; }
    }

    public class UserRolesRequest:BaseRequest
    {
        public int UserId { get; set; }
        public List<int?> RoleIds { get; set; }
    }

    public class ForgotPasswordRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Url { get; set; }
    }

    public class ValidateResetPasswordRequest 
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; }
    }

    public class SmtpRequest
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Admin { get; set; }


    }

    public class GetUserRequest {
        public int UserId { get; set; }
    }
}
