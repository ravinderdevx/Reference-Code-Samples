using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Requests
{
   public class ScreenRequest
    {
        public int ScreensId { get; set; }
        public string ScreensName { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public bool IsActive { get; set; }

    }
    public class ScreenDeleteRequest
    {
        public int ScreensId { get; set; }
        public int ActionBy { get; set; }
    }
    public class ScreenIdRequest
    {
        public int ScreensId { get; set; }
    }
   
}
