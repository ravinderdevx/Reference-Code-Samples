using FacePinPoint.Entities.Common;
using FacePinPoint.Entities.Request;
using FacePinPoint.Entities.Response;
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
    [RoutePrefix("CommonAPI")]
    public class CommonAPIController : ApiController
    {

        #region Private

        private ICommonService _ICommonService = null;
        private System.Net.Http.HttpResponseMessage httpResponseMessage = null;

        #endregion

        public CommonAPIController(ICommonService ICommonService)
        {
            _ICommonService = ICommonService;
        }

        #region Public Function

        [HttpPost]
        [Route("SaveSubscribe")]
        public async Task<HttpResponseMessage> SaveSubscribe(EmailSubscriptionRequest emailSubscriptionRequest)
        {
            httpResponseMessage = new HttpResponseMessage();

            if (emailSubscriptionRequest != null && ModelState.IsValid)
            {
                var response = await _ICommonService.SaveSubscribe(emailSubscriptionRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, response);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("SaveFeedback")]
        public async Task<HttpResponseMessage> SaveFeedback(FeedbackRequest feedbackRequest)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (feedbackRequest != null && ModelState.IsValid)
            {
                var feedback = await _ICommonService.SaveFeedback(feedbackRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, feedback);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }



        [HttpGet]
        [Route("IsSubscribeEmailExists")]
        [ActionName("IsSubscribeEmailExists")]
        public async Task<bool> IsEmailExists(string email)
        {
            httpResponseMessage = new HttpResponseMessage();
            if (email != null)
            {
                var emailexistsResponse = await _ICommonService.SubscribeEmailExists(email);
                if (emailexistsResponse.Success)
                {
                    return emailexistsResponse.IsEmailExists;
                }
            }
            return false;
        }


        [HttpPost]
        [Route("GetTemplate")]
        [ActionName("GetTemplate")]
        public async Task<HttpResponseMessage> GetTemplate(TemplateRequest templateRequest)
        {
            httpResponseMessage = new HttpResponseMessage();

            if (templateRequest != null && ModelState.IsValid)
            {
                var template = await _ICommonService.GetTemplate(templateRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK,  template );
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpPost]
        [Route("GetCouponDiscount")]
        [ActionName("GetCouponDiscount")]
        public async Task<HttpResponseMessage> GetCouponDiscount(CouponRequest couponRequest)
        {
            httpResponseMessage = new HttpResponseMessage();

            if (couponRequest != null && ModelState.IsValid)
            {
                var couponDiscountResponse = await _ICommonService.GetCouponDiscount(couponRequest);
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, couponDiscountResponse);
            }
            else
            {
                httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, new { Message = CustomErrorMessages.INVALID_INPUTS, Success = false });
            }

            return httpResponseMessage;
        }

        [HttpGet]
        [Route("jsontest")]
        [ActionName("jsontest")]
        public Account jsontest()
        {
            string json = "{'Email': 'james@example.com','Active': true,'CreatedDate': '2013-01-20T00:00:00Z','Roles': ['User','Admin']}";

            return _ICommonService.jsontest(json);
        }

        

        #endregion

    }
}
