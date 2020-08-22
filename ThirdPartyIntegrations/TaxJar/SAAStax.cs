using System;
using TaxJar;
public class SAASTax
{
	   public async Task<TaxResponse> GetTax(TaxJarRequest taxJarRequest)
        {
            try
            {
                taxResponse = new TaxResponse();
                using (FaceDBEntities db = new FaceDBEntities())
                {
                    var client = new TaxjarApi(ApplicationConfiguration.TAX_JAR_ACCESS_KEY);


                    if (!string.IsNullOrEmpty(taxJarRequest.UserEmail))
                    {
                        var systemUser = await db.system_user.Where(x => x.email == taxJarRequest.UserEmail && x.Blocked == "N").FirstOrDefaultAsync();
                        if (systemUser.id > 0)
                        {
                            //var rates = client.RatesForLocation(systemUser.ZipCode.ToString(), new { });
                            var tax = client.TaxForOrder(new
                            {
                                from_zip = systemUser.ZipCode.ToString()
                            });
                            taxResponse.combined_rate = tax.Rate;
                        }
                        else
                        {
                            taxResponse.Success = false;
                            taxResponse.Message = CustomErrorMessages.INVALID_EMAIL;
                        }
                    }
                    else
                    {
                        taxResponse.Success = false;
                        taxResponse.Message = CustomErrorMessages.INVALID_INPUTS;
                    }
                    taxResponse.Success = true;
                    taxResponse.Message = null;
                }
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                taxResponse.Success = false;
                taxResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return taxResponse;
        }

}
