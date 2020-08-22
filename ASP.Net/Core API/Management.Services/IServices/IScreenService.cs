using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.Services.IServices
{
   public interface IScreenService
    {
        Task<MainScreenResponse> AddScreen(ScreenRequest screenRequest );
        Task<MainScreenResponse> UpdateScreen(ScreenRequest screenRequest);
        Task<MainScreenResponse> DeleteScreen(ScreenDeleteRequest screenDeleteRequest);
        Task<MainScreenResponse> GetScreenById(int screenId);
        Task<MainScreenResponse> GetAllScreen(RecordFilterRequest recordFilterRequest);

    }
}
