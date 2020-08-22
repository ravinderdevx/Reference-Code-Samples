using System.Threading.Tasks;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.Data;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using System.Linq;
using System.Data.SqlTypes;
using System.Collections.Generic;

namespace DitsPortal.DataAccess.Repositories
{
    public class RoleRepository: BaseRepository<Roles>, IRoleRepository
    {
       ApplicationDBContext ObjContext;
        public RoleRepository(ApplicationDBContext context) : base(context)
        {
            ObjContext = context;
        }
       public async Task<MainRoleResponse>GetAllRoles(RecordFilterRequest FilterRequest)
        {
            FilterRequest.Page = FilterRequest.Page == 0 ? 1 : FilterRequest.Page;
            FilterRequest.Limit = FilterRequest.Limit == 0 ? 10 : FilterRequest.Limit;
            MainRoleResponse mainResponse = new MainRoleResponse();
            IQueryable<RoleResponse> data;
            try
            {
                data =(from r in ObjContext.Roles
                        where r.IsDeleted == false
                        select new RoleResponse
                        {
                            RoleId = r.RoleId,
                            RoleName = r.RoleName,
                            RoleDescription = r.Description,
                            CreatedOn = r.CreatedOn,
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
                    mainResponse.roleResponseData =  data.ToList();
                }
                else
                {
                    mainResponse.roleResponseData = data.Skip((FilterRequest.Page - 1) * FilterRequest.Limit).Take(FilterRequest.Limit).ToList();
                }

                return mainResponse;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
        public async Task<RoleResponse> GetRoleById(int roleId)
        {
            RoleResponse role = new RoleResponse();
            try
            {
                role = (from r in ObjContext.Roles
                        where r.RoleId == roleId && r.IsDeleted == false
                        select new RoleResponse
                        {
                            RoleId = r.RoleId,
                            RoleName = r.RoleName,
                            RoleDescription = r.Description,
                            CreatedOn = r.CreatedOn,
                            CreatedBy = r.CreatedBy,
                            ModifiedBy = r.ModifiedBy,
                        }).FirstOrDefault();
                return role;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
        public async Task<RoleResponse> GetRolesByIdAndName(RoleRequest roleRequest)
        {
            RoleResponse role = new RoleResponse();
            try
            {
                role = (from r in ObjContext.Roles
                        where r.RoleName == roleRequest.RoleName && r.IsDeleted==false
                        select new RoleResponse
                        {
                            RoleId = r.RoleId,
                            RoleName = r.RoleName,
                            RoleDescription = r.Description,
                        }).FirstOrDefault();
                return role;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }

    }
}