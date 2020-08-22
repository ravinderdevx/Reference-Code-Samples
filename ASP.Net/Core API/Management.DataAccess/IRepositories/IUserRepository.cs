using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DitsPortal.DataAccess.IRepositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<ProfileResponse> GetUser(GetUserRequest userId);
        Task<MainUserResponse> GetAllUser(RecordFilterRequest recordFilterRequest);
        UserResponse LoginUser(int userId);
        Task<BaseResponse> AddUser(UserRegisterRequest register);
        Task<BaseResponse> UpdateUserRole(UserProfileRequest profileRequest);
    }
}
