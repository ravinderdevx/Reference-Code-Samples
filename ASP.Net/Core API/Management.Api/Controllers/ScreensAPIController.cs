using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.DBEntities.Base;
using DitsPortal.Services.IServices;
namespace DitsPortal.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ScreensAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private string _json = string.Empty;

        #region constructor
        private readonly IScreenService _screenService;
        private MainScreenResponse _response;
        #endregion

        #region constructor
        public ScreensAPIController(IScreenService screenService, IMapper mapper)
        {
            _mapper = mapper;
            _screenService = screenService;
        }
        #endregion

        [HttpPost]
        public async Task<ActionResult> AddScreen([FromBody]ScreenRequest screenRequest)
        {
            try
            {
                _response = await _screenService.AddScreen(screenRequest);
                return new OkObjectResult(_response);
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Status = false;
                return BadRequest("");
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateScreen([FromBody]ScreenRequest screenRequest)
        {
            try
            {
                _response = await _screenService.UpdateScreen(screenRequest);
                return new OkObjectResult(_response);
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Status = false;
                return BadRequest("");
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeleteScreen([FromBody]ScreenDeleteRequest screenDeleteRequest)
        {
            try
            {
                _response = await _screenService.DeleteScreen(screenDeleteRequest);
                return new OkObjectResult(_response);
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Status = false;
                return BadRequest(_response);
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetScreenById([FromBody]ScreenIdRequest screenIdRequest)
        {
            try
            {

                _response = await _screenService.GetScreenById(screenIdRequest.ScreensId);
                return new OkObjectResult(_response);
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Status = false;
                return BadRequest(_response);
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetAllScreen(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                _response = await _screenService.GetAllScreen(recordFilterRequest);
                return new OkObjectResult(_response);
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.Status = false;
                return BadRequest(_response);
            }
        }
    }
}