using FacePinPoint.Entities.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacePinPoint.Repository.IRepository
{
    public interface IPackagesRepository
    {
        Task<PackagesFeacturesDetailsResponse> GetAllPackagesWithFeatures();
        Task<PackageDetailListResponse> GetAllPackages();
    }
}
