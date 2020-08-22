using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DitsPortal.DataAccess.Base.DBEntities
{
    public class BaseEntity
    {
        [DefaultValue("1")]
        public bool IsActive { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string CreatedBy { get; set; }

        [DefaultValue("GETDATE()")]
        [Column(TypeName = "Datetime")]
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        [Column(TypeName = "varchar(50)")]
        public string ModifiedBy { get; set; }

        [Column(TypeName = "Datetime")]
        public DateTime? ModifiedOn { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string DeletedBy { get; set; }

        [Column(TypeName = "Datetime")]
        public DateTime? DeletedOn { get; set; }

        [DefaultValue("0")]
        public bool IsDeleted { get; set; }

        
    }
}
