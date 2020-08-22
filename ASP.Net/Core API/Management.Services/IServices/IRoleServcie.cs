using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.Services.IServices
{
    public interface IRoleServcie
    {
        Task<MainRoleResponse> AddRole(RoleRequest roleRequest);
        Task<MainRoleResponse> UpdateRole(RoleRequest roleRequest);
       Task <MainRoleResponse> DeleteRole(RoleDeleteRequest roleDeleteRequest);
       Task <MainRoleResponse> RoleGetById(int roleId);
       Task <MainRoleResponse> GetAllRoles(RecordFilterRequest recordFilterRequest);
    }
}
