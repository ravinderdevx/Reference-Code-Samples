using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Requests
{
   public class RolePermissionRequest
    {
        public int RolePermissionId { get; set; }
        public int RoleId { get; set; }
        public int ScreenId { get; set; }
        public int PermissionId { get; set; }
        public int UserId { get; set; }
        public bool IsActive { get; set; }
    }
    public class RolePermissionDeleteRequest
    {
        public int RolePermissionId { get; set; }
        public int UserId { get; set; }
    }
   
}
