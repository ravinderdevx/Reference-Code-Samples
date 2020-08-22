using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Requests
{
    public class UserRoleRequestForAdd
    {
        public int UserId { get; set; }
        public List<AddUserRoleRequest> addUserRoleRequests { get; set; }
        public bool IsActive { get; set; }
    }
    public class UserRoleRequestForUpdate
    {
        public int UserId { get; set; }
        public List<UpdateUserRoleRequest> updateUserRoleRequests { get; set; }
        public bool IsActive { get; set; }
    }
    public class AddUserRoleRequest
    {
        public int RoleId { get; set; }
    }
    public class UpdateUserRoleRequest
    {
        public int RoleId { get; set; }
    }

    public class DeleteUserRoleRequest
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }

}
