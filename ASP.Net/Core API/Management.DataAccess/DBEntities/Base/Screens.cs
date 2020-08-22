using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DitsPortal.DataAccess.DBEntities.Base
{
    public class Screens: BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ScreensId { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string ScreensName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Description { get; set; }
    }
}
