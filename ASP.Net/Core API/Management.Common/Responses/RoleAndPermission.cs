using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Responses
{
   public class UserRoles
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
        public List<UserScreens> userScreens { get; set; }
    }

    public class UserScreens
    {
        public int ScreensId { get; set; }
        public string ScreensName { get; set; }
        public string ScreensDescription { get; set; }
        public List <UserPermission> userPermission{get;set;}
    }
    public class UserPermission
    {
        public int PermissionId { get; set; }
        public string PermissionName { get; set; }
        public string PermissionDescription { get; set; }
    }
}
