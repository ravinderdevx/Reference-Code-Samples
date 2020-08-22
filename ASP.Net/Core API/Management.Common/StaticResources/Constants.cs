using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.StaticResources
{
    public static class Constants
    {
        public const int SUCCESS_CODE = 200;
        public const int FAILURE_CODE = 400;
        public const int ERROR_CODE = 500;

        // Common
        public const string DEFAULT_ERROR_MSG = "Something went wrong";
        public const string DEFAULT_SUCCESS_MSG = "Success";
        public const string NO_RECORD_FOUND = "Email does not exist.";

        // User Screen
        public const string USER_NOT_EXITS = "User not exits.";
        public const string USER_EXITS = "User Exits";
        public const string USER_PROFILE_CREATED = "User Profile Created Successfully";
        public const string USER_PROFILE_UPDATE = "User Profile Update successfully";
        public const string ACCOUNT_APPROVED_SUCCESS = "User Account Approved successfully";
        public const string ACCOUNT_APPROVAL_REJECT = "User Account Approval Reject";
        public const string LOGIN_FAILURE_MSG = "Username or password is incorrect";
        public const string EMAIL_ALREADY_EXIST = "Email already exists";
        public const string OLD_PASSWORD_INCORRECT = "Old password incorrect";
        public const string OLD_NEW_PASSWORD_SAME_ERROR = "New password can not be same as old password.";
        public const string PASSWORD_CHANGED = "Password changed successfully.";
        public const string PROFILE_UPDATED = "User Profile updated successfully.";
        public const string USER_REGISTERED = "User registered successfully.Please wait for admin approval";
        public const string RESET_PASSWORD_EMAIL = "Your password reset email has been sent.";


        //Users Registration Screen
        public const string USER_CREATED = "User created successfully.";
        public const string USER_NOT_CREATED = "Please fill the required fields.";
        public const string USER_UPDATED = "User   updated successfully.";
        public const string USER_NOT_UPDATED = "User not updated successfully.";
        public const string USER_NOT_EXISTS = "User not exits.";
        public const string USER_DELETED = "User deleted successfully.";
        public const string USER_NOT_DELETED = "User not deleted successfully.";
        public static readonly string RESET_PASSWORD_VALID_LINK = "Reset password link is valid.";
        public static readonly string RESET_PASSWORD_EXPIRED_LINK = "Reset password link is expired";

        //Leave Screen
        public const string LEAVE_CREATED = "Leave created successfully.";
        public const string LEAVE_NOT_CREATED = "Leave creation failed.";
        public const string LEAVE_APPROVED = "Leave approved successfully";
        public const string LEAVE_NOT_APPROVED = "Leave declined successfully";
        public const string NO_LEAVE_AVAILABLE = "No leave available.";
        public const string LEAVE_UPDATE = "LEAVE UPDATE successfully.";
        public const string LEAVE_NOT_UPDATE = "LEAVE NOT UPDATE.";

        /* Validation Messages */
        public const string VALIDATION_FULLNAME_ERROR_MSG = "Name should contains alphabets, space and dot";
        public const string VALIDATION_PASSWORD_ERROR_MSG = "Password is not strong";
        public const string VALIDATION_PASSWORD_NOT_SAME_MSG = "Confirm password is not same as password.";

        // GlobalCode Category Screen 
        public const string GLOBAL_CODE_CATEGORY_CREATED = "Global Code Category created successfully.";
        public const string GLOBAL_CODE_CATEGORY_NOT_CREATED = "Please fill the required fields.";
        public const string GLOBAL_CODE_CATEGORY_UPDATED = "Global code category updated successfully.";
        public const string GLOBAL_CODE_CATEGORY_NOT_UPDATED = "Global code category not updated successfully.";
        public const string GLOBAL_CODE_CATEGORY_DELETED = "Global code category deleted successfully.";
        public const string GLOBAL_CODE_CATEGORY_NOT_DELETED = "Global Code Cateegory not deleted successfully.";
        public const string GLOBAL_CODE_CATEGORY_NOT_EXISTS = "Global Code Category not exist.";
        public const string GLOBAL_CODE_CATEGORY_AllRECORDS_UPDATED = "";

        //Email Errors
        public const string EMAIL_ERROR = "Error while sending email";

        //Role Messages
        public const string Role_Created_Success = "Role Created Successfully";
        public const string Role_Save_Success = "Role Save Created";
        public const string Role_Not_Created = "Role Not Created";
        public const string Role_Update_Success = "Role Update Successfully";
        public const string Role_Not_Update = "Role Not Update";
        public const string Role_Deleted_Success = "Role Delete Successfully";
        public const string Role_Not_Delete = "Role Not Delete";


        //User Role Messages
        public const string User_Role_Created_Success = "User Role Created Successfully";
        public const string User_Role_Updated_Success = "User Role Updated Successfully";
        public const string User_Role_Deleted_Success = "User Role Deleted Successfully";
        public const string Role_Already_Exists = "Role Already Exists";
        public const string Role_Exist = "Role Exist";
        public const string Role_Not_Exist = "Role Not Exist";
        //Screen Messages
        public const string Screen_Created_Success = "Screen Created Successfully";
        public const string Screen_Already_Exists = "Screen Already Exists";
        public const string Screen_Update_Success = "Screen Update Successfully";
        public const string Screen_Not_Update = "Screen Not Update";
        public const string Screen_Deleted_Success = "Screen Delete Successfully";
        public const string Screen_Not_Delete = "Screen Not Delete";
        public const string Screen_Exist = "Screen Exist";
        public const string Screen_Not_Exist = "Screen Not Exist";
        // RolePermission Messages
        public const string RolePermission_Not_Update = "Role Permission Not Update";
        public const string RolePermission_Update = "Role Permission Update Successfully";
        public const string RolePermission_Created_Success = "Role Permission Created Successfully";
        public const string RolePermission_Exist = "Role Permission Exist";
        public const string RolePermission_Not_Exist = "Role Permission Not Exist";
        public const string RolePermission_Already_Exists = "Already Have Role Permission";
        public const string RolePermission_Deleted_Success = "Role Permission Delete Successfully";
        public const string RolePermission_Not_Delete = "Role Permission Not Delete";
    }
}
