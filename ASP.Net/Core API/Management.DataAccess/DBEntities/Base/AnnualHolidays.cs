using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DitsPortal.DataAccess.DBEntities.Base
{
 public    class AnnualHolidays
    {
        [Key]
        public int AnnualHolidayId { get; set; }
        [Column(TypeName = "int")]
        public int CalenderHolidays { get; set; }

        [Column(TypeName = "int")]
        public int MonthlyHolidays { get; set; }
    }
}
