using System;
using System.Collections.Generic;
using System.Text;
using DitsPortal.Common.Requests;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.Common.Responses;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.IRepositories
{
  public interface IRolePermissionRepository : IBaseRepository<RolePermissions>
    {
        Task<RolePermissionResponse> GetRolesPerminssionById(RolePermissionRequest rolePermissionRequest);
        Task<RolePermissionResponse> GetRolesPerminssion(RolePermissionRequest rolePermissionRequest);
        Task<MainRolePermissionResponse> GetAllRolesPermission(RecordFilterRequest recordFilterRequest);
    }
}
