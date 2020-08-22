using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Responses
{
   public class RolePermissionResponse
    {
        public int rolePermissionId { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public int ScreenId { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
    
}
