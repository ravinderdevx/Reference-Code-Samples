using System.Threading.Tasks;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.Data;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using System.Linq;
using System.Data.SqlTypes;
using System.Collections.Generic;
using System;

namespace DitsPortal.DataAccess.Repositories
{
    public class RolePermissionRepository : BaseRepository<RolePermissions>, IRolePermissionRepository
    {
        ApplicationDBContext ObjContext;
        public RolePermissionRepository(ApplicationDBContext context) : base(context)
        {
            ObjContext = context;
        }

        public async Task<RolePermissionResponse> GetRolesPerminssionById(RolePermissionRequest rolePermissionRequest)
        {
            RolePermissionResponse rolePermission = new RolePermissionResponse();
            try
            {
                rolePermission = (from rp in ObjContext.RolePermissions
                                  where rp.RolePermissionId == rolePermissionRequest.RolePermissionId && rp.IsDeleted == false
                                  select new RolePermissionResponse
                                  {
                                      rolePermissionId = rp.RolePermissionId,
                                      RoleId = rp.RoleId,
                                      ScreenId = rp.ScreenId,
                                      PermissionId = rp.PermissionId,
                                      CreatedOn = rp.CreatedOn,
                                      CreatedBy = Convert.ToInt32(rp.CreatedBy)
                                  }).FirstOrDefault();
                return rolePermission;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }

        public async Task<RolePermissionResponse> GetRolesPerminssion(RolePermissionRequest rolePermissionRequest)
        {
            RolePermissionResponse rolePermission = new RolePermissionResponse();
            try
            {
                rolePermission = (from rp in ObjContext.RolePermissions
                                  where rp.RoleId == rolePermissionRequest.RoleId && rp.ScreenId == rolePermissionRequest.ScreenId
                                  && rp.PermissionId == rolePermissionRequest.PermissionId && rp.IsDeleted == false
                                  select new RolePermissionResponse
                                  {
                                      rolePermissionId = rp.RolePermissionId,
                                      RoleId = rp.RoleId,
                                      ScreenId = rp.ScreenId,
                                      PermissionId = rp.PermissionId,
                                      CreatedOn = rp.CreatedOn,
                                      CreatedBy = Convert.ToInt32(rp.CreatedBy)
                                  }).FirstOrDefault();
                return rolePermission;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }


        }

        public async Task<MainRolePermissionResponse> GetAllRolesPermission(RecordFilterRequest recordFilterRequest)
        {
            MainRolePermissionResponse Role = new MainRolePermissionResponse();
            var data = (from userRole in ObjContext.UserRole
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
                        }).ToList();
            Role.roleResponseData = data;
            return Role;
        }
    }
}
