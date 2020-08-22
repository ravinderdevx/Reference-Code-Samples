using FacePinPoint.Entities.Response;
using FacePinPoint.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacePinPoint.Repository.Repository
{
    public class UserRepository: IUserRepository
    {
        private FacepinpointDBEntities facepinpointDBEntities;
       

        #region UserRepository

        public void test()
        {
            try
            {
                
                using (facepinpointDBEntities = new FacepinpointDBEntities())
                {
                    var a = facepinpointDBEntities.system_user.FirstOrDefault();
                }
            }
            catch(Exception ex)
            {
            }
        }


        #endregion

    }
}
