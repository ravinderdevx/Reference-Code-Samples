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
    public class RoleService : IRoleServcie
    {
        #region
        private readonly IMapper _mapper;
        private readonly IRoleRepository _roleRepository;
        #endregion
        #region Object Variables
        private MainRoleResponse _response;
        private RoleResponse roleResponse;
        #endregion
        #region
        public RoleService(IRoleRepository roleRepository, IMapper mapper)
        {

            _roleRepository = roleRepository;
            _mapper = mapper;
            _response = new MainRoleResponse();
            _response.Status = false;
        }
        #endregion

        public async Task<MainRoleResponse> AddRole(RoleRequest roleRequest)
        {
            var role = _mapper.Map<Roles>(roleRequest);
            try
            {
                var isExist = _roleRepository.GetRolesByIdAndName(roleRequest);
                if (role.RoleId == 0 && isExist.Result == null)
                {
                    role.CreatedBy = roleRequest.UserId.ToString();
                    var dataRole = await _roleRepository.AddAsync(role);
                    //_response.Message = dataRole == null ? Constants.Role_Not_Created : Constants.Role_Created_Success;
                }
                else
                {
                    _response.Message = Constants.Role_Already_Exists;
                    _response.Status = false; return _response;
                }
                _response.Message = Constants.Role_Created_Success;
                _response.Status = true;
            }
            catch (Exception)
            {
                _response.Status = false;
                _response.Message = Constants.DEFAULT_ERROR_MSG;
            }
            return _response;

        }
        public async Task<MainRoleResponse> DeleteRole(RoleDeleteRequest roleDeleteRequest)
        {
            try
            {
                var getRoleById = _roleRepository.Get<Roles>(roleDeleteRequest.RoleId);
                var role = _mapper.Map<Roles>(getRoleById);
                if (role.RoleId != 0)
                {
                    role.DeletedOn = DateTime.Now;
                    role.DeletedBy = roleDeleteRequest.UserId.ToString();
                    role.IsDeleted = true;
                    var dataRole = await _roleRepository.UpdateAsync(role);
                    _response.Message = Constants.Role_Deleted_Success;
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

        public async Task<MainRoleResponse> UpdateRole(RoleRequest roleRequest)
        {
            try
            {
                var getRole = _roleRepository.GetRoleById(roleRequest.RoleId);
                if (getRole.Result != null)
                {
                    var role = _mapper.Map<Roles>(getRole.Result);
                    role.RoleName = roleRequest.RoleName;
                    role.Description = roleRequest.Description;
                    role.ModifiedOn = DateTime.Now;
                    role.ModifiedBy = roleRequest.UserId.ToString();
                    var dataRole = await _roleRepository.UpdateAsync(role);
                }
                else
                {
                    _response.Message = Constants.Role_Not_Update;
                    _response.Status = false;
                    return _response;
                }
                _response.Message = Constants.Role_Update_Success;
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
        public async Task<MainRoleResponse> RoleGetById(int roleId)
        {
            try
            {
                var isExist = _roleRepository.GetRoleById(roleId);
                if (isExist.Result != null)
                {
                    roleResponse = isExist.Result;
                    _response.roleResponse = roleResponse;
                    _response.Message = Constants.Role_Exist;
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
        public async Task<MainRoleResponse> GetAllRoles(RecordFilterRequest recordFilterRequest)
        {
            try
            {
                var isExist = _roleRepository.GetAllRoles(recordFilterRequest);
                if (isExist.Result != null)
                {
                    _response.roleResponseData= isExist.Result.roleResponseData;
                    _response.roleResponse = roleResponse;
                    _response.Message = Constants.Role_Exist;
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
