using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.Services.IServices
{
   public interface IRolePermissionService
    {
        Task<MainRolePermissionResponse> AddRolePermission(RolePermissionRequest rolePermissionRequest);
        Task<MainRolePermissionResponse> UpdateRolePermission(RolePermissionRequest rolePermissionRequest);
        Task<MainRolePermissionResponse> DeleteRolePermission(RolePermissionDeleteRequest roleDeleteRequest);
        Task<MainRolePermissionResponse> GetAllRolesPermission(RecordFilterRequest recordFilterRequest);

    }
}
