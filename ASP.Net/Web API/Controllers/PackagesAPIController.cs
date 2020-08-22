using FacePinPoint.Entities.Common;
using FacePinPoint.Service.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace FacePinPoint.Controllers
{
    [RoutePrefix("PackagesAPI")]
    public class PackagesAPIController : ApiController
    {

        #region Private

        private IPackagesService _IPackagesService = null;
        private System.Net.Http.HttpResponseMessage httpResponseMessage = null;

        #endregion

        public PackagesAPIController(IPackagesService IPackagesService)
        {
            _IPackagesService = IPackagesService;
        }

        #region Public Function

        [HttpGet]
        [Route("GetAllPackagesWithFeatures")]
        [ActionName("GetAllPackagesWithFeatures")]
        public async Task<HttpResponseMessage> GetAllPackagesWithFeatures()
        {
            httpResponseMessage = new HttpResponseMessage();
            var response = await _IPackagesService.GetAllPackagesWithFeatures();
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, response );
            return httpResponseMessage;
        }

        [HttpGet]
        [Route("GetAllPackages")]
        [ActionName("GetAllPackages")]
        public async Task<HttpResponseMessage> GetAllPackages()
        {
            httpResponseMessage = new HttpResponseMessage();
            var response = await _IPackagesService.GetAllPackages();
            response.Message = CustomErrorMessages.INTERNAL_ERROR;
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK,  response  );
            return httpResponseMessage;
        }

        #endregion

    }
}
