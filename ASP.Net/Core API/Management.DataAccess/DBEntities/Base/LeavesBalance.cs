using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DitsPortal.DataAccess.DBEntities.Base
{
  public  class LeavesBalance: BaseEntity
    {
        [Key]
        public int LeaveBalanceId { get; set; }
        [Column(TypeName = "int")]
        public int EmployeeId { get; set; }
        [Column(TypeName = "Double")]
        public Double Balance { get; set; }
        [Column(TypeName = "Double")]
        public Double Availed { get; set; }    
    }
}
