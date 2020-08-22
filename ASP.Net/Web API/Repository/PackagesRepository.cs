using FacePinPoint.Entities.Common;
using FacePinPoint.Entities.Response;
using FacePinPoint.Repository.IRepository;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace FacePinPoint.Repository.Repository
{
    public class PackagesRepository: IPackagesRepository
    {
        #region Private 

        private PackagesFeacturesDetailsResponse packagesFeacturesDetailsResponse = null;
        private PackageDetailListResponse packageDetailListResponse = null;

        #endregion

        #region Public Function

        public async Task<PackagesFeacturesDetailsResponse> GetAllPackagesWithFeatures()
        {
            try
            {
                packagesFeacturesDetailsResponse = new PackagesFeacturesDetailsResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    var objectContext = ((IObjectContextAdapter)db).ObjectContext;
                    var command = db.Database.Connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = "SELECT * FROM public.\"view_Package_PackageFeatures\";";
                    db.Database.Connection.Open();
                    using (var reader = await command.ExecuteReaderAsync())
                    {

                        var packagesFeacturesDetailsList = ((IObjectContextAdapter)db).ObjectContext.Translate<string>(reader).ToList();
                        List<PackageFeatureDetail> packageFeatureDetailList = new List<PackageFeatureDetail>();
                        foreach (var packagesFeacturesDetail in packagesFeacturesDetailsList)
                        {

                            packageFeatureDetailList.Add(Newtonsoft.Json.JsonConvert.DeserializeObject<PackageFeatureDetail>(packagesFeacturesDetail));
                        }
                        packagesFeacturesDetailsResponse.PackagesFeacturesDetails = packageFeatureDetailList;
                    }   
                }
                
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                packagesFeacturesDetailsResponse.Success = false;
                packagesFeacturesDetailsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return packagesFeacturesDetailsResponse;
        }

        public async Task<PackageDetailListResponse> GetAllPackages()
        {
            try
            {
                packageDetailListResponse = new PackageDetailListResponse();

                using (FacepinpointDBEntities db = new FacepinpointDBEntities())
                {
                    packageDetailListResponse.PackageDetailList = await db.Packages.Where(x => x.Type == "FR").Select(x => new PackageDetail { Name = x.Name, PackageId = x.PackageId, Price = x.Price, SearchAllowed = x.SearchAllowed }).OrderBy(x => x.PackageId).ToListAsync();
                }

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                packageDetailListResponse.Success = false;
                packagesFeacturesDetailsResponse.Message = CustomErrorMessages.INTERNAL_ERROR;
            }
            return packageDetailListResponse;
        }


        #endregion

    }
}
