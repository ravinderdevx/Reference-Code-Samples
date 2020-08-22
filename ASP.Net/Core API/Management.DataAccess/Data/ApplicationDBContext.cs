using System;
using System.Collections.Generic;
using System.Text;
using DitsPortal.Common.Responses;
using DitsPortal.DataAccess.DBEntities;
using DitsPortal.DataAccess.DBEntities.Base;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Data.SqlTypes;
namespace DitsPortal.DataAccess.Data
{

    public class ApplicationDBContext: DbContext
    {

        public ApplicationDBContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<GlobalCodes> GlobalCodes { get; set; }
        public DbSet<GlobalCodeCategories> GlobalCodeCategories { get; set; }
        public DbSet<AnnualHolidays> AnnualHoliday { get; set; }
        public DbSet<Leaves> Leave { get; set; }
        public DbSet<LeavesBalance> LeavesBalance { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Permissions> Permissions { get; set; }
        public DbSet<Screens> Screens { get; set; }
        public DbSet<RolePermissions> RolePermissions { get; set; }
        public DbSet<ErrorLog> ErrorLog { get; set; }
        public DbSet<Skills> Skills { get; set; }
        public DbSet<Projects> Projects { get; set; }
        public DbSet<EmployeeHistories> EmployeeHistories { get; set; }
        public DbSet<Qualifications> Qualifications { get; set; }


    }
}
