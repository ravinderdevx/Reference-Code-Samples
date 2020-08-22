using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.IRepositories;
using DitsPortal.Services.IServices;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.Services.Services
{
   
    public class UserRoleService : IUserRoleService
    {

        #region private
        private readonly IUserRoleRepository _userRoleRepository;
        #endregion

        #region constructor
        public UserRoleService(IUserRoleRepository userRoleRepository)
        {
            _userRoleRepository = userRoleRepository;
        }
        #endregion
        public async Task<UserRoleResponse> GetAllUserRole()
        {
            return await _userRoleRepository.GetAllUserRole();
        }
        public async Task<UserRoleResponse> AddUserRole(UserRoleRequestForAdd userRoleRequestForAdd)
        {
            return await _userRoleRepository.AddUserRole(userRoleRequestForAdd);
        }
      
        public async Task<UserRoleResponse> UpdateUserRole(UserRoleRequestForUpdate userRoleRequestForUpdate)
        {
            return await _userRoleRepository.UpdateUserRole(userRoleRequestForUpdate);
        }

        public async Task<UserRoleResponse> DeleteUserRole(DeleteUserRoleRequest deleteUserRoleRequest)
        {
            return await _userRoleRepository.DeleteUserRole(deleteUserRoleRequest);
        }
    }
}
