using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DitsPortal.DataAccess.DBEntities.Base
{
   public class GlobalCodeCategories: BaseEntity
    {
        [Key]
        public int GlobalCodeCategoryId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string CategoryName { get; set; }
        [Column(TypeName = "varchar(1000)")]
        public string Description { get; set; }
    }
}
