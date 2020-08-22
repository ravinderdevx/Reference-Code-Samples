using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.IRepositories
{
    public interface IUserRoleRepository
    {
        Task<UserRoleResponse> GetAllUserRole();
        Task<UserRoleResponse> AddUserRole(UserRoleRequestForAdd userRoleRequestForAdd);
        Task<UserRoleResponse> UpdateUserRole(UserRoleRequestForUpdate userRoleRequestForUpdate);       
        Task<UserRoleResponse> DeleteUserRole(DeleteUserRoleRequest deleteUserRoleRequest);       
    }
}
