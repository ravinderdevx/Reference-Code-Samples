using DitsPortal.DataAccess.Base.DBEntities;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DitsPortal.DataAccess.DBEntities.Base
{
   public class Roles: BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]   
        public int RoleId { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string  RoleName { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Description { get; set; }
    }
}
