using System;
using System.Collections.Generic;
using System.Text;

namespace DitsPortal.Common.StaticResources
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public string Timeout { get; set; }
        public Smtp smtp { get; set; }
        public string Admin { get; set; }
    }

    public class Smtp
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
