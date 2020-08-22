using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.Responses
{
    public class UserResponse
    {
        public string token { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }       
        public DateTime? DateOfBirth { get; set; }
        public List <UserRoles> Roles { get; set; }
        
    }
}

