using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.Common.StaticResources;
using DitsPortal.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DitsPortal.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class UserRoleAPIController : ControllerBase
    {

        #region private
        private readonly IUserRoleService _userRoleService;
        private string _json = string.Empty;
        #endregion

        #region object
        UserRoleResponse _userRoleResponse = new UserRoleResponse();
        #endregion

        #region constructor
        public UserRoleAPIController(IUserRoleService userRoleService)
        {
            _userRoleService = userRoleService;
        }
        #endregion

        [HttpGet]
        public async Task<ActionResult> GetAllUserRole()
        {
            try
            {
                _userRoleResponse = await _userRoleService.GetAllUserRole();
                return new OkObjectResult(_userRoleResponse);
            }
            catch (Exception ex)
            {
                _userRoleResponse.Message = ex.Message;
                _userRoleResponse.Status = false;
                return BadRequest(_userRoleResponse);
            }
        }
        [HttpPost]
        public async Task<ActionResult>AddUserRole([FromBody]UserRoleRequestForAdd userRoleRequestForAdd)
          {
            
            try
            {
                _userRoleResponse = await _userRoleService.AddUserRole(userRoleRequestForAdd);              
                return new OkObjectResult(_userRoleResponse);
            }
            catch (Exception ex)
            {
                _userRoleResponse.Message = ex.Message;
                _userRoleResponse.Status = false;
                return BadRequest(_userRoleResponse);

            }
        }
        [HttpPost]
        public async Task<ActionResult>UpdateUserRole([FromBody]UserRoleRequestForUpdate userRoleRequestForUpdate)
        {
            try
            {
                _userRoleResponse = await _userRoleService.UpdateUserRole(userRoleRequestForUpdate);
                return new OkObjectResult(_userRoleResponse);
            }
            catch (Exception ex)
            {
                _userRoleResponse.Message = ex.Message;
                _userRoleResponse.Status = false;
                return BadRequest(_userRoleResponse);
            }
        }
        [HttpPost]
        public async Task<ActionResult>DeleteUserRole([FromBody]DeleteUserRoleRequest deleteUserRoleRequest)
        {
            try
            {
                _userRoleResponse = await _userRoleService.DeleteUserRole(deleteUserRoleRequest);
                return new OkObjectResult(_userRoleResponse);
            }
            catch (Exception ex)
            {
                _userRoleResponse.Message = ex.Message;
                _userRoleResponse.Status = false;
                return BadRequest(_userRoleResponse);
            }
        }
    }
}