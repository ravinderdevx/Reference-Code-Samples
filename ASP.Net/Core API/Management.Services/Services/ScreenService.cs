using AutoMapper;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.DataAccess.IRepositories;
using DitsPortal.Services.IServices;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
namespace DitsPortal.Services.Services
{
    

   public class ScreenService: IScreenService
    {

        #region
        private readonly IMapper _mapper;
        private readonly IScreenRepository _screenRepository;
        #endregion
        #region Object Variables
        private MainScreenResponse _response;
        private ScreenResponse  screenResponse;
        #endregion
        #region
        public ScreenService(IScreenRepository screenRepository, IMapper mapper)
        {
            _screenRepository = screenRepository;
            _mapper = mapper;
            _response = new MainScreenResponse();
            _response.Status = false;
        }
        #endregion
        public async Task<MainScreenResponse> AddScreen(ScreenRequest screenRequest)
        {
            var screen = _mapper.Map<Screens>(screenRequest);
            try
            {
                var isExist = _screenRepository.GetScreenByIdAndName(screenRequest);
                if (screen.ScreensId == 0 && isExist.Result == null)
                {
                    screen.CreatedBy = screenRequest.UserId.ToString();
                    var dataRole = await _screenRepository.AddAsync(screen);
                }
                else
                {
                    _response.Message = Constants.Screen_Already_Exists;
                    _response.Status = false; return _response;
                }
                _response.Message = Constants.Screen_Created_Success;
                _response.Status = true;
            }
            catch (Exception)
            {
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }
        public async Task<MainScreenResponse> UpdateScreen(ScreenRequest screenRequest )
        {
            try
            {
                var getScreen = _screenRepository.GetScreenById(screenRequest.ScreensId);
                if (getScreen.Result != null)
                {
                    var Screen = _mapper.Map<Screens>(getScreen.Result);
                    Screen.ScreensName = getScreen.Result.ScreensName;
                    Screen.Description = getScreen.Result.Description;
                    Screen.ModifiedOn = DateTime.Now;
                    Screen.ModifiedBy = screenRequest.UserId.ToString();
                    var dataScreen = await _screenRepository.UpdateAsync(Screen);
                }
                else
                {
                    _response.Message = Constants.Screen_Not_Update;
                    _response.Status = false;
                    return _response;
                }
                _response.Message = Constants.Screen_Update_Success;
                _response.Status = true;
                return _response;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }

        public async Task<MainScreenResponse> DeleteScreen(ScreenDeleteRequest screenDeleteRequest)
        {
            try
            {
                var isExistRecord = _screenRepository.Get<Screens>(screenDeleteRequest.ScreensId);
                var screen = _mapper.Map<Screens>(isExistRecord);
                if (screen.ScreensId != 0)
                {
                    screen.DeletedOn = DateTime.Now;
                    screen.DeletedBy = screenDeleteRequest.ActionBy.ToString();
                    screen.IsDeleted = true;
                    var dataRole = await _screenRepository.UpdateAsync(screen);
                    _response.Message = Constants.Screen_Deleted_Success;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.Screen_Not_Delete;
                    _response.Status = false;
                }
            }
            catch (Exception)
            {
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }
        public async Task<MainScreenResponse> GetScreenById(int screenId)
        {
            try
            {
                var isExist = _screenRepository.GetScreenById(screenId);
                if (isExist.Result != null)
                {
                    screenResponse = isExist.Result;
                    _response.screenResponse = screenResponse;
                    _response.Message = Constants.Screen_Exist;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.Screen_Not_Exist;
                    _response.Status = false;
                }
                ;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }
        public async Task<MainScreenResponse> GetAllScreen(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                var isExist = _screenRepository.GetAllScreen(recordFilterRequest);
                if (isExist.Result != null)
                {
                    _response.screenResponseData = isExist.Result.screenResponseData;
                    _response.screenResponse = screenResponse;
                    _response.Message = Constants.Screen_Exist;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.Screen_Not_Exist;
                    _response.Status = false;
                }
                ;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;
        }
    }
}
