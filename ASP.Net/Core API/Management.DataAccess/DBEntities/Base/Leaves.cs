using DitsPortal.DataAccess.Base.DBEntities;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DitsPortal.DataAccess.DBEntities.Base
{
  public  class Leaves: BaseEntity
    {
        [Key]
        public int LeaveId { get; set; }
        [Column(TypeName = "int")]
        public int EmployeeId { get; set; }

        [Column(TypeName = "int")]
        public int LeaveType { get; set; }
        [Column(TypeName = "Datetime")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "Datetime")]
        public DateTime EndDate { get; set; }

        [Column(TypeName = "Double")]
        public Double NumberOfDays { get; set; }

        [Column(TypeName = "int")]
        public int PendingLeaves { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string Reason { get; set; }

        [Column(TypeName = "Datetime")]
        public DateTime? AppliedDate { get; set; }

        [Column(TypeName = "int")]
        public int RequestStatus { get; set; }

        [Column(TypeName = "Datetime")]
        public DateTime? RejectionDate { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string RejectionReason { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string RejectedBy { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string FromSession { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string ToSession { get; set; }
        [Column(TypeName = "int")]
        public int Duration { get; set; }
    }
}
