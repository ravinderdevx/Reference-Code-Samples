using ElectronicHealthRecord.CoreEntites.DBConnection;
using ElectronicHealthRecord.CoreEntites.Model;
using ElectronicHealthRecord.RepositoryLayer.AccountRepository.Repository;
using ElectronicHealthRecord.RepositoryLayer.DoctorRepository.Interface;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicHealthRecord.RepositoryLayer.DoctorRepository.Repository
{
    public class ClientSummaryMangementRepository : IClientSummaryMangementRepositoryInterface
    {
        #region Global variable 
        
        private ElectronicHealthRecordDBContext _db = null;
        private EmergencyContact _emergencyContact = null;
        private Client _client = null;
        private ClientInsuranceDetail _clientInsuranceDetail = null;
        private ClientFamilyHealthDetail _clientFamilyHealthDetail = null;
        private ClientVitalSignDetail _clientVitalSignDetail = null;
        private ClientAllergyInformationDetail _clientAllergyInformationDetail = null;
        private ClientSocialInformationDetail _clientSocialInformationDetail = null;
        private FileDetail _fileDetail = null;
        private ClientVaccineDetail _clientVaccineDetail = null;
        private ClientPrescriptionDetail _clientPrescriptionDetail = null;
        private ClientProgressNote _clientProgressNote = null;
        private ClientPaymentDetail _clientPaymentDetail = null;
        private ClientBillingDetail _clientBillingDetail = null;

        #endregion

        #region Public Function
        /// <summary>
        /// This function return detail of particular client by its id.
        /// </summary>
        /// <param name="cID"></param>
        /// <returns></returns>
        public RetrieveClientDetail clientDetailByClientID(int cID)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from C in _db.Clients
                            where C.IsDeleted == false && C.ClientID == cID
                            select new RetrieveClientDetail
                            {
                                CID = C.ClientID,
                                FName = C.FirstName,
                                LName = C.LastName,
                                Email = C.Email,
                                DOB = C.DateOfBirth,
                                Ph = C.Phone,
                                SSN = C.SocialSecurityNumber
                            });
                return data.FirstOrDefault();
            }
        }
        public void UpdateRegisterClient(RegisterClientModel _registerClientModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _client = new Client();
                _client = _db.Clients.Where(x => x.IsDeleted == false && x.ClientID == _registerClientModel.ClientID).FirstOrDefault();
                if (_client != null)
                {
                    _client.FirstName = _registerClientModel.FirstName;
                    _client.LastName = _registerClientModel.LastName;
                    _client.SocialSecurityNumber = _registerClientModel.SSN;
                    _client.DateOfBirth = _registerClientModel.DateOfBirth;
                    _client.Email = _registerClientModel.Email;
                    _client.Phone = _registerClientModel.Phone;
                    _client.ModifyBy = "Admin";
                    _client.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        #region EmergencyContact
        public void SaveEmergencyContact(EmergencyContactModel _emergencyContactModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _emergencyContact = new EmergencyContact();
                _emergencyContact.FirstName = _emergencyContactModel.FirstName;
                _emergencyContact.LastName = _emergencyContactModel.LastName;
                _emergencyContact.Email = _emergencyContactModel.Email;
                _emergencyContact.ClientID = _emergencyContactModel.ClientID;
                _emergencyContact.Phone = _emergencyContactModel.Phone;
                _emergencyContact.RelationShipID = _emergencyContactModel.RelationShipID;
                _emergencyContact.CreatedBy = "Admin";
                _emergencyContact.CreatedDateTime = DateTime.Now;

                _db.EmergencyContacts.Add(_emergencyContact);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }

        }
        public bool IsEmergencyContactExistWithSameEmail(string Email)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                int isExist = _db.EmergencyContacts.Where(x => x.Email == Email).Select(x => x.EmergencyContactID).Count();
                if (isExist > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public List<EmergencyContactListModel> GetAllEmergencyContact(int limit, int page, string orderby, EmergencyContactSearch _emergencyContactSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from EC in _db.EmergencyContacts
                            join RS in _db.RelationShips on EC.RelationShipID equals RS.RelationShipID
                            where EC.IsDeleted == false && EC.ClientID == _emergencyContactSearch.ClientID
                            select new EmergencyContactListModel
                            {
                                ECID = EC.EmergencyContactID,
                                FirstName = EC.FirstName,
                                LastName = EC.LastName,
                                Email = EC.Email,
                                Phone = EC.Phone,
                                RelationShip = RS.RelationShipName,
                                RelationShipID = RS.RelationShipID
                            });
                //sort data
                switch (orderby)
                {
                    case "+FirstName":
                        data = data.OrderBy(x => x.FirstName);
                        break;
                    case "-FirstName":
                        data = data.OrderByDescending(x => x.FirstName);
                        break;
                    case "+LastName":
                        data = data.OrderBy(x => x.LastName);
                        break;
                    case "-LastName":
                        data = data.OrderByDescending(x => x.LastName);
                        break;
                    case "+Email":
                        data = data.OrderBy(x => x.Email);
                        break;
                    case "-Email":
                        data = data.OrderByDescending(x => x.Email);
                        break;
                    case "+RelationShip":
                        data = data.OrderBy(x => x.RelationShip);
                        break;
                    case "-RelationShip":
                        data = data.OrderByDescending(x => x.RelationShip);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.ECID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }

        public void UpdateEmergencyContact(EmergencyContactEditModel _emergencyContactEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _emergencyContact = new EmergencyContact();
                _emergencyContact = _db.EmergencyContacts.Where(x => x.IsDeleted == false && x.EmergencyContactID == _emergencyContactEditModel.ECID).FirstOrDefault();
                if (_emergencyContact != null)
                {
                    _emergencyContact.FirstName = _emergencyContactEditModel.FirstName;
                    _emergencyContact.LastName = _emergencyContactEditModel.LastName;
                    _emergencyContact.Email = _emergencyContactEditModel.Email;
                    _emergencyContact.Phone = _emergencyContactEditModel.Phone;
                    _emergencyContact.RelationShipID = _emergencyContactEditModel.RelationShipID;
                    _emergencyContact.ModifyBy = "Admin";
                    _emergencyContact.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteEmergencyContact(EmergencyContactIDModel _emergencyContactIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _emergencyContact = new EmergencyContact();
                _emergencyContact = (from EC in _db.EmergencyContacts
                                     join C in _db.Clients on EC.ClientID equals C.ClientID
                                     where EC.IsDeleted == false && EC.EmergencyContactID == _emergencyContactIDModel.ECID
                                     select EC).FirstOrDefault();
                if (_emergencyContact != null)
                {
                    _emergencyContact.IsDeleted = true;
                    _emergencyContact.DeletedBy = "Admin";
                    _emergencyContact.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(5);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        #endregion
        
        #region DropDownList
        public List<ClientBloodGroupModel> GetAllBloodGroup()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from BG in _db.BloodGroups
                            where BG.IsDeleted == false
                            select new ClientBloodGroupModel
                            {
                                BloodGroupID = BG.BloodGroupID,
                                Name = BG.Name
                            });
                return data.ToList();
            }
        }
        public List<RelationshipModel> GetAllRelationShip()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from RS in _db.RelationShips
                            where RS.IsDeleted == false
                            select new RelationshipModel
                            {
                                RID = RS.RelationShipID,
                                RName = RS.RelationShipName
                            });
                return data.ToList();
            }
        }
        public List<CountryModel> GetAllCountries()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CO in _db.Countries
                            where CO.IsDeleted == false
                            select new CountryModel
                            {
                                CountriesID = CO.CountriesID,
                                Name = CO.Name
                            });
                return data.ToList();
            }
        }
        public List<StateModel> GetAllStatesBaseOnCountryID(CountryModel _countryModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from S in _db.States
                            where S.IsDeleted == false && S.CountriesID == _countryModel.CountriesID
                            select new StateModel
                            {
                                StatesID = S.StatesID,
                                Name = S.Name
                            });
                return data.ToList();
            }
        }
        public List<CityModel> GetAllCityBaseOnStateID(StateModel _stateModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from Ci in _db.Cities
                            where Ci.IsDeleted == false && Ci.StatesID == _stateModel.StatesID
                            select new CityModel
                            {
                                CitiesID = Ci.CitiesID,
                                Name = Ci.Name
                            });
                return data.ToList();
            }
        }
        public List<UserDetailModel> GetAllUserDetail()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from U in _db.UserDetails
                            where U.IsDeleted == false
                            select new UserDetailModel
                            {
                                UserID = U.UserID,
                                UserName = U.FirstName + " " + U.LastName
                            });
                return data.ToList();
            }
        }
        public List<PaymentTypeModel> GetAllPaymentType()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from P in _db.PaymentTypes
                            where P.IsDeleted == false
                            select new PaymentTypeModel
                            {
                                PTID = P.PaymentTypeID,
                                PTName = P.Name
                            });
                return data.ToList();
            }
        }
        #endregion

        #region ClientContact
        public void SaveClientContact(ClientContactModel _clientContactModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _client = new Client();
                _client = _db.Clients.Where(x => x.IsDeleted == false && x.ClientID == _clientContactModel.ClientID).FirstOrDefault();
                if (_client != null)
                {
                    _client.Address = _clientContactModel.Address;
                    _client.CountriesID = _clientContactModel.CountriesID;
                    _client.StatesID = _clientContactModel.StatesID;
                    _client.CitiesID = _clientContactModel.CitiesID;
                    _client.ZipCode = _clientContactModel.ZipCode;
                    _client.ModifyBy = "Admin";
                    _client.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }
        public ClientContactDetialModel GetClientContactDetial(ClientIDModel _clientIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from C in _db.Clients
                            join Co in _db.Countries on C.CountriesID equals Co.CountriesID
                            join S in _db.States on C.StatesID equals S.StatesID
                            join Ci in _db.Cities on C.CitiesID equals Ci.CitiesID
                            where C.IsDeleted == false && C.ClientID == _clientIDModel.ClientID
                            select new ClientContactDetialModel
                            {
                                Address = C.Address,
                                CountriesID = C.CountriesID,
                                CountryName = Co.Name,
                                StatesID = C.StatesID,
                                StateName = S.Name,
                                CitiesID = C.CitiesID,
                                CityName = Ci.Name,
                                ZipCode = C.ZipCode
                            });
                return data.FirstOrDefault();
            }
        }
        #endregion

        #region ClientPersonalDetail
        public void SaveClientPersonalDetail(ClientPersonalModel _clientPersonalModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _client = new Client();
                _client = _db.Clients.Where(x => x.IsDeleted == false && x.ClientID == _clientPersonalModel.ClientID).FirstOrDefault();
                if (_client != null)
                {
                    _client.Gender = _clientPersonalModel.Gender;
                    _client.MaritalStatus = _clientPersonalModel.MaritalStatus;
                    _client.BloodGroupID = _clientPersonalModel.BloodGroupID;
                    _client.ModifyBy = "Admin";
                    _client.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public ClientPersonalDetailModel GetClientPersonalDetail(ClientIDModel _clientIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from C in _db.Clients
                            join B in _db.BloodGroups on C.BloodGroupID equals B.BloodGroupID
                            where C.IsDeleted == false && C.ClientID == _clientIDModel.ClientID
                            select new ClientPersonalDetailModel
                            {
                               Gender=C.Gender,
                               MaritalStatus=C.MaritalStatus,
                               BloodGroupID=C.BloodGroupID,
                               BloodGroupName=B.Name                               
                            });
                return data.FirstOrDefault();
            }
        }
        #endregion

        #region ClientInsuranceDetail
        public List<ClientInsuranceListModel> GetAllClientInsuranceDetail(int limit, int page, string orderby, ClientInsuranceDetailSearch _clientInsuranceDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CI in _db.ClientInsuranceDetails
                            join RS in _db.RelationShips on CI.RelationShipID equals RS.RelationShipID
                            where CI.IsDeleted == false && CI.ClientID == _clientInsuranceDetailSearch.ClientID
                            select new ClientInsuranceListModel
                            {
                                CInDID = CI.ClientInsuranceDetailID,
                                ICN = CI.InsuranceCompanyName,
                                ExpireOn = CI.ExpireOn,
                                CHN = CI.CardHolderName,
                                CardNumber = CI.CardNumber,
                                RS = RS.RelationShipName,
                                RSID = RS.RelationShipID
                            });
                //sort data
                switch (orderby)
                {
                    case "+ICN":
                        data = data.OrderBy(x => x.ICN);
                        break;
                    case "-ICN":
                        data = data.OrderByDescending(x => x.ICN);
                        break;
                    case "+ExpireOn":
                        data = data.OrderBy(x => x.ExpireOn);
                        break;
                    case "-ExpireOn":
                        data = data.OrderByDescending(x => x.ExpireOn);
                        break;
                    case "+CHN":
                        data = data.OrderBy(x => x.CHN);
                        break;
                    case "-CHN":
                        data = data.OrderByDescending(x => x.CHN);
                        break;
                    case "+RS":
                        data = data.OrderBy(x => x.RS);
                        break;
                    case "-RS":
                        data = data.OrderByDescending(x => x.RS);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CInDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }

        public void SaveClientInsuranceDetail(ClientInsuranceModel _clientInsuranceModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientInsuranceDetail = new ClientInsuranceDetail();
                _clientInsuranceDetail.ClientID = _clientInsuranceModel.ClientID;
                _clientInsuranceDetail.CardHolderName = _clientInsuranceModel.CardHolderName;
                _clientInsuranceDetail.CardNumber = _clientInsuranceModel.CardNumber;
                _clientInsuranceDetail.InsuranceCompanyName = _clientInsuranceModel.InsuranceCompanyName;
                _clientInsuranceDetail.RelationShipID = _clientInsuranceModel.RelationShipID;
                _clientInsuranceDetail.ExpireOn = _clientInsuranceModel.ExpireOn;
                _clientInsuranceDetail.CreatedBy = "Admin";
                _clientInsuranceDetail.CreatedDateTime = DateTime.Now;

                _db.ClientInsuranceDetails.Add(_clientInsuranceDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientInsuranceDetail(ClientInsuranceEditModel _ClientInsuranceEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientInsuranceDetail = new ClientInsuranceDetail();
                _clientInsuranceDetail = _db.ClientInsuranceDetails.Where(x => x.IsDeleted == false && x.ClientInsuranceDetailID == _ClientInsuranceEditModel.CInDID).FirstOrDefault();
                if (_clientInsuranceDetail != null)
                {
                    _clientInsuranceDetail.CardHolderName = _ClientInsuranceEditModel.CardHolderName;
                    _clientInsuranceDetail.CardNumber = _ClientInsuranceEditModel.CardNumber;
                    _clientInsuranceDetail.InsuranceCompanyName = _ClientInsuranceEditModel.InsuranceCompanyName;
                    _clientInsuranceDetail.RelationShipID = _ClientInsuranceEditModel.RelationShipID;
                    _clientInsuranceDetail.ExpireOn = _ClientInsuranceEditModel.ExpireOn;
                    _clientInsuranceDetail.ModifyBy = "Admin";
                    _clientInsuranceDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientInsuranceDetail(ClientInsuranceDetailIDModel _clientInsuranceDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientInsuranceDetail = new ClientInsuranceDetail();
                _clientInsuranceDetail = _db.ClientInsuranceDetails.Where(x => x.IsDeleted == false && x.ClientInsuranceDetailID == _clientInsuranceDetailIDModel.CInDID).FirstOrDefault();
                if (_clientInsuranceDetail != null)
                {
                    _clientInsuranceDetail.IsDeleted = true;
                    _clientInsuranceDetail.DeletedBy = "Admin";
                    _clientInsuranceDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public bool IsClientInsuranceDetailExistWithSameCardNumber(IsCardNumbertModel _isCardNumbertModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                int isExist = _db.ClientInsuranceDetails.Where(x => x.CardNumber == _isCardNumbertModel.CardNumber).Select(x => x.ClientInsuranceDetailID).Count();
                if (isExist > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        #endregion

        #region ClientFamilyHealthDetail

        public List<ClientFamilyHealthDetailListModel> GetAllClientFamilyHealthDetail(int limit, int page, string orderby, ClientFamilyHealthDetailSearch _clientFamilyHealthDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CFHD in _db.ClientFamilyHealthDetails
                            join RS in _db.RelationShips on CFHD.RelationShipID equals RS.RelationShipID
                            where CFHD.IsDeleted == false && CFHD.ClientID == _clientFamilyHealthDetailSearch.ClientID
                            select new ClientFamilyHealthDetailListModel
                            {
                                FirstName = CFHD.FirstName,
                                LastName = CFHD.LastName,
                                CFHDID = CFHD.ClientFamilyHealthDetailID,
                                Diseases = CFHD.Diseases,
                                FromWhen = CFHD.FromWhen,
                                ToWhen = CFHD.ToWhen,
                                RS = RS.RelationShipName,
                                RSID = RS.RelationShipID
                            });
                //sort data
                switch (orderby)
                {
                    case "+Diseases":
                        data = data.OrderBy(x => x.Diseases);
                        break;
                    case "-Diseases":
                        data = data.OrderByDescending(x => x.Diseases);
                        break;
                    case "+FirstName":
                        data = data.OrderBy(x => x.FirstName);
                        break;
                    case "-FirstName":
                        data = data.OrderByDescending(x => x.FirstName);
                        break;
                    case "+LastName":
                        data = data.OrderBy(x => x.LastName);
                        break;
                    case "-LastName":
                        data = data.OrderByDescending(x => x.LastName);
                        break;
                    case "+RS":
                        data = data.OrderBy(x => x.RS);
                        break;
                    case "-RS":
                        data = data.OrderByDescending(x => x.RS);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CFHDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }

        public void SaveClientFamilyHealthDetail(ClientFamilyHealthDetailModel _clientFamilyHealthDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientFamilyHealthDetail = new ClientFamilyHealthDetail();
                _clientFamilyHealthDetail.ClientID = _clientFamilyHealthDetailModel.ClientID;
                _clientFamilyHealthDetail.FirstName = _clientFamilyHealthDetailModel.FirstName;
                _clientFamilyHealthDetail.LastName = _clientFamilyHealthDetailModel.LastName;
                _clientFamilyHealthDetail.RelationShipID = _clientFamilyHealthDetailModel.RelationShipID;
                _clientFamilyHealthDetail.Diseases = _clientFamilyHealthDetailModel.Diseases;
                _clientFamilyHealthDetail.FromWhen = _clientFamilyHealthDetailModel.FromWhen;
                _clientFamilyHealthDetail.ToWhen = _clientFamilyHealthDetailModel.ToWhen;                
                _clientFamilyHealthDetail.CreatedBy = "Admin";
                _clientFamilyHealthDetail.CreatedDateTime = DateTime.Now;

                _db.ClientFamilyHealthDetails.Add(_clientFamilyHealthDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientFamilyHealthDetail(ClientFamilyHealthDetailEditModel _clientFamilyHealthDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientFamilyHealthDetail = new ClientFamilyHealthDetail();
                _clientFamilyHealthDetail = _db.ClientFamilyHealthDetails.Where(x => x.IsDeleted == false && x.ClientFamilyHealthDetailID == _clientFamilyHealthDetailEditModel.CFHDID).FirstOrDefault();
                if (_clientFamilyHealthDetail != null)
                {
                    _clientFamilyHealthDetail.FirstName = _clientFamilyHealthDetailEditModel.FirstName;
                    _clientFamilyHealthDetail.LastName = _clientFamilyHealthDetailEditModel.LastName;
                    _clientFamilyHealthDetail.RelationShipID = _clientFamilyHealthDetailEditModel.RelationShipID;
                    _clientFamilyHealthDetail.Diseases = _clientFamilyHealthDetailEditModel.Diseases;
                    _clientFamilyHealthDetail.FromWhen = _clientFamilyHealthDetailEditModel.FromWhen;
                    _clientFamilyHealthDetail.ToWhen = _clientFamilyHealthDetailEditModel.ToWhen;
                    _clientFamilyHealthDetail.ModifyBy = "Admin";
                    _clientFamilyHealthDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientFamilyHealthDetail(ClientFamilyHealthDetailIDModel _clientFamilyHealthDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientFamilyHealthDetail = new ClientFamilyHealthDetail();
                _clientFamilyHealthDetail = _db.ClientFamilyHealthDetails.Where(x => x.IsDeleted == false && x.ClientFamilyHealthDetailID == _clientFamilyHealthDetailIDModel.CFHDID).FirstOrDefault();
                if (_clientFamilyHealthDetail != null)
                {
                    _clientFamilyHealthDetail.IsDeleted = true;
                    _clientFamilyHealthDetail.DeletedBy = "Admin";
                    _clientFamilyHealthDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        #endregion

        #region ClientVitalSignDetail
        public void SaveClientVitalSignDetail(ClientVitalSignDetailModel _clientVitalSignDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVitalSignDetail = new ClientVitalSignDetail();
                _clientVitalSignDetail.ClientID = _clientVitalSignDetailModel.ClientID;
                _clientVitalSignDetail.HeartPluseRate = _clientVitalSignDetailModel.HeartPluseRate;
                _clientVitalSignDetail.OxygenSaturation = _clientVitalSignDetailModel.OxygenSaturation;
                _clientVitalSignDetail.DiastolicBP = _clientVitalSignDetailModel.DiastolicBP;
                _clientVitalSignDetail.SystolicBP = _clientVitalSignDetailModel.SystolicBP;
                _clientVitalSignDetail.Glucose = _clientVitalSignDetailModel.Glucose;
                _clientVitalSignDetail.RespiratoryRate = _clientVitalSignDetailModel.RespiratoryRate;
                _clientVitalSignDetail.BodyMassIndex = _clientVitalSignDetailModel.BodyMassIndex;
                if (!string.IsNullOrEmpty(_clientVitalSignDetailModel.Height))
                {
                    _clientVitalSignDetail.Height = _clientVitalSignDetailModel.Height;
                    _clientVitalSignDetail.HeightMeasure = _clientVitalSignDetailModel.HeightMeasure;
                }
                if (!string.IsNullOrEmpty(_clientVitalSignDetailModel.Weight))
                {
                    _clientVitalSignDetail.Weight = _clientVitalSignDetailModel.Weight;
                    _clientVitalSignDetail.WeightMeasure = _clientVitalSignDetailModel.WeightMeasure;
                }
                if (!string.IsNullOrEmpty(_clientVitalSignDetailModel.Temperature))
                {
                    _clientVitalSignDetail.Temperature = _clientVitalSignDetailModel.Temperature;
                    _clientVitalSignDetail.TemperatureMeasure = _clientVitalSignDetailModel.TemperatureMeasure;
                }

                _clientVitalSignDetail.Temperature = _clientVitalSignDetailModel.Temperature;

                _clientVitalSignDetail.CreatedBy = "Admin";
                _clientVitalSignDetail.CreatedDateTime = DateTime.Now;

                _db.ClientVitalSignDetails.Add(_clientVitalSignDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }
        public void UpdateClientVitalSignDetail(ClientVitalSignDetailEditModel _clientVitalSignDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVitalSignDetail = new ClientVitalSignDetail();
                _clientVitalSignDetail = _db.ClientVitalSignDetails.Where(x => x.IsDeleted == false && x.ClientVitalSignDetailID == _clientVitalSignDetailEditModel.CVSDID).FirstOrDefault();
                if (_clientVitalSignDetail != null)
                {
                    _clientVitalSignDetail.HeartPluseRate = _clientVitalSignDetailEditModel.HeartPluseRate;
                    _clientVitalSignDetail.OxygenSaturation = _clientVitalSignDetailEditModel.OxygenSaturation;
                    _clientVitalSignDetail.DiastolicBP = _clientVitalSignDetailEditModel.DiastolicBP;
                    _clientVitalSignDetail.SystolicBP = _clientVitalSignDetailEditModel.SystolicBP;
                    _clientVitalSignDetail.Glucose = _clientVitalSignDetailEditModel.Glucose;
                    _clientVitalSignDetail.RespiratoryRate = _clientVitalSignDetailEditModel.RespiratoryRate;
                    _clientVitalSignDetail.BodyMassIndex = _clientVitalSignDetailEditModel.BodyMassIndex;
                    if (!string.IsNullOrEmpty(_clientVitalSignDetailEditModel.Height))
                    {
                        _clientVitalSignDetail.Height = _clientVitalSignDetailEditModel.Height;
                        _clientVitalSignDetail.HeightMeasure = _clientVitalSignDetailEditModel.HeightMeasure;
                    }
                    if (!string.IsNullOrEmpty(_clientVitalSignDetailEditModel.Weight))
                    {
                        _clientVitalSignDetail.Weight = _clientVitalSignDetailEditModel.Weight;
                        _clientVitalSignDetail.WeightMeasure = _clientVitalSignDetailEditModel.WeightMeasure;
                    }
                    if (!string.IsNullOrEmpty(_clientVitalSignDetailEditModel.Temperature))
                    {
                        _clientVitalSignDetail.Temperature = _clientVitalSignDetailEditModel.Temperature;
                        _clientVitalSignDetail.TemperatureMeasure = _clientVitalSignDetailEditModel.TemperatureMeasure;
                    }

                    _clientVitalSignDetail.Temperature = _clientVitalSignDetailEditModel.Temperature;

                    _clientVitalSignDetail.ModifyBy = "Admin";
                    _clientVitalSignDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }
        public bool DeleteClientVitalSignDetail(ClientVitalSignDetailIDModel _clientVitalSignDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVitalSignDetail = new ClientVitalSignDetail();
                _clientVitalSignDetail = _db.ClientVitalSignDetails.Where(x => x.IsDeleted == false && x.ClientVitalSignDetailID == _clientVitalSignDetailIDModel.CVSDID).FirstOrDefault();
                if (_clientVitalSignDetail != null)
                {
                    _clientVitalSignDetail.IsDeleted = true;
                    _clientVitalSignDetail.DeletedBy = "Admin";
                    _clientVitalSignDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientVitalSignDetailListModel> GetAllClientVitalSignDetail(int limit, int page, string orderby, ClientVitalSignDetailSearch _clientVitalSignDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CVSD in _db.ClientVitalSignDetails
                            where CVSD.IsDeleted == false && CVSD.ClientID == _clientVitalSignDetailSearch.ClientID
                            select new ClientVitalSignDetailListModel
                            {
                                CVSDID = CVSD.ClientVitalSignDetailID,
                                Weight = CVSD.Weight,
                                WeightMeasure = CVSD.WeightMeasure,
                                Height = CVSD.Height,
                                HeightMeasure = CVSD.HeightMeasure,
                                HeartPluseRate = CVSD.HeartPluseRate,
                                Temperature = CVSD.Temperature,
                                TemperatureMeasure = CVSD.TemperatureMeasure,
                                OxygenSaturation = CVSD.OxygenSaturation,
                                DiastolicBP = CVSD.DiastolicBP,
                                SystolicBP = CVSD.SystolicBP,
                                Glucose = CVSD.Glucose,
                                RespiratoryRate = CVSD.RespiratoryRate,
                                BodyMassIndex = CVSD.BodyMassIndex,
                                CDT = CVSD.CreatedDateTime
                            });
                //filter data
                if (_clientVitalSignDetailSearch.CDT != null)
                {
                    data = data.Where(x => DbFunctions.TruncateTime(x.CDT) == DbFunctions.TruncateTime(_clientVitalSignDetailSearch.CDT));
                }
                //sort data
                switch (orderby)
                {
                    case "+HeartPluseRate":
                        data = data.OrderBy(x => x.HeartPluseRate);
                        break;
                    case "-HeartPluseRate":
                        data = data.OrderByDescending(x => x.HeartPluseRate);
                        break;
                    case "+OxygenSaturation":
                        data = data.OrderBy(x => x.OxygenSaturation);
                        break;
                    case "-OxygenSaturation":
                        data = data.OrderByDescending(x => x.OxygenSaturation);
                        break;
                    case "+DiastolicBP":
                        data = data.OrderBy(x => x.DiastolicBP);
                        break;
                    case "-DiastolicBP":
                        data = data.OrderByDescending(x => x.DiastolicBP);
                        break;
                    case "+SystolicBP":
                        data = data.OrderBy(x => x.SystolicBP);
                        break;
                    case "-SystolicBP":
                        data = data.OrderByDescending(x => x.SystolicBP);
                        break;
                    case "+Glucose":
                        data = data.OrderBy(x => x.Glucose);
                        break;
                    case "-Glucose":
                        data = data.OrderByDescending(x => x.Glucose);
                        break;
                    case "+RespiratoryRate":
                        data = data.OrderBy(x => x.RespiratoryRate);
                        break;
                    case "-RespiratoryRate":
                        data = data.OrderByDescending(x => x.RespiratoryRate);
                        break;
                        case "+BodyMassIndex":
                        data = data.OrderBy(x => x.BodyMassIndex);
                        break;
                    case "-BodyMassIndex":
                        data = data.OrderByDescending(x => x.BodyMassIndex);
                        break;
                    case "+CDT":
                        data = data.OrderBy(x => x.CDT);
                        break;
                    case "-CDT":
                        data = data.OrderByDescending(x => x.CDT);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CVSDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientAllergyInformationDetail
        public void SaveClientAllergyInformationDetail(ClientAllergyInformationDetailModel _clientAllergyInformationDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientAllergyInformationDetail = new ClientAllergyInformationDetail();
                _clientAllergyInformationDetail.ClientID = _clientAllergyInformationDetailModel.ClientID;
                _clientAllergyInformationDetail.AllergyName = _clientAllergyInformationDetailModel.AllergyName;
                _clientAllergyInformationDetail.Reactions = _clientAllergyInformationDetailModel.Reactions;
                _clientAllergyInformationDetail.Status = _clientAllergyInformationDetailModel.Status;
                _clientAllergyInformationDetail.Cause = _clientAllergyInformationDetailModel.Cause;
                _clientAllergyInformationDetail.Severity = _clientAllergyInformationDetailModel.Severity;
                _clientAllergyInformationDetail.CreatedBy = "Admin";
                _clientAllergyInformationDetail.CreatedDateTime = DateTime.Now;

                _db.ClientAllergyInformationDetails.Add(_clientAllergyInformationDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }
        public void UpdateClientAllergyInformationDetail(ClientAllergyInformationDetailEditModel _clientAllergyInformationDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientAllergyInformationDetail = new ClientAllergyInformationDetail();
                _clientAllergyInformationDetail = _db.ClientAllergyInformationDetails.Where(x => x.IsDeleted == false && x.ClientAllergyInformationDetailID == _clientAllergyInformationDetailEditModel.CAIDID).FirstOrDefault();
                if (_clientAllergyInformationDetail != null)
                {
                    _clientAllergyInformationDetail.AllergyName = _clientAllergyInformationDetailEditModel.AllergyName;
                    _clientAllergyInformationDetail.Reactions = _clientAllergyInformationDetailEditModel.Reactions;
                    _clientAllergyInformationDetail.Status = _clientAllergyInformationDetailEditModel.Status;
                    _clientAllergyInformationDetail.Cause = _clientAllergyInformationDetailEditModel.Cause;
                    _clientAllergyInformationDetail.Severity = _clientAllergyInformationDetailEditModel.Severity;
                    _clientAllergyInformationDetail.ModifyBy = "Admin";
                    _clientAllergyInformationDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }
        public bool DeleteClientAllergyInformationDetail(ClientAllergyInformationDetailIDModel _clientAllergyInformationDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientAllergyInformationDetail = new ClientAllergyInformationDetail();
                _clientAllergyInformationDetail = _db.ClientAllergyInformationDetails.Where(x => x.IsDeleted == false && x.ClientAllergyInformationDetailID == _clientAllergyInformationDetailIDModel.CAIDID).FirstOrDefault();
                if (_clientAllergyInformationDetail != null)
                {
                    _clientAllergyInformationDetail.IsDeleted = true;
                    _clientAllergyInformationDetail.DeletedBy = "Admin";
                    _clientAllergyInformationDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientAllergyInformationDetailListModel> GetAllClientAllergyInformationDetail(int limit, int page, string orderby, ClientAllergyInformationDetailSearch _clientAllergyInformationDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CAID in _db.ClientAllergyInformationDetails
                            where CAID.IsDeleted == false && CAID.ClientID == _clientAllergyInformationDetailSearch.ClientID
                            select new ClientAllergyInformationDetailListModel
                            {
                                CAIDID = CAID.ClientAllergyInformationDetailID,
                                AllergyName = CAID.AllergyName,
                                Cause = CAID.Cause,
                                Reactions = CAID.Reactions,
                                Severity = CAID.Severity,
                                Status = CAID.Status
                            });
                //sort data
                switch (orderby)
                {
                    case "+AllergyName":
                        data = data.OrderBy(x => x.AllergyName);
                        break;
                    case "-AllergyName":
                        data = data.OrderByDescending(x => x.AllergyName);
                        break;
                    case "+Cause":
                        data = data.OrderBy(x => x.Cause);
                        break;
                    case "-Cause":
                        data = data.OrderByDescending(x => x.Cause);
                        break;
                    case "+Reactions":
                        data = data.OrderBy(x => x.Reactions);
                        break;
                    case "-Reactions":
                        data = data.OrderByDescending(x => x.Reactions);
                        break;
                    case "+Severity":
                        data = data.OrderBy(x => x.Severity);
                        break;
                    case "-Severity":
                        data = data.OrderByDescending(x => x.Severity);
                        break;
                    case "+Status":
                        data = data.OrderBy(x => x.Status);
                        break;
                    case "-Status":
                        data = data.OrderByDescending(x => x.Status);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CAIDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientSocialInformationDetail
        public void SaveClientSocialInformationDetail(ClientSocialInformationDetailModel _clientSocialInformationDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientSocialInformationDetail = new ClientSocialInformationDetail();
                _clientSocialInformationDetail.ClientID = _clientSocialInformationDetailModel.ClientID;
                _clientSocialInformationDetail.AnyBadHabit = _clientSocialInformationDetailModel.AnyBadHabit;
                _clientSocialInformationDetail.FromWhen = _clientSocialInformationDetailModel.FromWhen;

                _clientSocialInformationDetail.CreatedBy = "Admin";
                _clientSocialInformationDetail.CreatedDateTime = DateTime.Now;

                _db.ClientSocialInformationDetails.Add(_clientSocialInformationDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }
        public void UpdateClientSocialInformationDetail(ClientSocialInformationDetailEditModel _clientSocialInformationDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientSocialInformationDetail = new ClientSocialInformationDetail();
                _clientSocialInformationDetail = _db.ClientSocialInformationDetails.Where(x => x.IsDeleted == false && x.ClientSocialInfomationDetailID == _clientSocialInformationDetailEditModel.CSIDID).FirstOrDefault();
                if (_clientSocialInformationDetail != null)
                {
                    _clientSocialInformationDetail.AnyBadHabit = _clientSocialInformationDetailEditModel.AnyBadHabit;
                    _clientSocialInformationDetail.FromWhen = _clientSocialInformationDetailEditModel.FromWhen;
                    _clientSocialInformationDetail.ModifyBy = "Admin";
                    _clientSocialInformationDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }
        public bool DeleteClientSocialInformationDetail(ClientSocialInformationDetailIDModel _clientSocialInformationDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientSocialInformationDetail = new ClientSocialInformationDetail();
                _clientSocialInformationDetail = _db.ClientSocialInformationDetails.Where(x => x.IsDeleted == false && x.ClientSocialInfomationDetailID == _clientSocialInformationDetailIDModel.CSIDID).FirstOrDefault();
                if (_clientSocialInformationDetail != null)
                {
                    _clientSocialInformationDetail.IsDeleted = true;
                    _clientSocialInformationDetail.DeletedBy = "Admin";
                    _clientSocialInformationDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientSocialInformationDetailListModel> GetAllClientSocialInformationDetail(int limit, int page, string orderby, ClientSocialInformationDetailSearch _clientSocialInformationDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CSID in _db.ClientSocialInformationDetails
                            where CSID.IsDeleted == false && CSID.ClientID == _clientSocialInformationDetailSearch.ClientID
                            select new ClientSocialInformationDetailListModel
                            {
                                CSIDID = CSID.ClientSocialInfomationDetailID,
                                AnyBadHabit = CSID.AnyBadHabit,
                                FromWhen = CSID.FromWhen
                            });
                //sort data
                switch (orderby)
                {
                    case "+AnyBadHabit":
                        data = data.OrderBy(x => x.AnyBadHabit);
                        break;
                    case "-AnyBadHabit":
                        data = data.OrderByDescending(x => x.AnyBadHabit);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CSIDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region SaveClientProfileImage
        public void SaveClientProfileImage(SaveClientProfileImageModal _saveClientProfileImageModal)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _fileDetail = new FileDetail();
                _fileDetail.FileName = _saveClientProfileImageModal.FileName;
                _fileDetail.FileSize = _saveClientProfileImageModal.FileSize;
                _fileDetail.FileType = _saveClientProfileImageModal.FileType;
                _fileDetail.CreatedBy = "Admin";
                _fileDetail.CreatedDateTime = DateTime.Now;
                _db.FileDetails.Add(_fileDetail);

                _client = new Client();
                _client = _db.Clients.Where(x => x.ClientID == _saveClientProfileImageModal.ClientID && x.IsDeleted == false).FirstOrDefault();
                _client.FileDetailID = _fileDetail.FileDetailID;
                _client.ModifyBy = "Admin";
                _client.ModifyDateTime = DateTime.Now;
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public string GetClientProfileImage(int ClientID)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                string filename = null;
                var pathofClientProfileImage = "/App/UploadFile/Client/ClientProfile/";
                var fileDetailId = _db.Clients.Where(x => x.IsDeleted == false && x.ClientID == ClientID)
                                   .Select(x => x.FileDetailID).FirstOrDefault();
                if (fileDetailId > 0)
                {
                    filename = _db.FileDetails.Where(x => x.IsDeleted == false && x.FileDetailID == fileDetailId)
                                   .Select(x => x.FileName).FirstOrDefault();
                    filename = pathofClientProfileImage + filename;
                }
                else
                {
                    filename = "/App/Assets/Theme/assets/images/users/no-image.jpg";
                }
                return filename;
            }

        }
        #endregion

        #region clientVaccineDetail

        public void SaveClientVaccineDetail(ClientVaccineDetailModel _clientVaccineDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVaccineDetail = new ClientVaccineDetail();
                _clientVaccineDetail.ClientID = _clientVaccineDetailModel.ClientID;
                _clientVaccineDetail.VaccineType = _clientVaccineDetailModel.VaccineType;
                _clientVaccineDetail.GivenOn = _clientVaccineDetailModel.GivenOn;
                _clientVaccineDetail.Description = _clientVaccineDetailModel.Description;
                _clientVaccineDetail.Dose = _clientVaccineDetailModel.Dose;
                _clientVaccineDetail.ReVaccineDateTime = _clientVaccineDetailModel.ReVaccineDateTime;
                _clientVaccineDetail.CreatedBy = "Admin";
                _clientVaccineDetail.CreatedDateTime = DateTime.Now;

                _db.ClientVaccineDetails.Add(_clientVaccineDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }
        public void UpdateClientVaccineDetail(ClientVaccineDetailEditModel _clientVaccineDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVaccineDetail = new ClientVaccineDetail();
                _clientVaccineDetail = _db.ClientVaccineDetails.Where(x => x.IsDeleted == false && x.ClientVaccineDetailID == _clientVaccineDetailEditModel.CVDID).FirstOrDefault();
                if (_clientVaccineDetail != null)
                {
                    _clientVaccineDetail.VaccineType = _clientVaccineDetailEditModel.VaccineType;
                    _clientVaccineDetail.GivenOn = _clientVaccineDetailEditModel.GivenOn;
                    _clientVaccineDetail.Description = _clientVaccineDetailEditModel.Description;
                    _clientVaccineDetail.Dose = _clientVaccineDetailEditModel.Dose;
                    _clientVaccineDetail.ReVaccineDateTime = _clientVaccineDetailEditModel.ReVaccineDateTime;
                    _clientVaccineDetail.ModifyBy = "Admin";
                    _clientVaccineDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }
        public bool DeleteClientVaccineDetail(ClientVaccineDetailIDModel _clientVaccineDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientVaccineDetail = new ClientVaccineDetail();
                _clientVaccineDetail = _db.ClientVaccineDetails.Where(x => x.IsDeleted == false && x.ClientVaccineDetailID == _clientVaccineDetailIDModel.CVDID).FirstOrDefault();
                if (_clientVaccineDetail != null)
                {
                    _clientVaccineDetail.IsDeleted = true;
                    _clientVaccineDetail.DeletedBy = "Admin";
                    _clientVaccineDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientVaccineDetailListModel> GetAllClientVaccineDetail(int limit, int page, string orderby, ClientVaccineDetailSearch _clientVaccineDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CVD in _db.ClientVaccineDetails
                            where CVD.IsDeleted == false && CVD.ClientID == _clientVaccineDetailSearch.ClientID
                            select new ClientVaccineDetailListModel
                            {
                                CVDID = CVD.ClientVaccineDetailID,
                                Description = CVD.Description,
                                GivenOn = CVD.GivenOn,
                                VaccineType = CVD.VaccineType,
                                Dose = CVD.Dose,
                                ReVaccineDateTime = CVD.ReVaccineDateTime
                            });
                //sort data
                switch (orderby)
                {
                    case "+VaccineType":
                        data = data.OrderBy(x => x.VaccineType);
                        break;
                    case "-VaccineType":
                        data = data.OrderByDescending(x => x.VaccineType);
                        break;
                    case "+GivenOn":
                        data = data.OrderBy(x => x.GivenOn);
                        break;
                    case "-GivenOn":
                        data = data.OrderByDescending(x => x.GivenOn);
                        break;
                    case "+Dose":
                        data = data.OrderBy(x => x.Dose);
                        break;
                    case "-Dose":
                        data = data.OrderByDescending(x => x.Dose);
                        break;
                    case "+ReVaccineDateTime":
                        data = data.OrderBy(x => x.ReVaccineDateTime);
                        break;
                    case "-ReVaccineDateTime":
                        data = data.OrderByDescending(x => x.ReVaccineDateTime);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CVDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientPrescription
        public List<DrugModel> GetAllDrugList()
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from D in _db.Drugs
                            where D.IsDeleted == false
                            select new DrugModel
                            {
                                DrugID = D.DrugID,
                                Name = D.Name
                            });
                return data.ToList();
            }
        }

        public void SaveClientPrescriptionDetail(ClientPrescriptionDetailModel _clientPrescriptionDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPrescriptionDetail = new ClientPrescriptionDetail();
                _clientPrescriptionDetail.ClientID = _clientPrescriptionDetailModel.ClientID;
                _clientPrescriptionDetail.DrugID = _clientPrescriptionDetailModel.DrugID;
                _clientPrescriptionDetail.Strength = _clientPrescriptionDetailModel.Strength;
                _clientPrescriptionDetail.StrengthMeasure = _clientPrescriptionDetailModel.StrengthMeasure;
                _clientPrescriptionDetail.Quantity = _clientPrescriptionDetailModel.Quantity;
                _clientPrescriptionDetail.Refills = _clientPrescriptionDetailModel.Refills;
                _clientPrescriptionDetail.DirectionForUse = _clientPrescriptionDetailModel.DirectionForUse;
                _clientPrescriptionDetail.CreatedDateTime = DateTime.Now;
                _clientPrescriptionDetail.CreatedBy = "Admin";

                _db.ClientPrescriptionDetails.Add(_clientPrescriptionDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientPrescriptionDetail(ClientPrescriptionDetailEditModel _clientPrescriptionDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPrescriptionDetail = new ClientPrescriptionDetail();
                _clientPrescriptionDetail = _db.ClientPrescriptionDetails.Where(x => x.IsDeleted == false && x.ClientPrescriptionDetailID == _clientPrescriptionDetailEditModel.CPDID).FirstOrDefault();
                if (_clientPrescriptionDetail != null)
                {
                    _clientPrescriptionDetail.DrugID = _clientPrescriptionDetailEditModel.DrugID;
                    _clientPrescriptionDetail.Strength = _clientPrescriptionDetailEditModel.Strength;
                    _clientPrescriptionDetail.StrengthMeasure = _clientPrescriptionDetailEditModel.StrengthMeasure;
                    _clientPrescriptionDetail.Quantity = _clientPrescriptionDetailEditModel.Quantity;
                    _clientPrescriptionDetail.Refills = _clientPrescriptionDetailEditModel.Refills;
                    _clientPrescriptionDetail.DirectionForUse = _clientPrescriptionDetailEditModel.DirectionForUse;
                    _clientPrescriptionDetail.ModifyBy = "Admin";
                    _clientPrescriptionDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientPrescriptionDetail(ClientPrescriptionDetailIDModel _clientPrescriptionDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPrescriptionDetail = new ClientPrescriptionDetail();
                _clientPrescriptionDetail = _db.ClientPrescriptionDetails.Where(x => x.IsDeleted == false && x.ClientPrescriptionDetailID == _clientPrescriptionDetailIDModel.CPDID).FirstOrDefault();
                if (_clientPrescriptionDetail != null)
                {
                    _clientPrescriptionDetail.IsDeleted = true;
                    _clientPrescriptionDetail.DeletedBy = "Admin";
                    _clientPrescriptionDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientPrescriptionDetailListModel> GetAllClientPrescriptionDetail(int limit, int page, string orderby, ClientPrescriptionDetailSearch _clientPrescriptionDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CPD in _db.ClientPrescriptionDetails
                            where CPD.IsDeleted == false && CPD.ClientID == _clientPrescriptionDetailSearch.ClientID
                            join D in _db.Drugs on CPD.DrugID equals D.DrugID
                            select new ClientPrescriptionDetailListModel
                            {
                                CPDID = CPD.ClientPrescriptionDetailID,
                                DrugID = CPD.DrugID,
                                Quantity = CPD.Quantity,
                                Strength = CPD.Strength,
                                DFU = CPD.DirectionForUse,
                                Refills = CPD.Refills,
                                SM = CPD.StrengthMeasure,
                                DrugName = D.Name,
                                CDT = CPD.CreatedDateTime
                            });
                //sort data
                switch (orderby)
                {
                    case "+DrugName":
                        data = data.OrderBy(x => x.DrugName);
                        break;
                    case "-DrugName":
                        data = data.OrderByDescending(x => x.DrugName);
                        break;
                    case "+Quantity":
                        data = data.OrderBy(x => x.Quantity);
                        break;
                    case "-Quantity":
                        data = data.OrderByDescending(x => x.Quantity);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CPDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientProgressNote
        public void SaveClientProgressNote(ClientProgressNoteModel _clientProgressNoteModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientProgressNote = new ClientProgressNote();
                _clientProgressNote.ClientID = _clientProgressNoteModel.ClientID;
                _clientProgressNote.UserID = _clientProgressNoteModel.UserID;
                _clientProgressNote.ClientCondition = _clientProgressNoteModel.ClientCondition;
                _clientProgressNote.Description = _clientProgressNoteModel.Description;
                _clientProgressNote.CreatedDateTime = DateTime.Now;
                _clientProgressNote.CreatedBy = "Admin";
                _db.ClientProgressNotes.Add(_clientProgressNote);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientProgressNote(ClientProgressNoteEditModel _clientProgressNoteEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientProgressNote = new ClientProgressNote();
                _clientProgressNote = _db.ClientProgressNotes.Where(x => x.IsDeleted == false && x.ClientProgressNoteID == _clientProgressNoteEditModel.CPNID).FirstOrDefault();
                if (_clientProgressNote != null)
                {
                    _clientProgressNote.UserID = _clientProgressNoteEditModel.UserID;
                    _clientProgressNote.ClientCondition = _clientProgressNoteEditModel.ClientCondition;
                    _clientProgressNote.Description = _clientProgressNoteEditModel.Description;
                    _clientProgressNote.ModifyBy = "Admin";
                    _clientProgressNote.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientProgressNote(ClientProgressNoteIDModel _clientProgressNoteIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientProgressNote = new ClientProgressNote();
                _clientProgressNote = _db.ClientProgressNotes.Where(x => x.IsDeleted == false && x.ClientProgressNoteID == _clientProgressNoteIDModel.CPNID).FirstOrDefault();
                if (_clientProgressNote != null)
                {
                    _clientProgressNote.IsDeleted = true;
                    _clientProgressNote.DeletedBy = "Admin";
                    _clientProgressNote.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public List<ClientProgressNoteListModel> GetAllClientProgressNote(int limit, int page, string orderby, ClientProgressNoteSearch _clientProgressNoteSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CPN in _db.ClientProgressNotes
                            where CPN.IsDeleted == false && CPN.ClientID == _clientProgressNoteSearch.ClientID
                            join U in _db.UserDetails on CPN.UserID equals U.UserID
                            select new ClientProgressNoteListModel
                            {
                                UserName = U.FirstName + " " + U.LastName,
                                Description = CPN.Description,
                                CDT = CPN.CreatedDateTime,
                                ClientCondition = CPN.ClientCondition,
                                UserID = CPN.UserID,
                                CPNID = CPN.ClientProgressNoteID
                            });
                //sort data
                switch (orderby)
                {
                    case "+CDT":
                        data = data.OrderBy(x => x.CDT);
                        break;
                    case "-CDT":
                        data = data.OrderByDescending(x => x.CDT);
                        break;
                    
                    default:
                        data = data.OrderByDescending(x => x.CPNID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }

        #endregion

        #region ClientAppointmentDetail
        public List<ClientAppointmentDetailListModel> GetClientAppointmentDetail(int limit, int page, string orderby, ClientAppointmentDetailSearch _clientAppointmentDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from APD in _db.AppointmentDetails
                            join CAD in _db.ClientAppointmentDetails on APD.AppointmentDetailID equals CAD.AppointmentDetailID
                            join AS in _db.AppointmentStatus on APD.AppointmentStatusID equals AS.AppointmentStatusID
                            join U in _db.UserDetails on CAD.UserID equals U.UserID
                            where APD.IsDeleted == false && CAD.ClientID == _clientAppointmentDetailSearch.ClientID
                            select new ClientAppointmentDetailListModel
                            {
                                AppID = APD.AppointmentDetailID,
                                start = APD.StartDateTime,
                                end = APD.EndaDateTime,
                                UserName = U.FirstName + " " + U.LastName,
                                statusColor = AS.AppointmentStatusColorCode,
                                status = AS.AppointmentStatus
                            });
                //sort data
                switch (orderby)
                {
                    case "+UserName":
                        data = data.OrderBy(x => x.UserName);
                        break;
                    case "-UserName":
                        data = data.OrderByDescending(x => x.UserName);
                        break;
                    case "+start":
                        data = data.OrderBy(x => x.start);
                        break;
                    case "-start":
                        data = data.OrderByDescending(x => x.start);
                        break;
                    case "+end":
                        data = data.OrderBy(x => x.end);
                        break;
                    case "-end":
                        data = data.OrderByDescending(x => x.end);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.AppID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientBillingDetail
        public void SaveClientBillingDetail(ClientBillingDetailModel _clientBillingDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientBillingDetail = new ClientBillingDetail();
                _clientBillingDetail.ClientID = _clientBillingDetailModel.ClientID;
                _clientBillingDetail.ItemService = _clientBillingDetailModel.ItemService;
                _clientBillingDetail.Amount = _clientBillingDetailModel.Amount;
                _clientBillingDetail.Price = _clientBillingDetailModel.Price;
                _clientBillingDetail.Quantity = _clientBillingDetailModel.Quantity;
                _clientBillingDetail.CreatedDateTime = DateTime.Now;
                _clientBillingDetail.CreatedBy = "Admin";
                _db.ClientBillingDetails.Add(_clientBillingDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientBillingDetail(ClientBillingDetailEditModel _clientBillingDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientBillingDetail = new ClientBillingDetail();
                _clientBillingDetail = _db.ClientBillingDetails.Where(x => x.IsDeleted == false && x.ClientBillingDetailID == _clientBillingDetailEditModel.CBDID).FirstOrDefault();
                if (_clientBillingDetail != null)
                {
                    _clientBillingDetail.ItemService = _clientBillingDetailEditModel.ItemService;
                    _clientBillingDetail.Amount = _clientBillingDetailEditModel.Amount;
                    _clientBillingDetail.Price = _clientBillingDetailEditModel.Price;
                    _clientBillingDetail.Quantity = _clientBillingDetailEditModel.Quantity;
                    _clientBillingDetail.ModifyBy = "Admin";
                    _clientBillingDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientBillingDetail(ClientBillingDetailIDModel _clientBillingDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientBillingDetail = new ClientBillingDetail();
                _clientBillingDetail = _db.ClientBillingDetails.Where(x => x.IsDeleted == false && x.ClientBillingDetailID == _clientBillingDetailIDModel.CBDID).FirstOrDefault();
                if (_clientBillingDetail != null)
                {
                    _clientBillingDetail.IsDeleted = true;
                    _clientBillingDetail.DeletedBy = "Admin";
                    _clientBillingDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public List<ClientBillingDetialListModel> GetAllClientBillingDetail(int limit, int page, string orderby, ClientBillingDetailSearch _clientBillingDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CBD in _db.ClientBillingDetails
                            where CBD.IsDeleted == false && CBD.ClientID == _clientBillingDetailSearch.ClientID
                            select new ClientBillingDetialListModel
                            {
                                CBDID = CBD.ClientBillingDetailID,
                                Amount = CBD.Amount,
                                ItemService = CBD.ItemService,
                                Price = CBD.Price,
                                Quantity = CBD.Quantity,
                                CDT = CBD.CreatedDateTime
                            });
                //sort data
                switch (orderby)
                {
                    case "+Amount":
                        data = data.OrderBy(x => x.Amount);
                        break;
                    case "-Amount":
                        data = data.OrderByDescending(x => x.Amount);
                        break;
                    case "+CDT":
                        data = data.OrderBy(x => x.Amount);
                        break;
                    case "-CDT":
                        data = data.OrderByDescending(x => x.Amount);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CBDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }
        #endregion

        #region ClientPaymentDetail
        public void SaveClientPaymentDetail(ClientPaymentDetailModel _clientPaymentDetailModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPaymentDetail = new ClientPaymentDetail();
                _clientPaymentDetail.PaymentTypeID = _clientPaymentDetailModel.PTID;
                _clientPaymentDetail.ClientID = _clientPaymentDetailModel.ClientID;
                _clientPaymentDetail.Amount = _clientPaymentDetailModel.Amount;
                _clientPaymentDetail.Description = _clientPaymentDetailModel.Description;
                var paymenType = _db.PaymentTypes.Where(x => x.PaymentTypeID == _clientPaymentDetailModel.PTID).Select(x => new { x.PaymentTypeID, x.Name }).FirstOrDefault();
                if (paymenType != null && paymenType.Name == "Credit Card Payment")
                {
                    _clientPaymentDetail.CreditCardName = _clientPaymentDetailModel.CreditCardName;
                    _clientPaymentDetail.CreditCardNumber = _clientPaymentDetailModel.CreditCardNumber;
                    _clientPaymentDetail.CardVerificationCode = _clientPaymentDetailModel.CardVerificationCode;
                    _clientPaymentDetail.CreditExpireOn = _clientPaymentDetailModel.CreditExpireOn;
                }
                else if (paymenType != null && paymenType.Name == "Cheque Payment")
                {
                    _clientPaymentDetail.BankName = _clientPaymentDetailModel.BankName;
                    _clientPaymentDetail.AccountNumber = _clientPaymentDetailModel.AccountNumber;
                    _clientPaymentDetail.RoutingNumber = _clientPaymentDetailModel.RoutingNumber;
                }
                _clientPaymentDetail.CreatedDateTime = DateTime.Now;
                _clientPaymentDetail.CreatedBy = "Admin";
                _db.ClientPaymentDetails.Add(_clientPaymentDetail);
                _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
            }
        }

        public void UpdateClientPaymentDetail(ClientPaymentDetailEditModel _clientPaymentDetailEditModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPaymentDetail = new ClientPaymentDetail();
                _clientPaymentDetail = _db.ClientPaymentDetails.Where(x => x.IsDeleted == false && x.ClientPaymentDetailID == _clientPaymentDetailEditModel.CPDID).FirstOrDefault();
                if (_clientPaymentDetail != null)
                {
                    _clientPaymentDetail.PaymentTypeID = _clientPaymentDetailEditModel.PTID;
                    _clientPaymentDetail.Amount = _clientPaymentDetailEditModel.Amount;
                    _clientPaymentDetail.Description = _clientPaymentDetailEditModel.Description;

                    var paymenType = _db.PaymentTypes.Where(x => x.PaymentTypeID == _clientPaymentDetailEditModel.PTID).Select(x => new { x.PaymentTypeID, x.Name }).FirstOrDefault();
                    if (paymenType != null && paymenType.Name == "Credit Card Payment")
                    {
                        _clientPaymentDetail.CreditCardName = _clientPaymentDetailEditModel.CreditCardName;
                        _clientPaymentDetail.CreditCardNumber = _clientPaymentDetailEditModel.CreditCardNumber;
                        _clientPaymentDetail.CardVerificationCode = _clientPaymentDetailEditModel.CardVerificationCode;
                        _clientPaymentDetail.CreditExpireOn = _clientPaymentDetailEditModel.CreditExpireOn;

                        _clientPaymentDetail.BankName = null;
                        _clientPaymentDetail.AccountNumber = null;
                        _clientPaymentDetail.RoutingNumber = null;
                    }
                    else if (paymenType != null && paymenType.Name == "Cheque Payment")
                    {
                        _clientPaymentDetail.BankName = _clientPaymentDetailEditModel.BankName;
                        _clientPaymentDetail.AccountNumber = _clientPaymentDetailEditModel.AccountNumber;
                        _clientPaymentDetail.RoutingNumber = _clientPaymentDetailEditModel.RoutingNumber;

                        _clientPaymentDetail.CreditCardName = null;
                        _clientPaymentDetail.CreditCardNumber = null;
                        _clientPaymentDetail.CardVerificationCode = null;
                        _clientPaymentDetail.CreditExpireOn = null;
                    }
                    else
                    {
                        _clientPaymentDetail.CreditCardName = null;
                        _clientPaymentDetail.CreditCardNumber = null;
                        _clientPaymentDetail.CardVerificationCode = null;
                        _clientPaymentDetail.CreditExpireOn = null;

                        _clientPaymentDetail.BankName = null;
                        _clientPaymentDetail.AccountNumber = null;
                        _clientPaymentDetail.RoutingNumber = null;
                    }
                    _clientPaymentDetail.ModifyBy = "Admin";
                    _clientPaymentDetail.ModifyDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                }
            }
        }

        public bool DeleteClientPaymentDetail(ClientPaymentDetailIDModel _clientPaymentDetailIDModel)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                _clientPaymentDetail = new ClientPaymentDetail();
                _clientPaymentDetail = _db.ClientPaymentDetails.Where(x => x.IsDeleted == false && x.ClientPaymentDetailID == _clientPaymentDetailIDModel.CPDID).FirstOrDefault();
                if (_clientPaymentDetail != null)
                {
                    _clientPaymentDetail.IsDeleted = true;
                    _clientPaymentDetail.DeletedBy = "Admin";
                    _clientPaymentDetail.DeletedDateTime = DateTime.Now;
                    _db.SaveChanges(AccountMangementRepositoy._loginInUserID);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public List<ClientPaymentDetailListModel> GetAllClientPaymentDetail(int limit, int page, string orderby, ClientPaymentDetailSearch _clientPaymentDetailSearch, out int total)
        {
            using (_db = new ElectronicHealthRecordDBContext())
            {
                var data = (from CPD in _db.ClientPaymentDetails
                            where CPD.IsDeleted == false && CPD.ClientID == _clientPaymentDetailSearch.ClientID
                            join PT in _db.PaymentTypes on CPD.PaymentTypeID equals PT.PaymentTypeID
                            select new ClientPaymentDetailListModel
                            {
                                CPDID = CPD.ClientPaymentDetailID,
                                Amount = CPD.Amount,
                                CDT = CPD.CreatedDateTime,
                                Description = CPD.Description,
                                PTID = CPD.PaymentTypeID,
                                PTName = PT.Name,
                                CCName = CPD.CreditCardName,
                                CCNumber = CPD.CreditCardNumber,
                                CreditExpireOn = CPD.CreditExpireOn,
                                CVC = CPD.CardVerificationCode,
                                AccountNumber = CPD.AccountNumber,
                                BankName = CPD.BankName,
                                RoutingNumber = CPD.RoutingNumber
                            });
                //sort data
                switch (orderby)
                {
                    case "+CDT":
                        data = data.OrderBy(x => x.Amount);
                        break;
                    case "-CDT":
                        data = data.OrderByDescending(x => x.Amount);
                        break;
                    default:
                        data = data.OrderByDescending(x => x.CPDID);
                        break;
                }
                total = data.Count();
                return data.Skip((page - 1) * limit).Take(limit).ToList();
            }
        }

        #endregion
        #endregion
    }
}