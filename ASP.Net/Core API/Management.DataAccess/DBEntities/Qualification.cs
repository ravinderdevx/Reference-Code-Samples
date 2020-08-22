using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
namespace DitsPortal.DataAccess.DBEntities
{
  public  class Qualifications: BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int QualificationId { get; set; }
        public int UserID { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string UniversitySchool { get; set; }
        [Column(TypeName = "decimal(16,3)")]
        public decimal Percentage { get; set; }
        [Column(TypeName = "Datetime")]
        public DateTime PassingYear { get; set; }
    }
}
