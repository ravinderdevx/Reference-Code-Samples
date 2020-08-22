using System;
using System.Collections.Generic;
using System.Text;
using DitsPortal.Common.Requests;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.Common.Responses;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.IRepositories
{
    public interface IScreenRepository : IBaseRepository<Screens>
    {
        Task<ScreenResponse> GetScreenByIdAndName(ScreenRequest roleRequest);
        Task<ScreenResponse> GetScreenById(int screenId);
        Task<MainScreenResponse> GetAllScreen(RecordFilterRequest recordFilterRequest);

    }
}
