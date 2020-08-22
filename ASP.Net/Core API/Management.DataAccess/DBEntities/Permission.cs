using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DitsPortal.DataAccess.DBEntities.Base
{
   public class Permissions: BaseEntity
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int PermissionId { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string PermissionName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Description { get; set; }
    }
}
