using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.DBEntities.Base;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.IRepositories
{
   public interface IRoleRepository : IBaseRepository<Roles>
    {
        Task<RoleResponse> GetRolesByIdAndName(RoleRequest roleRequest);
        Task<RoleResponse> GetRoleById(int roleId);
        Task<MainRoleResponse> GetAllRoles(RecordFilterRequest recordFilterRequest);
    }
}
