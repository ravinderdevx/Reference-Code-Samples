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
    public class RolePermissionService : IRolePermissionService
    {
        #region
        private readonly IMapper _mapper;
        private readonly IRolePermissionRepository _rolePermissionRepository;
        #endregion
        #region Object Variables
        private MainRolePermissionResponse _response;
        private RolePermissionResponse roleResponse;
        #endregion
        #region
        public RolePermissionService(IRolePermissionRepository rolePermissionRepository, IMapper mapper)
        {
            _rolePermissionRepository = rolePermissionRepository;
            _mapper = mapper;
            _response = new MainRolePermissionResponse();
            _response.Status = false;
        }
        #endregion
        public async Task<MainRolePermissionResponse> AddRolePermission(RolePermissionRequest rolePermissionRequest)
        {
            var rolePermissions = _mapper.Map<RolePermissions>(rolePermissionRequest);
            try
            {
                var isExist = _rolePermissionRepository.GetRolesPerminssion(rolePermissionRequest);
                if (rolePermissions.RolePermissionId == 0 && isExist.Result == null)
                {
                    rolePermissions.CreatedBy = rolePermissionRequest.UserId.ToString();
                    var dataRole = await _rolePermissionRepository.AddAsync(rolePermissions);
                }
                else
                {
                    _response.Message = Constants.RolePermission_Already_Exists;
                    _response.Status = false; return _response;
                }
                _response.Message = Constants.RolePermission_Created_Success;
                _response.Status = true;
            }
            catch (Exception)
            {
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;

        }

        public async Task<MainRolePermissionResponse> UpdateRolePermission(RolePermissionRequest rolePermissionRequest)
        {
            var rolePermissions = _mapper.Map<RolePermissions>(rolePermissionRequest);
            try
            {
                var data = _rolePermissionRepository.GetRolesPerminssionById(rolePermissionRequest);
                if (data.Result != null)
                {
                    var rolePermission = _mapper.Map<RolePermissions>(data.Result);
                    rolePermission.RoleId = rolePermissions.RoleId;
                    rolePermission.ScreenId = rolePermissions.ScreenId;
                    rolePermission.PermissionId = rolePermissions.PermissionId;
                    rolePermission.ModifiedOn = DateTime.Now;
                    rolePermission.ModifiedBy = rolePermissionRequest.UserId.ToString();
                    rolePermission.IsActive = rolePermissionRequest.IsActive;
                    var dataRole = await _rolePermissionRepository.UpdateAsync(rolePermission);
                }
                else
                {
                    _response.Message = Constants.RolePermission_Not_Update;
                    _response.Status = false;
                    return _response;
                }
                _response.Message = Constants.RolePermission_Update;
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
        public async Task<MainRolePermissionResponse> DeleteRolePermission(RolePermissionDeleteRequest roleDeleteRequest)
        {
            try
            {
                var data = _rolePermissionRepository.Get<RolePermissions>(roleDeleteRequest.RolePermissionId);
                var rolePermission = _mapper.Map<RolePermissions>(data);
                if (rolePermission.RolePermissionId != 0)
                {
                    rolePermission.DeletedOn = DateTime.Now;
                    rolePermission.DeletedBy = roleDeleteRequest.UserId.ToString();
                    rolePermission.IsDeleted = true;
                    var dataRole = await _rolePermissionRepository.UpdateAsync(rolePermission);
                    _response.Message = Constants.RolePermission_Deleted_Success;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.Role_Not_Delete;
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

        public async Task<MainRolePermissionResponse> GetAllRolesPermission(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                var isExist = _rolePermissionRepository.GetAllRolesPermission(recordFilterRequest);
                if (isExist.Result != null)
                {
                    //_response.roleResponseData = isExist.Result.roleResponseData;
                    //_response.roleResponse = roleResponse;
                    //_response.Message = Constants.Role_Exist;
                    _response.Status = true;
                }
                else
                {
                    _response.Message = Constants.Role_Not_Exist;
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
