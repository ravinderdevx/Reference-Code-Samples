using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.DataAccess.Data;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.Repositories
{
    public class UserRoleRepository: IUserRoleRepository
    {

        #region private

        #endregion

        #region constructor 
        ApplicationDBContext objContext;
        public UserRoleRepository(ApplicationDBContext context)
        {
            objContext = context;
        }
        #endregion

        public async Task<UserRoleResponse> GetAllUserRole()
        {
            UserRoleResponse userRoleResponse = new UserRoleResponse();
            try
            {
                userRoleResponse.GetUserRoles = (from u in objContext.Users
                               join ur in objContext.UserRole on u.UserId equals ur.Userld
                               join r in objContext.Roles on ur.RoleId equals r.RoleId
                               where ur.IsDeleted == false && r.IsDeleted == false
                               select new GetUserRole
                               {
                                   UserId = u.UserId,
                                   UserName = u.UserName,
                                   RoleId = r.RoleId,
                                   RoleName = r.RoleName
                               }).ToList();

                userRoleResponse.Status = true;
                return userRoleResponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<UserRoleResponse> AddUserRole(UserRoleRequestForAdd userRoleRequestForAdd)
        {
            
            UserRoleResponse userRoleResponse = new UserRoleResponse();
            try
            {                               
                    for (int i = 0; i <= userRoleRequestForAdd.addUserRoleRequests.Count-1; i++)
                    {
                        UserRole userRole= new UserRole();
                        userRole.Userld = userRoleRequestForAdd.UserId;
                        userRole.RoleId = userRoleRequestForAdd.addUserRoleRequests[i].RoleId;
                        userRole.IsActive = userRoleRequestForAdd.IsActive;
                        userRole.CreatedBy = "Admin";
                        userRole.CreatedOn = DateTime.Now;
                        objContext.UserRole.Add(userRole);
                        await objContext.SaveChangesAsync();
                        
                    }
                userRoleResponse.Status = true;
                userRoleResponse.Message = Constants.Role_Created_Success;
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return userRoleResponse;
        }
        public async Task<UserRoleResponse> UpdateUserRole(UserRoleRequestForUpdate userRoleRequestForUpdate)
        {
            UserRoleResponse userRoleResponse = new UserRoleResponse();
            try
            {
                var updateUserRoles = objContext.UserRole.Where(ur => ur.Userld == userRoleRequestForUpdate.UserId).ToList();
                if (updateUserRoles != null)
                {
                    for (int i = 0; i <= updateUserRoles.Count - 1; i++)
                    {
                        updateUserRoles[i].IsDeleted = true;
                        updateUserRoles[i].DeletedBy = "Admin";
                        updateUserRoles[i].DeletedOn = DateTime.Now;
                        await objContext.SaveChangesAsync();
                    }
                }
                if (userRoleRequestForUpdate.updateUserRoleRequests.Count > 0)
                {
                    for (int i = 0; i <= userRoleRequestForUpdate.updateUserRoleRequests.Count - 1; i++)
                    {
                        UserRole userRole = new UserRole();
                        userRole.Userld = userRoleRequestForUpdate.UserId;
                        userRole.RoleId = userRoleRequestForUpdate.updateUserRoleRequests[i].RoleId;
                        userRole.ModifiedBy = "Admin";
                        userRole.ModifiedOn = DateTime.Now;
                        objContext.UserRole.Add(userRole);
                        await objContext.SaveChangesAsync();
                    }
                }
                userRoleResponse.Status = true;
                userRoleResponse.Message = Constants.User_Role_Updated_Success;
                                               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return userRoleResponse;
        }
        public async Task<UserRoleResponse>DeleteUserRole(DeleteUserRoleRequest deleteUserRoleRequest)
        {
            UserRoleResponse userRoleResponse = new UserRoleResponse();
            try
            {
                var deleteUserRole = objContext.UserRole
                    .Where(u => u.Userld == deleteUserRoleRequest.UserId && u.RoleId == deleteUserRoleRequest.RoleId).FirstOrDefault();
                if (deleteUserRole != null)
                {
                    deleteUserRole.IsDeleted = true;
                    deleteUserRole.DeletedBy = "Admin";
                    deleteUserRole.DeletedOn = DateTime.Now;
                    await objContext.SaveChangesAsync();

                    userRoleResponse.Status = true;
                    userRoleResponse.Message = Constants.User_Role_Deleted_Success;
                }else
                {
                    userRoleResponse.Status = false;
                    userRoleResponse.Message = Constants.USER_NOT_EXITS;
                }

                return userRoleResponse;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
