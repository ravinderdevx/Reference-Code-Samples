using FacePinPoint.Entities.Request;
using FacePinPoint.Entities.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacePinPoint.Repository.IRepository
{
    public interface ICommonRepository
    {
        Task<BaseResponse> SaveSubscribe(EmailSubscriptionRequest emailSubscriptionRequest);


        Task<BaseResponse> SaveFeedback(FeedbackRequest feedbackRequest);

        Task<SubscribeEmailExistsResponse> SubscribeEmailExists(string email);

        Task<TemplateResponse> GetTemplate(TemplateRequest templateRequest);

        Task<CouponResponse> GetCouponDiscount(CouponRequest couponRequest);
        Account jsontest(string json);
    }
}
