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
    public class RolePermissionAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private string _json = string.Empty;
        #region constructor
        private readonly IRolePermissionService _rolePermissionService;
        private MainRolePermissionResponse _response;
        #endregion
        #region constructor
        public RolePermissionAPIController(IRolePermissionService rolePermissionService, IMapper mapper)
        {
            _mapper = mapper;
            _rolePermissionService = rolePermissionService;
        }
        #endregion

        [HttpPost]
        public async Task<ActionResult> AddRolePermission([FromBody]RolePermissionRequest rolePermissionRequest)
        {
            try
            {
                _response = await _rolePermissionService.AddRolePermission(rolePermissionRequest);
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
        public async Task<ActionResult> UpdateRolePermission([FromBody]RolePermissionRequest rolePermissionRequest)
        {
            try
            {
                _response = await _rolePermissionService.UpdateRolePermission(rolePermissionRequest);
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
        public async Task<ActionResult> DeleteRole([FromBody]RolePermissionDeleteRequest rolePermissionDeleteRequest)
        {
            try
            {
                _response = await _rolePermissionService.DeleteRolePermission(rolePermissionDeleteRequest);
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
        public async Task<ActionResult> GetAllRolesPermission(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                _response = await _rolePermissionService.GetAllRolesPermission(recordFilterRequest);
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