using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using DitsPortal.Common.Requests;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess;
using DitsPortal.DataAccess.DBEntities.Base;
//using DitsPortal.API.DBEntities;

namespace DitsPortal.Services.AutoMapper.Mappings
{
    public class ModelToEntityMappingProfile: Profile
    {
        public ModelToEntityMappingProfile()
        {
            // Request Mapping
            CreateMap<UserRegisterRequest, User>();
            CreateMap<UserProfileRequest, User>();
            CreateMap<LeaveRequest, Leaves>();
            CreateMap<RoleRequest, Roles>();
            CreateMap<ScreenRequest, Screens>();
            // Response Mapping
            CreateMap<User, UserResponse>();
            CreateMap<UserResponse, User>();
            CreateMap<LeaveResponse, LeaveResponse>();
            CreateMap<Leaves, LeaveRequest>();
            CreateMap<Screens, ScreenResponse>();
        }
    }
}
