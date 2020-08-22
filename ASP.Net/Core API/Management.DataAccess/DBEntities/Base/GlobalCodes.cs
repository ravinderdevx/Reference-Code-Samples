using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DitsPortal.DataAccess.Base.DBEntities;

namespace DitsPortal.DataAccess.DBEntities
{
 public class GlobalCodes : BaseEntity
    {
        [Key]
        public int GlobalCodeId { get; set; }

        [Column(TypeName = "int")]
        public int GlobalCodeCategoryId { get; set; }

        [Column(TypeName = "varchar(250)")]
        public string CodeName { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string Description { get; set; }

    }
}
