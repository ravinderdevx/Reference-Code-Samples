using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Requests
{
   public class RoleRequest
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
    public class RoleByIdRequest
    {
        public int RoleId { get; set; }
    }
    public class RoleDeleteRequest
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
    }
    public class RecordFilterRequest
    {
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string OrderBy { get; set; } = "CreatedOn";
        public bool OrderByDescending { get; set; } = true;
        public bool AllRecords { get; set; } = false;

    }
}
