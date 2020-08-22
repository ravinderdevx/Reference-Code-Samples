using FacePinPoint.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FacePinPoint.Entities.Response;
using FacePinPoint.Entities.Request;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using FacePinPoint.Entities.Common;

namespace FacePinPoint.Repository.Repository
{
    public class CommonRepository : ICommonRepository
    {
        #region Private Function

        private BaseResponse baseResponse = null;
        private TemplateResponse templateResponse = null;
        private SubscribeEmailExistsResponse subscribeEmailExistsResponse = null;
        private MailContent mailContent = null;
        private CouponResponse couponResponse;

        #endregion


        #region Public Function

        public async Task<BaseResponse> SaveSubscribe(EmailSubscriptionRequest emailSubscriptionRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                var subscribeEmailExistsResponse = await SubscribeEmailExists(emailSubscriptionRequest.Email);
                if (!subscribeEmailExistsResponse.IsEmailExists)
                {
                    using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                    {
                        Subscription subscription = new Subscription();
                        subscription.Email = emailSubscriptionRequest.Email;
                        subscription.SubscriptionDate = DateTime.Now;
                        subscription.Active = "Y";
                        db.Subscriptions.Add(subscription);
                        await db.SaveChangesAsync();

                        //var templateResponse = db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"Template\", \"Active\" FROM public.\"EmailTemplates\" where \"TemplateName\"= 'Subscription';").FirstOrDefault();
                        //var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Active = x.Active, Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "Subscription").FirstOrDefaultAsync();
                        var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_GetUserEmail\"('Subscription','" + emailSubscriptionRequest.Email + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='Subscription'").FirstOrDefaultAsync();

                        mailContent = new MailContent();
                        mailContent.ToEmail = emailSubscriptionRequest.Email;
                        mailContent.MsgSubject = templateResponse.Subject;
                        mailContent.MsgBody = templateResponse.Template;

                        // Email sender
                        EmailSender.MailSender(mailContent);
                    }
                }
                else
                {
                    baseResponse.Success = false;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }

        public async Task<BaseResponse> SaveFeedback(FeedbackRequest feedbackRequest)
        {
            try
            {
                baseResponse = new BaseResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {

                    Feedback feedback = new FacePinPoint.Repository.Feedback();
                    feedback.Email = feedbackRequest.Email;
                    feedback.Message = feedbackRequest.Message;
                    feedback.CreatedDate = DateTime.Now;
                    db.Feedbacks.Add(feedback);
                    await db.SaveChangesAsync();

                    //var templateResponse = db.Database.SqlQuery<TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"Template\", \"Active\" FROM public.\"EmailTemplates\" where \"TemplateName\"= 'Subscription';").FirstOrDefault();
                    // var templateResponse = await db.EmailTemplates.Select(x => new TemplateDetail { Active = x.Active, Subject = x.Subject, Template = x.Template, TemplateId = x.TemplateId, TemplateName = x.TemplateName }).Where(x => x.TemplateName == "FeedBack").FirstOrDefaultAsync();
                    var templateResponse = await db.Database.SqlQuery<FacePinPoint.Entities.Response.TemplateDetail>("SELECT \"TemplateId\", \"TemplateName\", \"Subject\", \"public\".\"fn_GetUserEmail\"('FeedBack','" + feedbackRequest.Email + "') AS \"Template\", \"Active\" from \"public\".\"EmailTemplates\" where \"TemplateName\"='FeedBack'").FirstOrDefaultAsync();
                    mailContent = new MailContent();
                    mailContent.ToEmail = feedbackRequest.Email;
                    mailContent.MsgSubject = templateResponse.Subject;
                    mailContent.MsgBody = templateResponse.Template;

                    // Email sender
                    EmailSender.MailSender(mailContent);
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                baseResponse.Success = false;
                baseResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return baseResponse;
        }
        
        public async Task<SubscribeEmailExistsResponse> SubscribeEmailExists(string email)
        {
            try
            {
                subscribeEmailExistsResponse = new SubscribeEmailExistsResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    subscribeEmailExistsResponse.IsEmailExists = await db.Subscriptions.Where(x => x.Email == email).AnyAsync();
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                subscribeEmailExistsResponse.Success = false;
                subscribeEmailExistsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return subscribeEmailExistsResponse;
        }

        public async Task<TemplateResponse> GetTemplate(TemplateRequest templateRequest)
        {
            try
            {
                templateResponse = new TemplateResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT public.\"fn_getEmailTemplate\"('" + templateRequest.TName + "'," + templateRequest.UserId + " , '" + templateRequest.UserEmail + "')";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var result = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).ToList();
                        templateResponse.emailTemplate = result.FirstOrDefault();
                    }
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                templateResponse.Success = false;
                templateResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return templateResponse;
        }

        public async Task<CouponResponse> GetCouponDiscount(CouponRequest couponRequest)
        {
            try
            {
                couponResponse = new CouponResponse();
                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var SearchResultsJson = await db.Database.SqlQuery<JsonRespone>("select \"public\".\"fn_get_coupon_detail\"('" + couponRequest.UserEmail + "', '" + couponRequest.CouponCode + "')as \"json\"").FirstOrDefaultAsync();
                    CoupanDetails couponDetail = Newtonsoft.Json.JsonConvert.DeserializeObject<CoupanDetails>(SearchResultsJson.json);
                    if (couponDetail != null)
                    {

                        if (couponDetail.CouponDetails.Discount > 0)
                        {
                            var totalDiscount = (couponRequest.TotalAmount * couponDetail.CouponDetails.Discount) / 100;
                            if (totalDiscount > couponDetail.CouponDetails.MaxDiscount)
                            {
                                couponResponse.DiscountPrice = (float)couponDetail.CouponDetails.MaxDiscount;
                            }
                            else
                            {
                                couponResponse.DiscountPrice = (float)totalDiscount;
                            }
                        }
                        else
                        {
                            couponResponse.DiscountPrice = (float)couponDetail.CouponDetails.MaxDiscount;
                        }

                    }
                    else
                    {
                        couponResponse.Message = "Coupon not valid";
                        couponResponse.Success = false;
                    }
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                couponResponse.Success = false;
                couponResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return couponResponse;
        }


        //select "public"."fn_getDMCAStatusStats"() as "DMCAStatus","public"."fn_getDMCALegalActionStats"() as "DMCALegalAction"
        
        public Account jsontest(string json)
        {
            Account account = new Account();
            try
            {
                account = Newtonsoft.Json.JsonConvert.DeserializeObject<Account>(json);

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return account;
        }

        #endregion
    }
}
