using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Responses
{
  public  class ScreenResponse
    {
        public int ScreensId { get; set; }
        public string ScreensName { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
