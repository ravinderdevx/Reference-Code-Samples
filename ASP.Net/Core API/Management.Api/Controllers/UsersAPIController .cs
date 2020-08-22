using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace DitsPortal.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class UsersAPIController : ControllerBase
    {
        #region readonly
        private readonly IUserService _userService;
        private readonly JsonSerializerSettings _serializerSettings;

        #endregion

        #region private
        private IOptions<AppSettings> _settings;
        private BaseResponse _response;
        private string _json = string.Empty;
        private UserProfileResponse _UserProfileResponse;
        private MainUserResponse _mainUserResponse;

        #endregion

        public UsersAPIController(IUserService userService, IOptions<AppSettings> settings)
        {
            _settings = settings;
            _userService = userService;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore
            };
            _mainUserResponse = new MainUserResponse();
            _response = new BaseResponse();
        }
        [HttpPost]
        public async Task<ActionResult> GetAllUser([FromBody]RecordFilterRequest recordFilterRequest)
        {
            try
            {
                _mainUserResponse = await _userService.GetAllUser(recordFilterRequest);
                return new OkObjectResult(_mainUserResponse);
            }
            catch (Exception ex)
            {
                _mainUserResponse.Message = ex.Message;
                _mainUserResponse.Status = false;
                _mainUserResponse.Message = Constants.DEFAULT_ERROR_MSG;
                return BadRequest(_mainUserResponse);
            }
        }
        [HttpPost]
        public async Task<ActionResult> UpdateProfile([FromBody]UserProfileRequest register)
        {
            try
            {
                _UserProfileResponse = await _userService.UpdateProfile(register);

                if (_UserProfileResponse.Status == false)
                {
                    return new OkObjectResult(_UserProfileResponse);
                }
                return new OkObjectResult(_UserProfileResponse);
            }
            catch (Exception ex)
            {
                _UserProfileResponse.Message = ex.Message;
                _UserProfileResponse.Status = false;
                return BadRequest(_UserProfileResponse);
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetProfile([FromBody]GetUserRequest getUserRequest)
        {
            try
            {
                _UserProfileResponse = await _userService.GetProfile(getUserRequest);

                if (_UserProfileResponse.Status == false)
                {
                    return new OkObjectResult(_UserProfileResponse);
                }
                return new OkObjectResult(_UserProfileResponse);
            }
            catch (Exception ex)
            {
                _UserProfileResponse.Message = ex.Message;
                _UserProfileResponse.Status = false;
                return BadRequest(_UserProfileResponse);
            }
        }

    }
}