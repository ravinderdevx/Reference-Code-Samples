
using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DitsPortal.DataAccess
{
    public class Template : Base.DBEntities.BaseEntity
    {
        [Key]
        public int TemplateId { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string AttributeName { get; set; }

        [Column(TypeName = "int")]
        public int? AttributeType { get; set; }

        [Column(TypeName = "int")]
        public int? AttributeDataType { get; set; }

        [Column(TypeName = "int")]
        public int? AttributeFormat { get; set; }

    }
}
