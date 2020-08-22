using System;
using System.Collections.Generic;
using System.Text;
//using DitsPortal.DataAccess.Base.DBEntities
namespace DitsPortal.Common.Responses
{
   public class RoleResponse
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }

}
