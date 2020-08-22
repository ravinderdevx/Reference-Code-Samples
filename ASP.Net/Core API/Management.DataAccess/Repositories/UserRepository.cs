using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.DataAccess.Data;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DitsPortal.DataAccess.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        ApplicationDBContext ObjContext;
        private MainResponse _response;
        private readonly IMapper _mapper;
        public UserRepository(ApplicationDBContext context) : base(context)
        {
            ObjContext = context;
        }
        public async Task<ProfileResponse> GetUser(GetUserRequest getUserRequest)
        {
            ProfileResponse userResponse = new ProfileResponse();
            if (getUserRequest.UserId != 0)
            {
                var Recored = await (
                    from user in ObjContext.Users
                    join gc1 in ObjContext.GlobalCodes on user.Gender equals gc1.GlobalCodeId into gcode1
                    from gcd1 in gcode1.DefaultIfEmpty()
                    join gc2 in ObjContext.GlobalCodes on user.BloodGroup equals gc2.GlobalCodeId into gcode2
                    from gcd2 in gcode2.DefaultIfEmpty()
                    join gc3 in ObjContext.GlobalCodes on user.Designation equals gc3.GlobalCodeId into gcode3
                    from gcd3 in gcode3.DefaultIfEmpty()
                    where user.UserId == getUserRequest.UserId && user.IsDeleted == false
                    select new ProfileResponse
                    {
                        //token = user.ResetToken,
                        UserId = user.UserId,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        UserName = user.UserName,
                        Email = user.Email,
                        DateOfBirth = user.DateOfBirth,
                        Gender = new Genders
                        {
                            GenderName = gcd1 != null ? gcd1.CodeName : "",
                            Id = gcd1 != null ? gcd1.GlobalCodeId : 0
                        },
                        Designation = new Designations
                        {
                            Id = gcd3 != null ? gcd3.GlobalCodeId : 0,
                            DesignationName = gcd3 != null ? gcd3.CodeName : ""
                        },
                        Phone = user.Phone,
                        AlternateNumber = user.AlternateNumber,
                        OfficialEmail = user.OfficialEmail,
                        Skype = user.Skype,
                        PAN = user.PAN,
                        BloodGroup = new BloodGroups
                        {
                            Id = gcd2 != null ? gcd2.GlobalCodeId : 0,
                            BloodGroupName = gcd2 != null ? gcd2.CodeName : ""
                        },
                        dateofjoining = user.DateOfJoining,
                        DateOfLeaving = user.DateOfLeaving,
                        MediaId = user.MediaId,
                        LastLoggedIn = user.LastLoggedIn,
                    }).FirstOrDefaultAsync();
                userResponse = Recored;
                return userResponse;
            }
            else
            {
                return userResponse;
            }
        }
        public UserResponse LoginUser(int userId)
        {
            UserResponse userResponse = new UserResponse();
            userResponse = (from user in ObjContext.Users
                            where user.UserId == userId && user.IsActive == true
                            select new UserResponse
                            {
                                UserId = user.UserId,
                                UserName = user.UserName,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Email = user.Email,
                                DateOfBirth = user.DateOfBirth,
                                Roles = (
                                    from userRole in ObjContext.UserRole
                                    join roles in ObjContext.Roles on userRole.RoleId equals roles.RoleId
                                    where roles.IsActive == true
                                    select new UserRoles
                                    {
                                        RoleId = roles.RoleId,
                                        RoleName = roles.RoleName,
                                        RoleDescription = roles.Description,
                                        userScreens = (from rper in ObjContext.RolePermissions
                                                       join scr in ObjContext.Screens on rper.ScreenId equals scr.ScreensId
                                                       where rper.RoleId == roles.RoleId
                                                       select new UserScreens
                                                       {
                                                           ScreensId = scr.ScreensId,
                                                           ScreensName = scr.ScreensName,
                                                           ScreensDescription = scr.Description,
                                                           userPermission = (from rper in ObjContext.RolePermissions
                                                                             join per in ObjContext.Permissions on rper.PermissionId equals per.PermissionId
                                                                             where rper.PermissionId == scr.ScreensId
                                                                             select new UserPermission
                                                                             {
                                                                                 PermissionId = per.PermissionId,
                                                                                 PermissionName = per.PermissionName,
                                                                                 PermissionDescription = per.Description
                                                                             }
                                                           ).ToList()
                                                       }).ToList()
                                    }).ToList()
                            }).FirstOrDefault();
            return userResponse;
        }

        public async Task<MainUserResponse> GetAllUser(RecordFilterRequest FilterRequest)
        {

            FilterRequest.Page = FilterRequest.Page == 0 ? 1 : FilterRequest.Page;
            FilterRequest.Limit = FilterRequest.Limit == 0 ? 10 : FilterRequest.Limit;
            try
            {
                MainUserResponse userResponse = new MainUserResponse();
                var data = (
                    from user in ObjContext.Users
                    join gc1 in ObjContext.GlobalCodes on user.Gender equals gc1.GlobalCodeId into gcode1
                    from gcd1 in gcode1.DefaultIfEmpty()
                    join gc2 in ObjContext.GlobalCodes on user.BloodGroup equals gc2.GlobalCodeId into gcode2
                    from gcd2 in gcode2.DefaultIfEmpty()
                    join gc3 in ObjContext.GlobalCodes on user.Designation equals gc3.GlobalCodeId into gcode3
                    from gcd3 in gcode3.DefaultIfEmpty()
                    where user.IsDeleted == false
                    select new ProfileResponse
                    {
                    //token = user.ResetToken,
                    UserId = user.UserId,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        UserName = user.UserName,
                        Email = user.Email,
                        DateOfBirth = user.DateOfBirth,
                        Gender = new Genders
                        {
                            GenderName = gcd1 != null ? gcd1.CodeName : "",
                            Id = gcd1 != null ? gcd1.GlobalCodeId : 0
                        },
                        Designation = new Designations
                        {
                            Id = gcd3 != null ? gcd3.GlobalCodeId : 0,
                            DesignationName = gcd3 != null ? gcd3.CodeName : ""
                        },
                        Phone = user.Phone,
                        AlternateNumber = user.AlternateNumber,
                        OfficialEmail = user.OfficialEmail,
                        Skype = user.Skype,
                        PAN = user.PAN,
                        BloodGroup = new BloodGroups
                        {
                            Id = gcd2 != null ? gcd2.GlobalCodeId : 0,
                            BloodGroupName = gcd2 != null ? gcd2.CodeName : ""
                        },
                        dateofjoining = user.DateOfJoining,
                        DateOfLeaving = user.DateOfLeaving,
                        MediaId = user.MediaId,
                        LastLoggedIn = user.LastLoggedIn,
                    });

                if (FilterRequest.OrderByDescending == true)
                {
                    data = data.OrderByDescending(x => x.GetType().GetProperty(FilterRequest.OrderBy).GetValue(x));
                }
                else
                {
                    data = data.OrderBy(x => x.GetType().GetProperty(FilterRequest.OrderBy).GetValue(x));
                }
                var count = data.Count();
                if (FilterRequest.AllRecords)
                {
                    userResponse.userResponseData = data.ToList();
                }
                else
                {
                    userResponse.userResponseData = data.Skip((FilterRequest.Page - 1) * FilterRequest.Limit).Take(FilterRequest.Limit).ToList();
                }
                return userResponse;

            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
        public async Task<BaseResponse> AddUser(UserRegisterRequest register)
        {
            User user = new User();
            BaseResponse baseResponse = new BaseResponse();
            string encodePassword = EncodeComparePassword.GetMd5Hash(register.Password);
            try
            {
                user.UserName = register.UserName;
                user.FirstName = register.FirstName;
                user.LastName = register.LastName;
                user.Gender = register.Gender;
                user.DateOfBirth = register.DateOfBirth;
                user.Designation = register.Designation;
                user.Phone = register.Phone;
                user.AlternateNumber = register.AlternateNumber;
                user.Email = register.Email;
                user.Password = encodePassword;
                user.OfficialEmail = register.OfficialEmail;
                user.Skype = register.Skype;
                user.PAN = register.PAN;
                user.BloodGroup = register.BloodGroup;
                user.DateOfJoining = register.DateOfjoining;
                user.DateOfLeaving = register.DateOfLeaving;
                user.MediaId = register.MediaId;
                user.IsActive = true;
                user.CreatedBy = "Admin";
                user.CreatedOn = DateTime.Now;
                user.IsApproved = register.IsApproved;
                ObjContext.Users.Add(user);
                await ObjContext.SaveChangesAsync();

                if (register.addUserRoles.Count > 0)
                {
                    var getUserId = ObjContext.Users.Where(u => u.Email == register.Email).FirstOrDefault();

                    for (int i = 0; i <= register.addUserRoles.Count - 1; i++)
                    {
                        UserRole userRole = new UserRole();

                        userRole.Userld = getUserId.UserId;
                        userRole.RoleId = register.addUserRoles[i].RoleId;
                        userRole.IsActive = true;
                        userRole.CreatedBy = "Admin";
                        userRole.CreatedOn = DateTime.Now;
                        ObjContext.UserRole.Add(userRole);
                        await ObjContext.SaveChangesAsync();
                    }
                }

                baseResponse.Status = true;
                baseResponse.Message = Constants.USER_PROFILE_CREATED;

            }
            catch (Exception ex)
            {
                baseResponse.Status = false;
                baseResponse.Message = ex.Message;
            }
            return baseResponse;
        }
        public async Task<BaseResponse> UpdateUserRole(UserProfileRequest profileRequest)
        {
            BaseResponse baseResponse = new BaseResponse();
            try
            {
                var updateUserRoles = ObjContext.UserRole.Where(ur => ur.Userld == profileRequest.UserId).ToList();
                if (updateUserRoles != null)
                {
                    for (int i = 0; i <= updateUserRoles.Count - 1; i++)
                    {
                        updateUserRoles[i].IsDeleted = true;
                        updateUserRoles[i].DeletedBy = "Admin";
                        updateUserRoles[i].DeletedOn = DateTime.Now;
                        await ObjContext.SaveChangesAsync();
                    }
                }
                if (profileRequest.updateUserRoles.Count > 0)
                {
                    for (int i = 0; i <= profileRequest.updateUserRoles.Count - 1; i++)
                    {
                        UserRole userRole = new UserRole();
                        userRole.Userld = profileRequest.UserId;
                        userRole.RoleId = profileRequest.updateUserRoles[i].RoleId;
                        userRole.ModifiedBy = "Admin";
                        userRole.ModifiedOn = DateTime.Now;
                        ObjContext.UserRole.Add(userRole);
                        await ObjContext.SaveChangesAsync();
                    }
                }
                baseResponse.Status = true;
            }
            catch (Exception ex)
            {
                baseResponse.Status = false;
                baseResponse.Message = ex.Message;

            }
            return baseResponse;
        }
    }
}
