using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Responses
{
    public class UserRoleResponse
    {
        public Boolean Status { get; set; }
        public string Message { get; set; }
        public List<GetUserRole> GetUserRoles { get; set; }
    }
    public class GetUserRole
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
