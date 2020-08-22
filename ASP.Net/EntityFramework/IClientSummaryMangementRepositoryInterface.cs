using ElectronicHealthRecord.CoreEntites.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronicHealthRecord.RepositoryLayer.DoctorRepository.Interface
{
    public interface IClientSummaryMangementRepositoryInterface
    {

        void UpdateRegisterClient(RegisterClientModel _registerClientModel);
        RetrieveClientDetail clientDetailByClientID(int cID);
        #region EmergencyContact
        void SaveEmergencyContact(EmergencyContactModel _emergencyContactModel);
        bool IsEmergencyContactExistWithSameEmail(string Email);
        List<EmergencyContactListModel> GetAllEmergencyContact(int limit, int page, string orderby, EmergencyContactSearch _emergencyContactSearch, out int total);
        void UpdateEmergencyContact(EmergencyContactEditModel _emergencyContactEditModel);
        bool DeleteEmergencyContact(EmergencyContactIDModel _emergencyContactIDModel);
        #endregion

        #region DropDownList
        List<RelationshipModel> GetAllRelationShip();
        List<CountryModel> GetAllCountries();
        List<StateModel> GetAllStatesBaseOnCountryID(CountryModel _countryModel);
        List<CityModel> GetAllCityBaseOnStateID(StateModel _stateModel);
        List<ClientBloodGroupModel> GetAllBloodGroup();
        List<UserDetailModel> GetAllUserDetail();
        List<PaymentTypeModel> GetAllPaymentType();
        #endregion

        #region ClientContact
        void SaveClientContact(ClientContactModel _clientContactModel);
        ClientContactDetialModel GetClientContactDetial(ClientIDModel _clientIDModel);
        #endregion

        #region ClientPersonalDetail
        void SaveClientPersonalDetail(ClientPersonalModel _clientPersonalModel);
        ClientPersonalDetailModel GetClientPersonalDetail(ClientIDModel _clientIDModel);
        #endregion

        #region ClientInsuranceDetail
        List<ClientInsuranceListModel> GetAllClientInsuranceDetail(int limit, int page, string orderby, ClientInsuranceDetailSearch _clientInsuranceDetailSearch, out int total);
        void SaveClientInsuranceDetail(ClientInsuranceModel _clientInsuranceModel);
        void UpdateClientInsuranceDetail(ClientInsuranceEditModel _ClientInsuranceEditModel);
        bool DeleteClientInsuranceDetail(ClientInsuranceDetailIDModel _clientInsuranceDetailIDModel);
        bool IsClientInsuranceDetailExistWithSameCardNumber(IsCardNumbertModel _isCardNumbertModel);
        #endregion

        #region ClientFamilyHealthDetail
        List<ClientFamilyHealthDetailListModel> GetAllClientFamilyHealthDetail(int limit, int page, string orderby, ClientFamilyHealthDetailSearch _clientFamilyHealthDetailSearch, out int total);
        void SaveClientFamilyHealthDetail(ClientFamilyHealthDetailModel _clientFamilyHealthDetailModel);
        void UpdateClientFamilyHealthDetail(ClientFamilyHealthDetailEditModel _clientFamilyHealthDetailEditModel);
        bool DeleteClientFamilyHealthDetail(ClientFamilyHealthDetailIDModel _clientFamilyHealthDetailIDModel);
        #endregion

        #region ClientVitalSignDetial
        void SaveClientVitalSignDetail(ClientVitalSignDetailModel _clientVitalSignDetailModel);

        void UpdateClientVitalSignDetail(ClientVitalSignDetailEditModel _clientVitalSignDetailEditModel);

        bool DeleteClientVitalSignDetail(ClientVitalSignDetailIDModel _clientVitalSignDetailIDModel);
        
        List<ClientVitalSignDetailListModel> GetAllClientVitalSignDetail(int limit, int page, string orderby, ClientVitalSignDetailSearch _clientVitalSignDetailSearch, out int total);
        #endregion

        #region ClientAllergyInformationDetail
        void SaveClientAllergyInformationDetail(ClientAllergyInformationDetailModel _clientAllergyInformationDetailModel);
        void UpdateClientAllergyInformationDetail(ClientAllergyInformationDetailEditModel _clientAllergyInformationDetailEditModel);
        bool DeleteClientAllergyInformationDetail(ClientAllergyInformationDetailIDModel _clientAllergyInformationDetailIDModel);
        List<ClientAllergyInformationDetailListModel> GetAllClientAllergyInformationDetail(int limit, int page, string orderby, ClientAllergyInformationDetailSearch _clientAllergyInformationDetailSearch, out int total);
        #endregion

        #region ClientSocialInformationDetail
        void SaveClientSocialInformationDetail(ClientSocialInformationDetailModel _clientSocialInformationDetailModel);
        void UpdateClientSocialInformationDetail(ClientSocialInformationDetailEditModel _clientSocialInformationDetailEditModel);
        bool DeleteClientSocialInformationDetail(ClientSocialInformationDetailIDModel _clientSocialInformationDetailIDModel);
        List<ClientSocialInformationDetailListModel> GetAllClientSocialInformationDetail(int limit, int page, string orderby, ClientSocialInformationDetailSearch _clientSocialInformationDetailSearch, out int total);
        #endregion

        #region SaveClientProfileImage
        string GetClientProfileImage(int ClientID);
        void SaveClientProfileImage(SaveClientProfileImageModal _saveClientProfileImageModal);
        
        #endregion

        #region clientVaccineDetail
        void SaveClientVaccineDetail(ClientVaccineDetailModel _clientVaccineDetailModel);
        void UpdateClientVaccineDetail(ClientVaccineDetailEditModel _clientVaccineDetailEditModel);
        bool DeleteClientVaccineDetail(ClientVaccineDetailIDModel _clientVaccineDetailIDModel);
        List<ClientVaccineDetailListModel> GetAllClientVaccineDetail(int limit, int page, string orderby, ClientVaccineDetailSearch _clientVaccineDetailSearch, out int total);
        #endregion

        #region ClientPrescription
        List<DrugModel> GetAllDrugList();
        void SaveClientPrescriptionDetail(ClientPrescriptionDetailModel _clientPrescriptionDetailModel);
        void UpdateClientPrescriptionDetail(ClientPrescriptionDetailEditModel _clientPrescriptionDetailEditModel);
        bool DeleteClientPrescriptionDetail(ClientPrescriptionDetailIDModel _clientPrescriptionDetailIDModel);
        List<ClientPrescriptionDetailListModel> GetAllClientPrescriptionDetail(int limit, int page, string orderby, ClientPrescriptionDetailSearch _clientPrescriptionDetailSearch, out int total);

        #endregion

        #region ClientProgressNote
        void SaveClientProgressNote(ClientProgressNoteModel _clientProgressNoteModel);

        void UpdateClientProgressNote(ClientProgressNoteEditModel _clientProgressNoteEditModel);
        
        bool DeleteClientProgressNote(ClientProgressNoteIDModel _clientProgressNoteIDModel);
        
        List<ClientProgressNoteListModel> GetAllClientProgressNote(int limit, int page, string orderby, ClientProgressNoteSearch _clientProgressNoteSearch, out int total);
        #endregion

        #region ClientAppointmentDetail
        List<ClientAppointmentDetailListModel> GetClientAppointmentDetail(int limit, int page, string orderby, ClientAppointmentDetailSearch _clientAppointmentDetailSearch, out int total);
        #endregion

        #region ClientBillingDetail
        void SaveClientBillingDetail(ClientBillingDetailModel _clientBillingDetailModel);
        void UpdateClientBillingDetail(ClientBillingDetailEditModel _clientBillingDetailEditModel);
        bool DeleteClientBillingDetail(ClientBillingDetailIDModel _clientBillingDetailIDModel);
        List<ClientBillingDetialListModel> GetAllClientBillingDetail(int limit, int page, string orderby, ClientBillingDetailSearch _clientBillingDetailSearch, out int total);
        
        #endregion

        #region ClientPaymentDetail
        void SaveClientPaymentDetail(ClientPaymentDetailModel _clientPaymentDetailModel);
        void UpdateClientPaymentDetail(ClientPaymentDetailEditModel _clientPaymentDetailEditModel);
        bool DeleteClientPaymentDetail(ClientPaymentDetailIDModel _clientPaymentDetailIDModel);
        List<ClientPaymentDetailListModel> GetAllClientPaymentDetail(int limit, int page, string orderby, ClientPaymentDetailSearch _clientPaymentDetailSearch, out int total);
        #endregion

    }
}
