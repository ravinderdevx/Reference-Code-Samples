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
   public class ScreenRepository : BaseRepository<Screens>, IScreenRepository
    {
        ApplicationDBContext ObjContext;
        public ScreenRepository(ApplicationDBContext context) : base(context)
        {
            ObjContext = context;
        }

        public async Task<ScreenResponse> GetScreenByIdAndName(ScreenRequest screenRequest)
        {
            ScreenResponse screen=new ScreenResponse();
            try
            {
                screen = (from s in ObjContext.Screens
                        where s.ScreensName == screenRequest.ScreensName && s.IsDeleted == false
                        select new ScreenResponse
                        {
                            ScreensId = s.ScreensId,
                            ScreensName = s.ScreensName,
                            Description = s.Description,
                        }).FirstOrDefault();
                return screen;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
        public async Task<ScreenResponse> GetScreenById(int screenId)
        {
            ScreenResponse screen = new ScreenResponse();
            try
            {
                screen = (from s in ObjContext.Screens
                        where s.ScreensId == screenId && s.IsDeleted == false
                        select new ScreenResponse
                        {
                            ScreensId = s.ScreensId,
                            ScreensName =s.ScreensName,
                            Description = s.ScreensName,
                            CreatedOn = s.CreatedOn,
                            CreatedBy = s.CreatedBy,
                            ModifiedBy = s.ModifiedBy,
                        }).FirstOrDefault();
                return screen;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
        public async Task<MainScreenResponse> GetAllScreen(RecordFilterRequest FilterRequest)
        {
            FilterRequest.Page = FilterRequest.Page == 0 ? 1 : FilterRequest.Page;
            FilterRequest.Limit = FilterRequest.Limit == 0 ? 10 : FilterRequest.Limit;
            MainScreenResponse mainResponse = new MainScreenResponse();
            IQueryable<ScreenResponse> data;
            try
            {
                data = (from s in ObjContext.Screens
                        where s.IsDeleted == false
                        select new ScreenResponse
                        {
                            ScreensId = s.ScreensId,
                            ScreensName = s.ScreensName,
                            Description = s.Description,
                            CreatedOn = s.CreatedOn,
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
                    mainResponse.screenResponseData = data.ToList();
                }
                else
                {
                    mainResponse.screenResponseData = data.Skip((FilterRequest.Page - 1) * FilterRequest.Limit).Take(FilterRequest.Limit).ToList();
                }

                return mainResponse;
            }
            catch (System.Exception ex)
            {
                var msg = ex.Message;
                throw;
            }
        }
    }
}
