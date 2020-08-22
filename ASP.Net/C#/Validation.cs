using Core.SYS_Classes;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Configuration;
using Core.SYS_Enums;
using Core.DataContracts.Requests;
using Core.DatabaseOps;
using Core.DataContracts.Responses;
using Core.SYS_Interfaces;
using System.Net;
using System.Web;
using System.Data.SqlClient;
using Core.SYS_Objects;
using CoreInterfaces;
using NodaTime;
using NodaTime.Text;
using System.Device.Location;
using System.Runtime.CompilerServices;
using Core.Configuration;
namespace SCImplementations
{
    public class Validation : IValidation
    {
        private string p_vem = String.Empty;
        private string errorMessage = string.Empty;
        public string vem
        {
            get { return p_vem; }
            set { p_vem = value; }
        }

        public string GetLastError()
        {
            return errorMessage;
        }

        public bool Is_Valid_Email_Message(string inputStr)
        {
            if (!String.IsNullOrEmpty(inputStr) && inputStr.Length <= GeneralConfig.MAX_DEFAULT_STRING_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_String(string inputStr)
        {
            if (!String.IsNullOrEmpty(inputStr) && inputStr.Length <= GeneralConfig.MAX_DEFAULT_STRING_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Long_String(string inputStr)
        {
            if (!String.IsNullOrEmpty(inputStr) && inputStr.Length <= GeneralConfig.MAX_DEFAULT_LONG_STRING_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_NameStr(string inputStr)
        {
            if (!String.IsNullOrEmpty(inputStr) && inputStr.Length <= GeneralConfig.MAX_DEFAULT_NAME_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_DescriptionStr(string inputStr)
        {
            if (!String.IsNullOrEmpty(inputStr) && inputStr.Length <= GeneralConfig.MAX_DEFAULT_DESCRIPTION_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_EmailAddress(string email_addr)
        {
            if (email_addr == String.Empty)
            {
                return false;
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email_addr);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Is_Valid_MsDuration(long durationInMs)
        {
            //max is 6 months
            return durationInMs >= 0 && durationInMs <= GeneralConfig.MAX_AP_EX_TSO_DURATION;
        }

        public bool Is_Valid_Password(string password)
        {
            if (!String.IsNullOrEmpty(password) && password.Length <= GeneralConfig.MAX_PASSWORD_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_DateTime_String(string str_date_time)
        {
            try
            {
                if (InstantPattern.ExtendedIsoPattern.Parse(str_date_time).Success)
                {
                    return Is_Valid_DateTime(InstantPattern.ExtendedIsoPattern.Parse(str_date_time).Value);
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return false;

        }
        public bool Is_Valid_DateTime(Instant date_time)
        {
            if (date_time.Ticks >= InstantPattern.ExtendedIsoPattern.Parse(GeneralConfig.DEFAULT_SYSTEM_MIN_DATE).Value.Ticks && date_time.Ticks <= InstantPattern.ExtendedIsoPattern.Parse(GeneralConfig.DEFAULT_SYSTEM_MAX_DATE).Value.Ticks)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Tag_Name(string categorie_name)
        {
            if (!String.IsNullOrEmpty(categorie_name) && categorie_name.Length <= GeneralConfig.MAX_CATEGORY_NAME_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Organisation_Name(string newOrgName)
        {
            if (!String.IsNullOrEmpty(newOrgName) && newOrgName.Length <= GeneralConfig.MAX_ORGANISATION_NAME_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Role_Name(string role_name)
        {
            return Is_Valid_String(role_name);
        }

        public bool Is_Valid_Resource_Name(string resource_name)
        {
            return Is_Valid_String(resource_name);
        }

        public bool Is_Valid_Categorie_ID(ICoreProject coreProject, int categorie_id, int orgId)
        {
            //DC_Org_ID dc_o = new DC_Org_ID(coreProject);
            //dc_o.orgId = orgId;
            //List<BaseTag> categorie_list;
            //if (SC_Org_Tag.Org_Read_All_Tags(dc_o, out categorie_list) == ENUM_DB_Status.DB_SUCCESS)
            //{
            //    for (int i = 0; i < categorie_list.Count; i++)
            //    {
            //        if (categorie_list[i].tagId == categorie_id)
            //        {
            //            return true;
            //        }
            //    }
            //}
            return false;
        }

        public bool Is_Valid_Currency(int value)
        {
            return Enum.IsDefined(typeof(ENUM_SYS_CurrencyOption), value);
        }

        public bool Is_Max_Decimal_Places_2(decimal dec)
        {
            return decimal.Round(dec, 2) == dec;
        }

        public bool Is_Known_Email_To_System(ICoreProject coreProject, string email_address, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_EmailAddress(email_address))
            {
                bool is_known = false;
                if (coreDb.DB_Is_Email_Known(coreProject, email_address, out is_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return is_known;
                }
            }
            return false;
        }

        public bool Is_Activation_String_Valid(ICoreProject coreProject, int user_id, string activation_string, ICoreDatabase coreDb)
        {
            DC_Email_Address dc_emailaddress = new DC_Email_Address(coreProject);
            String user_email = coreDb.GetLoginNameFromUserID(coreProject, user_id);
            //if (user_email != String.Empty)
            if (!string.IsNullOrEmpty(user_email))
            {
                String activationStr = String.Empty;
                if (coreDb.User_Read_Activation_String(coreProject, user_email, out activationStr) == ENUM_DB_Status.DB_SUCCESS && activationStr != String.Empty)
                {
                    //do not ignore case
                    if (String.Compare(activationStr, activation_string, false) == 0)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool Is_Valid_Appointment_ID(ICoreProject coreProject, int appointment_id, ICoreDatabase coreDb)
        {
            bool appointment_known = false;
            if (appointment_id > 0 && appointment_id < int.MaxValue)
            {
                if (coreDb.DB_Is_Appointment_ID_Known(coreProject, appointment_id, out appointment_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return appointment_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Animal_ID(ICoreProject coreProject, int animalId, ICoreDatabase coreDb)
        {
            bool animalKnown = false;
            if (animalId > 0 && animalId < int.MaxValue)
            {
                if (coreDb.DB_Is_Animal_ID_Known(coreProject, animalId, out animalKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return animalKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_MedicalRecord_ID(ICoreProject coreProject, int medicalRecordId, ICoreDatabase coreDb)
        {
            bool medicalRecordKnown = false;
            if (medicalRecordId > 0 && medicalRecordId < int.MaxValue)
            {
                if (coreDb.DB_Is_MedicalRecord_ID_Known(coreProject, medicalRecordId, out medicalRecordKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return medicalRecordKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_MedicalNote_ID(ICoreProject coreProject, int medicalNoteId, ICoreDatabase coreDb)
        {
            bool medicalNoteKnown = false;
            if (medicalNoteId > 0 && medicalNoteId < int.MaxValue)
            {
                if (coreDb.DB_Is_MedicalNote_ID_Known(coreProject, medicalNoteId, out medicalNoteKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return medicalNoteKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_InvoiceableItem_ID(ICoreProject coreProject, int invoiceableItemId, ICoreDatabase coreDb)
        {
            bool invoiceableItemKnown = false;
            if (invoiceableItemId > 0 && invoiceableItemId < int.MaxValue)
            {
                if (coreDb.DB_Is_InvoiceableItem_ID_Known(coreProject, invoiceableItemId, out invoiceableItemKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return invoiceableItemKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_TSO_Id(ICoreProject coreProject, int tso_id, ICoreDatabase coreDb)
        {
            bool tso_known = false;
            if (tso_id > 0 && tso_id < int.MaxValue)
            {
                if (coreDb.DB_Is_TSO_ID_Known(coreProject, tso_id, out tso_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return tso_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Email_To_Send_ID(ICoreProject coreProject, int email_id, ICoreDatabase coreDb)
        {
            bool email_known = false;
            if (email_id > 0 && email_id < int.MaxValue)
            {
                if (coreDb.DB_Is_Email_To_Send_ID_Known(coreProject, email_id, out email_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return email_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Exception_ID(ICoreProject coreProject, int exception_id, ICoreDatabase coreDb)
        {
            bool exception_known = false;
            if (exception_id > 0 && exception_id < int.MaxValue)
            {
                if (coreDb.DB_Is_Exception_ID_Known(coreProject, exception_id, out exception_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return exception_known;
                }
            }
            return false;
        }

        public bool Is_Valid_TimeScale(ITimeScale timeScale)
        {
            DateTime start;
            DateTime end;
            if (DateTime.TryParse(timeScale.start, out start) && DateTime.TryParse(timeScale.end, out end))
            {
                if (start.ToUniversalTime().Ticks < end.ToUniversalTime().Ticks)
                {
                    if (start.Ticks > DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MIN_DATE).Ticks && start.Ticks < DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MAX_DATE).Ticks &&
                        end.Ticks > DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MIN_DATE).Ticks && end.Ticks < DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MAX_DATE).Ticks)
                    {
                        if (start.AddMilliseconds(timeScale.durationMilliseconds).ToUniversalTime().Ticks == end.ToUniversalTime().Ticks)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        public bool Is_Valid_Org_Customer(ICoreProject coreProj, int userId, int orgId, ICoreDatabase coreDb)
        {
            List<IContact> contactDetails = new List<IContact>();
            DC_Org_ID orgIdReq = new DC_Org_ID(coreProj);
            orgIdReq.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
            orgIdReq.orgId = orgId;
            List<IContact> listOfOrgCreatedContacts;
            if (coreDb.ReadAll_Org_Created_Contacts(coreProj, orgId, out listOfOrgCreatedContacts) != ENUM_DB_Status.DB_SUCCESS)
            {
                return false;
            }
            List<IContact> listOfOrgMemberContacts;
            if (coreDb.ReadAll_Org_Member_Contacts(coreProj, orgId, out listOfOrgMemberContacts) != ENUM_DB_Status.DB_SUCCESS)
            {
                return false;
            }

            contactDetails.AddRange(listOfOrgCreatedContacts);
            contactDetails.AddRange(listOfOrgMemberContacts);
            foreach (IContact contactDetail in contactDetails)
            {
                if (String.Compare(contactDetail.emailAddress, coreDb.GetLoginNameFromUserID(coreProj, userId), true) == 0 && contactDetail.contactType == ENUM_SYS_ContactType.Customer)
                {
                    return true;
                }
            }
            return false;
        }

        public bool Is_User_Member_Of_Organisation(ICoreProject coreProject, IUtils utils, int user_id, int orgId, ICoreDatabase coreDb)
        {
            DC_Base dc_b = new DC_Base(coreProject);
            dc_b.cmd_user_id = user_id;
            if (user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
            {
                return true;
            }
            List<IOrg> list_of_orgs = new List<IOrg>();

            if (coreDb.User_Read_All_Users_Organisation_Memberships(coreProject, user_id, utils, out list_of_orgs) == ENUM_DB_Status.DB_SUCCESS && list_of_orgs.Count > 0)
            {
                //TODO: re-write this should be simple
                for (int i = 0; i < list_of_orgs.Count; i++)
                {
                    if (list_of_orgs[i].orgId == orgId)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool Permissions_User_Can_Do_System_Action(int user_id, ENUM_SYS_Action action_id)
        {
            if (user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
            {
                return true;
            }
            switch (action_id)
            {
                case ENUM_SYS_Action.readAllCreated:
                    {
                        return true;
                        //break;
                    }
                case ENUM_SYS_Action.readMaxRender:
                    {
                        return true;
                        //break;
                    }
                case ENUM_SYS_Action.createOrg:
                    {
                        //currently we handle it like this but we will move this in the future
                        return true;
                        //break;
                    }
                case ENUM_SYS_Action.readAllUserOrganisations:
                    {
                        return true;
                        //break;
                    }
                default:
                    {
                        return false;
                    }
            }
        }

        public bool Permissions_User_Can_Do_Core_Action(ICoreProject coreProject,ICoreSc coreSc, ICoreDatabase coreDb, IUtils utils, int user_id, int orgId, ENUM_Core_Function action_id)
        {
            DC_Org_Member_Id dc_o_e_u = new DC_Org_Member_Id(coreProject);
            dc_o_e_u.cmd_user_id = user_id;
            dc_o_e_u.orgId = orgId;
            dc_o_e_u.userId = user_id;
           if (user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
            { 
                return true;
            }
            if (coreSc.Is_Valid_User_ID(coreProject, user_id, coreDb))
            {
                IOrgUser user_data;
                //TODO: VERY IMPORTANT somehow you need to create a way to allow the system to exec commands without having a user id
                if (coreDb.Org_Read_Member(coreProject, dc_o_e_u.orgId, dc_o_e_u.userId, out user_data) == ENUM_DB_Status.DB_SUCCESS)//&& user_data.UserActivated == User_State_In_System.User_Exists_And_Activated)
                {
                    //BaseOrg borg;
                    //if (DatabaseOperations_Organisation.Org_Get_Org(dc_o_, out borg) == DB_Status.DB_SUCCESS)
                    IOrgUser bou;
                    if (coreDb.Org_Read_Org_Owner_User(coreProject, dc_o_e_u.orgId, out bou) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        //check if user is sysadmin/creator of organisation if so return true
                        if (bou.userId == user_id)
                        {
                            return true;
                        }
                    }
                    else
                    {
                        return false;
                    }
                    if (orgId != -999)
                    {
                        DC_Org_ID dc_o_ = new DC_Org_ID(coreProject);
                        dc_o_.cmd_user_id = user_id;
                        dc_o_.orgId = orgId;
                        if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && coreSc.Is_User_Member_Of_Organisation(coreProject, utils, user_id, orgId,coreDb))
                        {
                            List<int> role_ids = new List<int>();
                            //gets the users roles                            
                            if (coreDb.Org_Read_Role_Mapping_IDs_For_User(coreProject, dc_o_e_u.orgId, dc_o_e_u.userId, out role_ids) != ENUM_DB_Status.DB_SUCCESS)
                            {
                                return false;
                            }

                            //get the permissions for the roles
                            List<ENUM_Core_Function> all_role_permissions = new List<ENUM_Core_Function>();
                            foreach (int role_id in role_ids)
                            {
                                List<ENUM_Core_Function> permission_actions;
                                DC_Org_Role dc_o_r = new DC_Org_Role(coreProject);
                                dc_o_r.cmd_user_id = user_id;
                                dc_o_r.orgId = orgId;
                                dc_o_r.roleId = role_id;
                                if (coreDb.Org_Read_Role_Permissions(coreProject, orgId, role_id, out permission_actions) == ENUM_DB_Status.DB_SUCCESS)
                                {
                                    foreach (ENUM_Core_Function pa in permission_actions)
                                    {
                                        if (!all_role_permissions.Contains(pa))
                                        {
                                            all_role_permissions.Add(pa);
                                        }
                                    }
                                    //PermissionMap.GetPermissionMap(action_id);
                                }
                                else
                                {
                                    return false;
                                }
                            }
                            if (role_ids.Count > 0)
                            {
                                return all_role_permissions.Contains(action_id);
                                /*foreach (ENUM_Core_Action pa in all_role_permissions)
                                {
                                    if (pa == action_id) // || pa.SystemActionID == (int)SystemActions.ORG_CREATE)
                                    {
                                        return true;
                                    }
                                }*/
                            }
                        }
                        else
                        {
                            //check to see if the user is a customer and its a service order request.
                            if (coreSc.Is_Valid_Org_Customer(coreProject, user_id, orgId, coreDb) &&
                                (action_id == ENUM_Core_Function.CF_readallOrgServiceOrdersByUserId ||
                                action_id == ENUM_Core_Function.CF_readAllOrgServicesByOrgID ||
                                action_id == ENUM_Core_Function.CF_readOrgActiveServiceProvidersByOrgID ||
                                action_id == ENUM_Core_Function.CF_readServiceResourceTSOsByServiceResourceIDsStartEnd ||
                                action_id == ENUM_Core_Function.CF_createOrgServiceOrder ||
                                action_id == ENUM_Core_Function.CF_deleteOrgServiceOrderByServiceOrderID
                                ))
                            {
                                return true;
                            }
                            else
                            {
                                //this is not a valid request
                            }
                        }
                    }
                    else
                    {
                        ////its not an organisation action
                        ////if (/*action_id == ENUM_Core_Action.readAllMemberships ||*/
                        ////action_id == ENUM_Core_Action.createOrg
                        ////   )
                        //{
                        //    return true;
                        //}
                        return false;
                    }
                }

            }
            return false;
        }

        public bool Is_Valid_MoneyValue(IMoneyValue value)
        {
            if (value.monetaryCurrency != ENUM_SYS_CurrencyOption.Unknown)
            {
                switch (value.monetaryCurrency)
                {
                    //case ENUM_SYS_CurrencyOption.gbp:
                    //    if(value.monetaryAmount < GeneralConfig.MAX_MONEY_GBP_VALUE && value.monetaryAmount > 0)
                    //    {
                    //        return true;
                    //    }
                    //    return false;
                    case ENUM_SYS_CurrencyOption.USD:
                        if (value.monetaryAmount < GeneralConfig.MAX_MONEY_USD_VALUE && value.monetaryAmount >= 0)
                        {
                            return true;
                        }
                        return false;
                }
            }
            return false;
        }

        public bool Is_Valid_Role_ID(ICoreProject coreProject, int role_id, ICoreDatabase coreDb)
        {
            if (role_id > 0)
            {
                bool role_id_known;
                if (coreDb.DB_Is_Role_ID_Known(coreProject, role_id, out role_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return role_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Invoice_ID(ICoreProject coreProject, int invoiceId, ICoreDatabase coreDb)
        {
            if (invoiceId > 0)
            {
                bool invoice_id_known;
                if (coreDb.DB_Is_Invoice_ID_Known(coreProject, invoiceId, out invoice_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return invoice_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Product_ID(ICoreProject coreProject, int productId, ICoreDatabase coreDb)
        {
            if (productId > 0)
            {
                bool productIdKnown;
                if (coreDb.DB_Is_Product_ID_Known(coreProject, productId, out productIdKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return productIdKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_Payment_ID(ICoreProject coreProject, int paymentId, ICoreDatabase coreDb)
        {
            if (paymentId > 0)
            {
                bool paymentIdKnown;

                if (coreDb.DB_Is_Payment_ID_Known(coreProject, paymentId, out paymentIdKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return paymentIdKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_ServiceFulfilmentConfig_ID(ICoreProject coreProject, int serviceFulfilmentConfig, ICoreDatabase coreDb)
        {
            if (serviceFulfilmentConfig > 0)
            {
                bool serviceFulfilmentConfigKnown;
                if (coreDb.DB_Is_ServiceFulfilmentConfig_ID_Known(coreProject, serviceFulfilmentConfig, out serviceFulfilmentConfigKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return serviceFulfilmentConfigKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(ICoreProject coreProject, int serviceFulfilmentConfigResMap, ICoreDatabase coreDb)
        {
            if (serviceFulfilmentConfigResMap > 0)
            {
                bool serviceFulfilmentConfigResMapKnown;
                if (coreDb.DB_Is_ServiceFulfilmentConfig_Resource_Map_ID_Known(coreProject, serviceFulfilmentConfigResMap, out serviceFulfilmentConfigResMapKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return serviceFulfilmentConfigResMapKnown;
                }
            }
            return false;

        }

        public bool Is_Valid_TempPaypalID(ICoreProject coreProject, int tempPaypalId, ICoreDatabase coreDb)
        {
            if (tempPaypalId > 0)
            {
                bool tempPaypalIdKnown;
                if (coreDb.DB_Is_TempPaypal_ID_Known(coreProject, tempPaypalId, out tempPaypalIdKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return tempPaypalIdKnown;
                }
            }
            return false;
        }


        public bool Is_Valid_Repeat_ID(ICoreProject coreProject, int repeat_id, ICoreDatabase coreDb)
        {
            if (repeat_id > 0)
            {
                bool repeat_id_known;
                if (coreDb.DB_Is_Repeat_ID_Known(coreProject, repeat_id, out repeat_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return repeat_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_User_ID(ICoreProject coreProject, int user_id, ICoreDatabase coreDb)
        {
            if (user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
            {
                return true;
            }
            if (user_id > 0)
            {

                bool user_id_known;
                if (coreDb.DB_Is_UserID_Known(coreProject, user_id, out user_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return user_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Org_ID(ICoreProject coreProject, int orgId, ICoreDatabase coreDb)
        {
            if (orgId > 0 && orgId < int.MaxValue)
            {
                bool orgId_known;

                if (coreDb.DB_Is_Org_ID_Known(coreProject, orgId, out orgId_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return orgId_known;
                }
            }
            return false;
        }

        public bool BELONG_Org_Role(ICoreProject coreProject, int orgId, int role_id,ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId,coreDb) && coreSc.Is_Valid_Role_ID(coreProject, role_id, coreDb))
            {
                bool isKnown;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, role_id, DB_Base.DBTable_Org_Roles_Available_Table, DB_Base.DBTable_Org_Roles_Available_Table_orgId, DB_Base.DBTable_Org_Roles_Available_Table_ID, out isKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return isKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_Categorie_Type_ID(ICoreProject coreProject, int categorie_type_id)
        {
            Enum_SYS_Categorie_Type result;
            Enum.TryParse(categorie_type_id.ToString(), out result);
            if (Convert.ToUInt32(result) > Enum.GetNames(typeof(Enum_SYS_Categorie_Type)).Length)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public bool CheckTimeIsWithinSystemTimeBoundaries(IInstantStartStop startAndStop)
        {
            BaseInstantStartStop sysRange = BaseInstantStartStop.Get_Sys_Time_Range();
            if (startAndStop.start >= sysRange.start && startAndStop.stop <= sysRange.stop &&
                startAndStop.stop >= startAndStop.stop && startAndStop.stop <= sysRange.stop)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Resource_Type_ID(int resource_type_id)
        {
            ENUM_SYS_Resource_Type result;
            Enum.TryParse(resource_type_id.ToString(), out result);

            if (Convert.ToUInt32(result) > Enum.GetNames(typeof(ENUM_SYS_Resource_Type)).Length)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public bool Is_Valid_Appointment_Type_ID(int appointment_type_id)
        {
            ENUM_SYS_Appointment_Type result;
            //return Enum.TryParse(appointment_type_id.ToString(), out result) && result != ENUM_SYS_Appointment_Type.Unknown;
            Enum.TryParse(appointment_type_id.ToString(), out result);
            //Modify by  : saddam
            //ModiFy Date: 15-04-2017
            if (Convert.ToUInt32(result) > Enum.GetNames(typeof(ENUM_SYS_Appointment_Type)).Length || result == ENUM_SYS_Appointment_Type.Unknown)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public bool Is_Valid_Exception_Type_ID(int exception_type_id)
        {
            ENUM_SYS_Exception_Type result;
            Enum.TryParse(exception_type_id.ToString(), out result);

            if (Convert.ToUInt32(result) > Enum.GetNames(typeof(ENUM_SYS_Exception_Type)).Length)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public bool Is_Valid_Resource_ID(ICoreProject coreProject, int resource_id, ICoreDatabase coreDb)
        {
            if (resource_id > 0)
            {
                bool res_id_known;
                if (coreDb.DB_Is_Resource_ID_Known(coreProject, resource_id, out res_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return res_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_ServiceOrder_ID(ICoreProject coreProject, int serviceOrderId, ICoreDatabase coreDb)
        {
            if (serviceOrderId > 0)
            {
                bool serviceOrder_id_known;
                if (coreDb.DB_Is_ServiceOrder_ID_Known(coreProject, serviceOrderId, out serviceOrder_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return serviceOrder_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Contact_ID(ICoreProject coreProject, int contactId, ICoreDatabase coreDb)
        {
            if (contactId > 0)
            {
                bool contact_id_known;
                if (coreDb.DB_Is_Contact_ID_Known(coreProject, contactId, out contact_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return contact_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Service_ID(ICoreProject coreProject, int serviceId, ICoreDatabase coreDb)
        {
            if (serviceId > 0)
            {
                bool service_id_known;
                if (coreDb.DB_Is_Service_ID_Known(coreProject, serviceId, out service_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return service_id_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Platform_Service_ID(ICoreProject coreProject, int platformserviceId, ICoreDatabase coreDb)
        {
            if (platformserviceId > 0)
            {
                bool platform_id_known;

                if (coreDb.DB_Is_Platform_Service_ID_Known(coreProject, platformserviceId, out platform_id_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return platform_id_known;
                }
            }
            return false;
        }

        public bool Is_Org_Resource(ICoreProject coreProject, int orgId, int resId,ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && coreSc.Is_Valid_Resource_ID(coreProject, resId, coreDb))
            {
                bool orgId_known;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, resId, DB_Base.DBTable_Org_Resources_Table, DB_Base.DBTable_Org_Resources_Table_Resource_orgId, DB_Base.DBTable_Org_Resources_Table_ID, out orgId_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return orgId_known;
                }
            }
            return false;
        }

        public bool BELONG_Org_Calendar(ICoreProject coreProject, int orgId, int calendarId,ICoreSc coreSc,ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && coreSc.Is_Valid_Calendar_ID(coreProject, calendarId, coreDb))
            {
                bool isKnown;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, calendarId, DB_Base.DBTable_Org_Calendar_Table, DB_Base.DBTable_Org_Calendar_Table_orgId, DB_Base.DBTable_Org_Calendar_Table_ID, out isKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return isKnown;
                }
            }
            return false;
        }

        public bool BELONG_Org_Appointment(ICoreProject coreProject, int orgId, int appointmentId,ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && coreSc.Is_Valid_Appointment_ID(coreProject, appointmentId, coreDb))
            {
                bool isKnown;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, appointmentId, DB_Base.DBTable_Org_Appointments_Table, DB_Base.DBTable_Org_Appointments_Table_Org_ID, DB_Base.DBTable_Org_Appointments_Table_ID, out isKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return isKnown;
                }
            }
            return false;
        }

        public bool BELONG_Org_Exception(ICoreProject coreProject, int orgId, int exceptionId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && coreSc.Is_Valid_Exception_ID(coreProject, exceptionId, coreDb))
            {
                bool isKnown;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, exceptionId, DB_Base.DBTable_Org_Exceptions_Table, DB_Base.DBTable_Org_Exceptions_Table_Org_ID, DB_Base.DBTable_Org_Exceptions_Table_ID, out isKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return isKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_Customer_ID(ICoreProject coreProject, int customer_id, int orgId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (coreSc.Is_Valid_Org_ID(coreProject, orgId, coreDb) && customer_id > 0)
            {
                bool isKnown;
                if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, customer_id, DB_Base.DBTable_Org_Contact_Table, DB_Base.DBTable_Org_Contact_Table_orgId, DB_Base.DBTable_Org_Contact_Table_ID, out isKnown) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return isKnown;
                }
            }
            return false;
        }

        public bool Is_Valid_Component_Name(string component_name)
        {
            return Is_Valid_String(component_name);
        }

        public bool Is_Valid_Product_Name(string product_name)
        {
            return Is_Valid_String(product_name);
        }

        public bool Is_Valid_Notification_Message(string notification_message)
        {
            if (!string.IsNullOrEmpty(notification_message) && notification_message.Length <= GeneralConfig.MAX_NOTIFICATION_MSG_LENGTH)
            {
                return true;
            }
            return false;
        }


        public bool Is_Valid_Customer_Company_Name(string customer_company_name)
        {
            if (!string.IsNullOrEmpty(customer_company_name) && customer_company_name.Length <= GeneralConfig.MAX_CUSTOMER_COMPANY_NAME_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Address_String(string address_line)
        {
            if (!string.IsNullOrEmpty(address_line) && address_line.Length <= GeneralConfig.MAX_ADDRESS_LINE_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_MoneyAmount(decimal moneyVal)
        {
            if (moneyVal >= 0 && moneyVal <= GeneralConfig.MAX_MONEY_VALUE)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Post_Code(string post_code, ICountry country_data)
        {
            if (!string.IsNullOrEmpty(post_code) && post_code.Length <= GeneralConfig.MAX_ADDRESS_LINE_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Phone_Number(string phone_number, ICountry country_data)
        {
            if (!string.IsNullOrEmpty(phone_number) && phone_number.Length <= GeneralConfig.MAX_ADDRESS_LINE_LENGTH)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Location(double lat, double lng)
        {
            try
            {
                GeoCoordinate geo = new GeoCoordinate(lat, lng);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Is_Valid_BookingOverlap(Enum_SYS_BookingOverlap obj)
        {
            if (obj != Enum_SYS_BookingOverlap.Unknown)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_WeekDay(List<int> weekDayNums)
        {
            if (weekDayNums != null)
            {
                foreach (int weekdayNum in weekDayNums)
                {
                    if (!Is_Valid_WeekDay(weekdayNum))
                    {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_WeekDay(int weekDayNum)
        {
            if (Is_Valid_WeekDay(weekDayNum))
            {
                return true;
            }
            else if (weekDayNum == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_WeekDay(int weekDayNum)
        {
            if (weekDayNum >= 1 && weekDayNum <= 7)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Week(int weekNum)
        {
            if (Is_Valid_Week(weekNum))
            {
                return true;
            }
            else if (weekNum == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Week(int weekNum)
        {
            return (weekNum >= 1 && weekNum <= 5);
            /*{
                var calendar = CultureInfo.CurrentCulture.Calendar;
                var firstDayOfWeek = CultureInfo.CurrentCulture.DateTimeFormat.FirstDayOfWeek;
                var weekPeriods =
                Enumerable.Range(1, calendar.GetDaysInMonth(year, month))
                          .Select(d =>
                          {
                              var date = new DateTime(year, month, d);
                              var weekNumInYear = calendar.GetWeekOfYear(date, CalendarWeekRule.FirstDay, firstDayOfWeek);
                              return new { date, weekNumInYear };
                          })
                          .GroupBy(x => x.weekNumInYear)
                          .Select(x => new { DateFrom = x.First().date, To = x.Last().date })
                          .ToList();
                if(weekPeriods.Count >= weekNum)
                {
                    return true;
                }
                return true;
            }
            return false;*/
        }

        public bool Is_Valid_Day(int day)
        {
            if (day >= 1 && day <= 31)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Limit(int limit)
        {
            if (limit > 0 && limit < GeneralConfig.MAX_REPEAT_OCCURANCES)
            {
                return true;
            }
            if (limit == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Day(int day)
        {
            if (Is_Valid_Day(day))
            {
                return true;
            }
            else if (day == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Type(int repeatType)
        {
            if (repeatType <= 1)
            {
                return false;
            }
            return Enum.IsDefined(typeof(ENUM_Repeat_Type), repeatType);
        }

        public bool Is_Valid_MonthDay(int year, int month, int day)
        {
            int maxDays = DateTime.DaysInMonth(year, month);
            if (day >= 1 && day <= maxDays)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Month(int month)
        {
            if (Is_Valid_Month(month))
            {
                return true;
            }
            else if (month == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Month(int month)
        {
            return month >= 1 && month <= 12;
        }

        public bool Is_Valid_Repeat_Year(int year)
        {
            if (year > 0 && year < 30)
            {
                return true;
            }
            else if (year == 0)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Year(int year)
        {
            return year >= DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MIN_DATE).Year && year <= DateTime.Parse(GeneralConfig.DEFAULT_SYSTEM_MAX_DATE).Year;
        }

        public bool Is_Valid_RepeatParams(IRepeatOptions repeatData, ICoreSc coreSc)
        {
            if (repeatData.repeatType == ENUM_Repeat_Type.Unknown)
            {
                return false;
            }
            if (repeatData.repeatType == ENUM_Repeat_Type.Daily)
            {
                //it can be ok to hav
                if (!coreSc.Is_Valid_Repeat_Day(repeatData.repeatDay) || repeatData.repeatDay == 0)
                {
                    return false;
                }
                else if (repeatData.repeatWeek == 0 && repeatData.repeatMonth == 0 && repeatData.repeatYear == 0)
                {
                    return true;
                }
            }
            if (repeatData.repeatType == ENUM_Repeat_Type.Weekly)
            {
                if (!coreSc.Is_Valid_Repeat_Week(repeatData.repeatWeek) || repeatData.repeatWeek == 0)
                {
                    return false;
                }
                else if (repeatData.repeatDay == 0 && repeatData.repeatMonth == 0 && repeatData.repeatYear == 0)
                {
                    return true;
                }
            }
            if (repeatData.repeatType == ENUM_Repeat_Type.Monthly || repeatData.repeatMonth == 0)
            {
                if (!coreSc.Is_Valid_Repeat_Month(repeatData.repeatMonth))
                {
                    return false;
                }
                else if (repeatData.repeatDay == 0 && repeatData.repeatWeek == 0 && repeatData.repeatYear == 0)
                {
                    return true;
                }
            }
            if (repeatData.repeatType == ENUM_Repeat_Type.Yearly || repeatData.repeatYear == 0)
            {
                if (!coreSc.Is_Valid_Repeat_Year(repeatData.repeatYear))
                {
                    return false;
                }
                else if (repeatData.repeatDay == 0 && repeatData.repeatWeek == 0 && repeatData.repeatMonth == 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool Is_Valid_Email_ID_Combo(ICoreProject coreProject, string emailAddress, int userId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            
            if (coreSc.Is_Valid_EmailAddress(emailAddress) && coreSc.Is_Valid_User_ID(coreProject, userId, coreDb))
            {
                if (String.Compare(coreDb.GetLoginNameFromUserID(coreProject, userId), emailAddress) == 0)
                {
                    return true;
                }
            }
            return false;
        }

        public bool Is_Valid_Repeat_Modifier(int modifier)
        {
            if (modifier > 0 && modifier < 30)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_TimeZoneIANA(string timeZoneStr)
        {
            if (!String.IsNullOrEmpty(timeZoneStr))
            {
                DateTimeZone tz = DateTimeZoneProviders.Tzdb.GetZoneOrNull(timeZoneStr);
                return tz != null;
            }
            return false;
        }

        public bool Is_Appointment_Belonging_To_Organisation(ICoreProject coreProject, int orgId, int appointmentId, ICoreDatabase coreDb)
        {
            bool appointment_known = false;
            if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, appointmentId, DB_Base.DBTable_Org_Appointments_Table, DB_Base.DBTable_Org_Appointments_Table_Org_ID, DB_Base.DBTable_Org_Appointments_Table_ID, out appointment_known) == ENUM_DB_Status.DB_SUCCESS)
            {
                return appointment_known;
            }

            return false;
        }

        public bool Is_Exception_Belonging_To_Organisation(ICoreProject coreProject, int orgId, int exceptionId, ICoreDatabase coreDb)
        {
            bool exception_known = false;
            if (coreDb.DB_Is_ID_Belonging_To_Org(coreProject, orgId, exceptionId, DB_Base.DBTable_Org_Exceptions_Table, DB_Base.DBTable_Org_Exceptions_Table_Org_ID, DB_Base.DBTable_Org_Exceptions_Table_ID, out exception_known) == ENUM_DB_Status.DB_SUCCESS)
            {
                return exception_known;
            }

            return false;
        }

        public bool Is_Valid_Appointment_Title(string appointmentTitle, ICoreSc coreSc)
        {
            return coreSc.Is_Valid_String(appointmentTitle);
        }

        public bool Is_Valid_Exception_Title(string exceptionTitle, ICoreSc coreSc)
        {
            return coreSc.Is_Valid_String(exceptionTitle);
        }

        public bool Is_Valid_Resource_ID_List(ICoreProject coreProject, List<int> resourceList, int orgId, ICoreDatabase coreDb)
        {
            List<Boolean> validResIds = new List<bool>();
            foreach (int resId in resourceList)
            {
                bool wasValid;
                if (coreDb.DB_Is_Resource_ID_Known_To_Org(coreProject, orgId, resId, out wasValid) == ENUM_DB_Status.DB_SUCCESS)
                {
                    if (wasValid)
                    {
                        validResIds.Add(wasValid);
                    }
                }
            }
            if (validResIds.Count == resourceList.Count)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Repeat_Type(ENUM_Event_Repeat_Type repeatType)
        {
            if (repeatType != ENUM_Event_Repeat_Type.Unknown)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Apply_To(ENUM_Repeat_Apply_To applyTo)
        {
            if (applyTo != ENUM_Repeat_Apply_To.Unknown)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Daily_User_Slot_Limit(long slotLimit)
        {
            if (slotLimit >= 0 && slotLimit <= 96)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_SlotDuration(long slotDuration)
        {
            //15 mins = 900000
            //432000000 = 5 days
            if (slotDuration >= 900000 && slotDuration < 432000000)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Calendar_ID(ICoreProject coreProject, int calendarId, ICoreDatabase coreDb)
        {
            bool calendar_known = false;
            if (calendarId > 0 && calendarId < int.MaxValue)
            {

                if (coreDb.DB_Is_Calendar_ID_Known(coreProject, calendarId, out calendar_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return calendar_known;
                }
            }
            return false;
        }

        public bool Is_Valid_File_ID(ICoreProject coreProject, int fileId, ICoreDatabase coreDb)
        {
            bool fileId_known = false;
            if (fileId > 0 && fileId < int.MaxValue)
            {
                if (coreDb.DB_Is_File_ID_Known(coreProject, fileId, out fileId_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return fileId_known;
                }
            }
            return false;
        }

        public bool Is_Valid_Time_AllocationType(int slotLimit)
        {
            if (slotLimit <= 1)
            {
                return false;
            }
            return Enum.IsDefined(typeof(ENUM_SYS_Resource_Time_Allocation_Type), slotLimit);
        }

        public bool Is_Valid_ContactType(int contactType)
        {
            if (contactType <= 1)
            {
                return false;
            }
            return Enum.IsDefined(typeof(ENUM_SYS_ContactType), contactType);
        }

        public bool Is_Valid_User_Title(int userTitle)
        {
            if (userTitle <= 1)
            {
                return false;
            }
            return Enum.IsDefined(typeof(Enum_SYS_User_Title), userTitle);
        }

        public bool Is_Belonging_To_Org(ICoreProject coreProject, object objectToValidate,ICoreSc coreSc, ICoreDatabase coreDb)
        {
            if (objectToValidate is IOrgID)
            {
                IOrgID orgTest = objectToValidate as IOrgID;
                if (!coreSc.Is_Valid_Org_ID(coreProject, orgTest.orgId, coreDb))
                {
                    if (objectToValidate is IDcCreateResource)
                    {
                        IDcCreateResource createResObj = objectToValidate as IDcCreateResource;
                        if (createResObj.orgId == 0 && coreSc.Is_Valid_User_ID(coreProject, createResObj.userId, coreDb) && createResObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                        {
                            //this is ok
                        }
                        else
                        {
                            return false;
                        }
                    }
                    //else if (objectToValidate is DC_Create_User)
                    //{
                    //    DC_Create_User createUserObj = objectToValidate as DC_Create_User;
                    //    if (createUserObj.orgId == 0 && createUserObj.userId == 0 && createUserObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    //    {
                    //        //this is ok
                    //    }
                    //    else
                    //    {
                    //        return false;
                    //    }
                    //}
                    //else if (objectToValidate is DC_Create_Contact)
                    //{
                    //    DC_Create_Contact createContactObj = objectToValidate as DC_Create_Contact;
                    //    if (createContactObj.orgId == 0 && coreSc.Is_Valid_User_ID(createContactObj.userId) && createContactObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    //    {
                    //        //this is ok
                    //    }
                    //    else
                    //    {
                    //        return false;
                    //    }
                    //}
                    //else
                    //{
                    //    return false;
                    //}
                }
                int orgId = orgTest.orgId;
                if (objectToValidate is IResourceID)
                {
                    IResourceID myTest = objectToValidate as IResourceID;
                    if (!coreSc.Is_Org_Resource(coreProject, orgId, myTest.resourceId, coreSc,coreDb))
                    {
                        DC_Resource_ID resId = new DC_Resource_ID(coreProject);
                        resId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resId.resourceId = myTest.resourceId;
                        //IDcrTrueFalse trueFalse = scResources.Read_Is_Resource_A_User_Resource_By_Resource_ID(resId);
                        //if (trueFalse.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    return false;
                        //}
                        //if (!trueFalse.Result && (orgId == -1 || orgId == 0))
                        //{
                        //    return false;
                        //}
                    }
                }
                if (objectToValidate is ICalendarID)
                {
                    ICalendarID myTest = objectToValidate as ICalendarID;
                    if (!coreSc.BELONG_Org_Calendar(coreProject, orgId, myTest.calendarId, coreSc,coreDb))
                    {
                        return false;
                    }
                }
                //all tests passed so it must be ok
                return true;
            }
            else
            {
                //it has no org id parameter so return it as ok
                return true;
            }
            //return false;
        }

        static string ValidationErrorMessage(
    [CallerLineNumber] int lineNumber = 0,
    [CallerMemberName] string caller = null)
        {
            return "validation failed at line " + lineNumber + " (" + caller + ")";
        }

        private static string ValidationOk()
        {
            return "Validation Ok";
        }

        
        public bool Is_Valid(ICoreProject coreProject,ICoreSc coreSc, ICoreDatabase coreDb, IUtils utils, object objectUnderValidation, Type objectType)
        {
            List<String> interfacesValidated = new List<string>();
            List<String> interfacesInsideClass = new List<string>();
            if (objectUnderValidation is IDC_Base)
            {
                IDC_Base myTest = objectUnderValidation as IDC_Base;
                if (coreSc.Is_Valid_User_ID(coreProject, myTest.cmd_user_id, coreDb) || myTest.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                {
                    //this is ok
                }
                else
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDC_Base).FullName);
            }
            if (!coreSc.Is_Belonging_To_Org(coreProject, objectUnderValidation, coreSc, coreDb))
            {
                errorMessage = ValidationErrorMessage();
                return false;
            }
            if (objectUnderValidation is IExceptionID)
            {
                IExceptionID myTest = objectUnderValidation as IExceptionID;
                if (!coreSc.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb))
                {
                    if ((objectUnderValidation is ITSO && myTest.exceptionId == 0) ||
                        (objectUnderValidation is ITsoOptions && myTest.exceptionId == 0))
                    {
                        //this is ok so do nothing
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IExceptionID).FullName);
            }
            if (objectUnderValidation is IAppointmentID)
            {
                IAppointmentID myTest = objectUnderValidation as IAppointmentID;

                if (!coreSc.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb))
                {
                    if ((objectUnderValidation is ITSO && myTest.appointmentId == 0) ||
                        (objectUnderValidation is ITsoOptions && myTest.appointmentId == 0 ||
                        objectUnderValidation is IDcCreateOrgServiceOrder && myTest.appointmentId == 0)
                        )
                    {
                        //this is ok so do nothing
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IAppointmentID).FullName);
            }
            if (objectUnderValidation is INotificationOptions)
            {
                INotificationOptions myTest = objectUnderValidation as INotificationOptions;
                if (!coreSc.Is_Valid_Notification_Message(myTest.notificationMessage))
                {
                    errorMessage = ValidationErrorMessage(); return false;
                }
                if (myTest.notificationType == ENUM_Notification_Type.Unknown) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.notificationState == ENUM_Notification_State.Unknown) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(INotificationOptions).FullName);
            }
            if (objectUnderValidation is IOrgAppointment)
            {
                IOrgAppointment myTest = objectUnderValidation as IOrgAppointment;
                if (!coreSc.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Appointment_Title(myTest.appointmentTitle,coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                //if (!coreSc.Is_Valid_Email_ID_Combo(myTest.creatorEmail, myTest.creatorId)) { return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Resource_ID_List(coreProject, myTest.resourceIdList, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_TimeScale(myTest)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IOrgAppointment).FullName);
            }
            if (objectUnderValidation is IRepeatOptions)
            {
                IRepeatOptions myTest = objectUnderValidation as IRepeatOptions;
                if (!coreSc.Is_Valid_Repeat_Day(myTest.repeatDay)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Type((int)myTest.repeatType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Month(myTest.repeatMonth)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Week(myTest.repeatWeek)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_WeekDay(myTest.repeatWeekDays)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Year(myTest.repeatYear)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Limit(myTest.maxOccurances)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_Modifier(myTest.modifier)) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.repeatType == ENUM_Repeat_Type.Daily && myTest.modifier == 0) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.repeatType == ENUM_Repeat_Type.Weekly && myTest.modifier == 0) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.repeatType == ENUM_Repeat_Type.Monthly && myTest.modifier == 0) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.repeatType == ENUM_Repeat_Type.Yearly && myTest.modifier == 0) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.repeatType == ENUM_Repeat_Type.Monthly)
                {
                    //if you specify a monthly repeat you must also specify a type eg: week of month or exact date in month
                    if (myTest.repeatMonth != 1 && myTest.repeatMonth != 2)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                    if (myTest.repeatMonth == 1)
                    {
                        if (!coreSc.Is_Valid_Day(myTest.repeatDay))
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                interfacesValidated.Add(typeof(IRepeatOptions).FullName);
            }
            if (objectUnderValidation is IOrgID)
            {
                IOrgID myTest = objectUnderValidation as IOrgID;
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb))
                {
                    if (objectUnderValidation is IResourceOptions)
                    {
                        IResourceOptions createResObj = objectUnderValidation as IResourceOptions;
                        if (createResObj.orgId == 0 && coreSc.Is_Valid_User_ID(coreProject, createResObj.userId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IServiceOptions)
                    {
                        IServiceOptions createServiceOptions = objectUnderValidation as IServiceOptions;
                        if (createServiceOptions.orgId == 0)
                        {

                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcServiceId)
                    {
                        IDcServiceId serviceIdDetails = objectUnderValidation as IDcServiceId;
                        bool isPlatformService = false;

                        if (coreDb.DB_Is_Platform_Service_ID_Known(coreProject, serviceIdDetails.serviceId, out isPlatformService) != ENUM_DB_Status.DB_SUCCESS)
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                        if (serviceIdDetails.orgId == 0 && isPlatformService)
                        {

                            //this 
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                        interfacesValidated.Add(typeof(IDcServiceId).FullName);
                    }
                    else if (objectUnderValidation is IContactOptions)
                    {
                        IContactOptions contactOptions = objectUnderValidation as IContactOptions;
                        if (contactOptions.orgId == 0 && coreSc.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IAddressOptions)
                    {
                        IAddressOptions contactOptions = objectUnderValidation as IAddressOptions;
                        if (contactOptions.orgId == 0 && coreSc.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                    }
                    else if (objectUnderValidation is IDcOrgAddressUserId)
                    {
                        IDcOrgAddressUserId contactOptions = objectUnderValidation as IDcOrgAddressUserId;
                        if (contactOptions.orgId == 0 && coreSc.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    //else if (objectUnderValidation is IServiceOrderOptions && objectUnderValidation is IDcCreateOrgServiceOrder)
                    else if (objectUnderValidation is IServiceOrderOptions && objectUnderValidation is IDcCreateOrgServiceOrder)
                    {
                        IDcCreateOrgServiceOrder serviceOrderOptions = objectUnderValidation as IDcCreateOrgServiceOrder;
                        if (serviceOrderOptions.orgId == 0 && coreSc.Is_Valid_Platform_Service_ID(coreProject, serviceOrderOptions.serviceId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is INotificationOptions && objectUnderValidation is IDC_Create_Notification)
                    {
                        IDC_Create_Notification serviceOrderOptions = objectUnderValidation as IDC_Create_Notification;
                        if (serviceOrderOptions.orgId == -1 && serviceOrderOptions.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        //its not a valid request
                        return false;
                    }
                    //else if (objectUnderValidation is DC_Create_User)
                    //{
                    //    DC_Create_User createResObj = objectUnderValidation as DC_Create_User;
                    //    if (createResObj.orgId == 0 && createResObj.userId == 0 && createResObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    //    {
                    //        //this is ok
                    //    }
                    //    else
                    //    {
                    //        return false;
                    //    }
                    //}
                    //else if (objectUnderValidation is DC_Create_Org_Contact)
                    //{
                    //    DC_Create_Org_Contact createContactObj = objectUnderValidation as DC_Create_Org_Contact;
                    //    if (createContactObj.orgId == 0 && coreSc.Is_Valid_User_ID(createContactObj.userId) && createContactObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    //    {
                    //        //this is ok
                    //    }
                    //    else
                    //    {
                    //        return false;
                    //    }
                    //}
                    //else
                    //{
                    //    return false;
                    //}
                }
                interfacesValidated.Add(typeof(IOrgID).FullName);
            }
            if (objectUnderValidation is IRepeatID)
            {
                IRepeatID myTest = objectUnderValidation as IRepeatID;
                if (!coreSc.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb))
                {
                    if ((objectUnderValidation is ITSO && myTest.repeatId == 0) ||
                        (objectUnderValidation is ITsoOptions && myTest.repeatId == 0))
                    {
                        //do nothing as this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IRepeatID).FullName);
            }
            if (objectUnderValidation is ICreatorID)
            {
                ICreatorID myTest = objectUnderValidation as ICreatorID;
                if (!coreSc.Is_Valid_User_ID(coreProject, myTest.creatorId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICreatorID).FullName);
            }
            if (objectUnderValidation is ITimeScale)
            {
                ITimeScale myTest = objectUnderValidation as ITimeScale;
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (DateTime.Parse(myTest.end) < DateTime.Parse(myTest.start))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                IInstantStartStop tr = new BaseInstantStartStop();
                tr.start = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                //tr.Duration = TimeSpan.FromMilliseconds(myTest.durationMilliseconds);
                tr.stop = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                if (!coreSc.CheckTimeIsWithinSystemTimeBoundaries(tr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeScale).FullName);
            }
            if (objectUnderValidation is ITimeStartEnd)
            {
                ITimeStartEnd myTest = objectUnderValidation as ITimeStartEnd;
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (DateTime.Parse(myTest.end) < DateTime.Parse(myTest.start))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                BaseInstantStartStop tr = new BaseInstantStartStop();
                tr.start = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                tr.stop = InstantPattern.ExtendedIsoPattern.Parse(myTest.end).Value;
                if (!coreSc.CheckTimeIsWithinSystemTimeBoundaries(tr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeStartEnd).FullName);
            }
            if (objectUnderValidation is ICreateException)
            {
                ICreateException myTest = objectUnderValidation as ICreateException;
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_User_Member_Of_Organisation(coreProject, utils, myTest.creatorId, myTest.orgId,coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Exception_Title(myTest.exceptionTitle,coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if(myTest.calendarIdList.Count == 0 && myTest.resourceIdList.Count == 0)
                {
                    return false;
                }*/
                interfacesValidated.Add(typeof(ICreateException).FullName);
            }
            if (objectUnderValidation is ICreateAppointment)
            {
                ICreateAppointment myTest = objectUnderValidation as ICreateAppointment;
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_User_Member_Of_Organisation(coreProject, utils, myTest.creatorId, myTest.orgId, coreDb))
                {
                    if (!coreSc.Is_Valid_Org_Customer(coreProject,  myTest.creatorId, myTest.orgId, coreDb))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Exception_Title(myTest.appointmentTitle,coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if (myTest.calendarIdList.Count == 0 && myTest.resourceIdList.Count == 0)
                {
                    return false;
                }*/
                interfacesValidated.Add(typeof(ICreateAppointment).FullName);
            }
            if (objectUnderValidation is IExceptionOptions)
            {
                IExceptionOptions myTest = objectUnderValidation as IExceptionOptions;
                if (!coreSc.Is_Valid_Exception_Title(myTest.exceptionTitle,coreSc))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.durationMilliseconds < 60000 || (InstantPattern.ExtendedIsoPattern.Parse(myTest.end).Value - InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value).ToTimeSpan().TotalMinutes < 1)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IExceptionOptions).FullName);
            }
            if (objectUnderValidation is IRepeatable)
            {
                IRepeatable myTest = objectUnderValidation as IRepeatable;
                if (!coreSc.Is_Valid_Repeat_Type(myTest.isAAutoGenEvent)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IRepeatable).FullName);
            }
            if (objectUnderValidation is IResourceID)
            {
                IResourceID myTest = objectUnderValidation as IResourceID;
                if (!coreSc.Is_Valid_Resource_ID(coreProject, myTest.resourceId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IResourceID).FullName);
            }
            if (objectUnderValidation is IApplyTo)
            {
                IApplyTo myTest = objectUnderValidation as IApplyTo;
                if (!coreSc.Is_Valid_Apply_To(myTest.applyTo)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IApplyTo).FullName);
            }
            if (objectUnderValidation is ITimeStart)
            {
                ITimeStart myTest = objectUnderValidation as ITimeStart;
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeStart).FullName);
            }
            if (objectUnderValidation is ITimeEnd)
            {
                ITimeEnd myTest = objectUnderValidation as ITimeEnd;
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeEnd).FullName);
            }
            if (objectUnderValidation is IRepeatRules)
            {
                IRepeatRules myTest = objectUnderValidation as IRepeatRules;
                if (myTest.repeatRules.Count > 0)
                {
                    //foreach (BaseRepeat repeatData in myTest.repeatRules)
                    foreach (IRepeat repeatData in myTest.repeatRules)
                    {
                        String errorMessageInternal;
                        if (coreSc.Is_Valid(coreProject, coreSc,coreDb, utils,  repeatData, typeof(IRepeat)))
                        {
                            interfacesValidated.Add(typeof(IRepeatRules).FullName);
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                else if (myTest.repeatRules.Count == 0)
                {
                    interfacesValidated.Add(typeof(IRepeatRules).FullName);
                }
                else
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
            }
            if (objectUnderValidation is IResourceIDList)
            {
                IResourceIDList myTest = objectUnderValidation as IResourceIDList;
                foreach (int resourceId in myTest.resourceIdList)
                {
                    if (!coreSc.Is_Valid_Resource_ID(coreProject, resourceId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IResourceIDList).FullName);
            }
            if (objectUnderValidation is IRepeatOptionsList)
            {
                IRepeatOptionsList myTest = objectUnderValidation as IRepeatOptionsList;
                //if(myTest.repeatRuleOptions.Count == 0)
                //{
                //    return false;
                //}
                //foreach (BaseRepeatOptions repeatOptions in myTest.repeatRuleOptions)
                foreach (IRepeatOptions repeatOptions in myTest.repeatRuleOptions)
                {
                    String errorMessageInternal;
                    if (!coreSc.Is_Valid(coreProject, coreSc, coreDb, utils, repeatOptions, typeof(IRepeatOptions))) { errorMessage = ValidationErrorMessage(); return false; }
                }

                interfacesValidated.Add(typeof(IRepeatOptionsList).FullName);
            }
            if (objectUnderValidation is IBaseCommand)
            {
                IBaseCommand myTest = objectUnderValidation as IBaseCommand;
                if (!coreSc.Is_Valid_User_ID(coreProject, myTest.cmd_user_id, coreDb))
                {
                    if (myTest is IDcDateLatLng && myTest.cmd_user_id == 0)
                    {
                        //this is ok for platform search results
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IBaseCommand).FullName);
            }
            if (objectUnderValidation is IGeneratedOn)
            {
                IGeneratedOn myTest = objectUnderValidation as IGeneratedOn;
                if (!coreSc.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IGeneratedOn).FullName);
            }
            if (objectUnderValidation is ITSOID)
            {
                ITSOID myTest = objectUnderValidation as ITSOID;
                if (!coreSc.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOID).FullName);
            }
            if (objectUnderValidation is IRepeatIDList)
            {
                IRepeatIDList myTest = objectUnderValidation as IRepeatIDList;
                foreach (int repeatId in myTest.repeatIds)
                {
                    if (!coreSc.Is_Valid_Repeat_ID(coreProject, repeatId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IRepeatIDList).FullName);
            }
            if (objectUnderValidation is ITSOComplete)
            {
                ITSOComplete myTest = objectUnderValidation as ITSOComplete;
                if (!coreSc.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb))
                {
                    if (myTest.appointmentId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb))
                {
                    //zero is ok for the TSO obj
                    if (myTest.exceptionId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb))
                {
                    if (myTest.repeatId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                foreach (int resId in myTest.resourceIdList)
                {
                    if (!coreSc.Is_Valid_Resource_ID(coreProject, resId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOComplete).FullName);
            }
            if (objectUnderValidation is ITsoOptions)
            {
                ITsoOptions myTest = objectUnderValidation as ITsoOptions;
                if (!coreSc.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb))
                {
                    if (myTest.appointmentId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb))
                {
                    //zero is ok for the TSO obj
                    if (myTest.exceptionId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb))
                {
                    if (myTest.repeatId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITsoOptions).FullName);
            }
            if (objectUnderValidation is IAppointmentOptions)
            {
                IAppointmentOptions myTest = objectUnderValidation as IAppointmentOptions;
                if (!coreSc.Is_Valid_Appointment_Title(myTest.appointmentTitle,coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.appointmentType == ENUM_SYS_Appointment_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.durationMilliseconds < 60000 || (InstantPattern.ExtendedIsoPattern.Parse(myTest.end).Value - InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value).ToTimeSpan().TotalMinutes < 1)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAppointmentOptions).FullName);

            }
            if (objectUnderValidation is IAppointment)
            {
                IAppointment myTest = objectUnderValidation as IAppointment;
                //no unique properties                
                interfacesValidated.Add(typeof(IAppointment).FullName);
            }
            if (objectUnderValidation is IException)
            {
                IException myTest = objectUnderValidation as IException;
                //no unique properties                
                interfacesValidated.Add(typeof(IException).FullName);
            }
            if (objectUnderValidation is IPassword)
            {
                IPassword myTest = objectUnderValidation as IPassword;
                if (!coreSc.Is_Valid_Password(myTest.password)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IPassword).FullName);
            }
            if (objectUnderValidation is IUserID)
            {
                IUserID myTest = objectUnderValidation as IUserID;
                if (!coreSc.Is_Valid_User_ID(coreProject, myTest.userId, coreDb))
                {
                    if (objectUnderValidation is IDCCreateOrgResource)
                    {
                        IDCCreateOrgResource createResObj = objectUnderValidation as IDCCreateOrgResource;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDCUpdateResource)
                    {
                        IDCUpdateResource createResObj = objectUnderValidation as IDCUpdateResource;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcCreateContact)
                    {
                        IDcCreateContact createResObj = objectUnderValidation as IDcCreateContact;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb) && (createResObj.contactType == ENUM_SYS_ContactType.Customer || createResObj.contactType == ENUM_SYS_ContactType.Supplier))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }

                    }
                    //else if (objectUnderValidation is IDcUpdateOrgContact)
                    else if (objectUnderValidation is IDcUpdateOrgContact)
                    {
                        IDcUpdateOrgContact createResObj = objectUnderValidation as IDcUpdateOrgContact;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb) && (createResObj.contactType == ENUM_SYS_ContactType.Customer || createResObj.contactType == ENUM_SYS_ContactType.Supplier))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }

                    // Need some unit test.
                    else if (objectUnderValidation is IDcCreateOrgAddress)
                    {
                        IDcCreateOrgAddress createResObj = objectUnderValidation as IDcCreateOrgAddress;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcOrgAddressUserId)
                    {
                        IDcOrgAddressUserId createResObj = objectUnderValidation as IDcOrgAddressUserId;
                        if (createResObj.userId == 0 && coreSc.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }

                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IUserID).FullName);
            }
            if (objectUnderValidation is IRepeatRules)
            {
                IRepeatRules myTest = objectUnderValidation as IRepeatRules;
                //foreach (BaseRepeat repeatRule in myTest.repeatRules)
                foreach (IRepeat repeatRule in myTest.repeatRules)
                {
                    String errorMessageInternal;
                    //if (!coreSc.Is_Valid(coreProject, dbs, dbo, utils, coreDb, repeatRule, typeof(BaseRepeat))) { errorMessage = ValidationErrorMessage(); return false; }
                    if (!coreSc.Is_Valid(coreProject, coreSc, coreDb, utils, repeatRule, typeof(IRepeat))) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IRepeatRules).FullName);
            }
            if (objectUnderValidation is IUserOptions)
            {
                IUserOptions myTest = objectUnderValidation as IUserOptions;
                if (!coreSc.Is_Valid_EmailAddress(myTest.emailAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                //if (!coreSc.Is_Valid_User_ID(myTest.userId)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if (!(objectUnderValidation is DC_Create_User))
                {
                    if (!coreSc.Is_Valid_String(myTest.userLastName)) { errorMessage = ValidationErrorMessage(); return false; }
                    if (!coreSc.Is_Valid_String(myTest.userLastName)) { errorMessage = ValidationErrorMessage(); return false;}
                }*/
                interfacesValidated.Add(typeof(IUserOptions).FullName);
            }
            if (objectUnderValidation is ITSOID)
            {
                ITSOID myTest = objectUnderValidation as ITSOID;
                if (!coreSc.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOID).FullName);
            }
            if (objectUnderValidation is ICalendarOptions)
            {
                ICalendarOptions myTest = objectUnderValidation as ICalendarOptions;
                if (!coreSc.Is_Valid_String(myTest.calendarName)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICalendarOptions).FullName);
            }
            if (objectUnderValidation is ICalendarID)
            {
                ICalendarID myTest = objectUnderValidation as ICalendarID;
                if (!coreSc.Is_Valid_Calendar_ID(coreProject, myTest.calendarId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICalendarID).FullName);
            }
            if (objectUnderValidation is IFileID)
            {
                IFileID myTest = objectUnderValidation as IFileID;
                if (!coreSc.Is_Valid_File_ID(coreProject, myTest.fileId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IFileID).FullName);
            }
            if (objectUnderValidation is IResourceOptions)
            {
                IResourceOptions myTest = objectUnderValidation as IResourceOptions;
                if (!coreSc.Is_Valid_BookingOverlap(myTest.allowsOverlaps)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.maxAppointmentDuration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Daily_User_Slot_Limit(myTest.maxDailyUserSlots)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MsDuration(myTest.maxExceptionDuration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Future_Duration(myTest.maxAppointmentFutureTimeInMs)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Resource_Name(myTest.resourceName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_SlotDuration(myTest.slotDuration))
                {
                    if (myTest.timeAllocationType != ENUM_SYS_Resource_Time_Allocation_Type.StaticSlots && myTest.timeAllocationType != ENUM_SYS_Resource_Time_Allocation_Type.DynamicSlots &&
                        myTest.slotDuration == 0)
                    {
                        //this is ok means we are assigning slot duration to null as its not a slot based resource
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!coreSc.Is_Valid_Time_AllocationType((int)myTest.timeAllocationType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (objectUnderValidation is IDCCreateOrgResource || objectUnderValidation is IDCUpdateResource)
                {
                    if (myTest.timeZoneIANA != String.Empty) { errorMessage = ValidationErrorMessage(); return false; }

                }
                else
                {
                    if (!coreSc.Is_Valid_TimeZoneIANA(myTest.timeZoneIANA)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                //both cant be -1
                if (myTest.orgId <= -1 && myTest.userId <= -1 || myTest.orgId == 0 && myTest.userId == 0)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.orgId != 0 && myTest.userId == 0 || myTest.userId != 0 && myTest.orgId == 0)
                {
                    //both arent set so its ok
                }
                else
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IResourceOptions).FullName);
            }
            if (objectUnderValidation is IComponentOptions)
            {
                IComponentOptions myTest = objectUnderValidation as IComponentOptions;
                if (!coreSc.Is_Valid_String(myTest.componentName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_DateTime_String(myTest.componentExpiry_UTC)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Longitude(myTest.longitude)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IComponentOptions).FullName);
            }
            if (objectUnderValidation is IComponentID)
            {
                IComponentID myTest = objectUnderValidation as IComponentID;
                if (!coreSc.Is_Valid_Component_ID(myTest.componentId)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IComponentID).FullName);
            }
            if (objectUnderValidation is ICalendarIDList)
            {
                ICalendarIDList myTest = objectUnderValidation as ICalendarIDList;
                foreach (int calendarId in myTest.calendarIdList)
                {
                    if (!coreSc.Is_Valid_Calendar_ID(coreProject, calendarId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(ICalendarIDList).FullName);
            }
            if (objectUnderValidation is ILocation)
            {
                ILocation myTest = objectUnderValidation as ILocation;
                if (!coreSc.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Longitude(myTest.longitude)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ILocation).FullName);
            }
            if (objectUnderValidation is ITSO)
            {
                ITSO myTest = objectUnderValidation as ITSO;
                interfacesValidated.Add(typeof(ITSO).FullName);
            }
            if (objectUnderValidation is ILocationLimit)
            {
                ILocationLimit myTest = objectUnderValidation as ILocationLimit;
                if (!coreSc.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_Longitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_SearchRange(myTest.limitInMeters)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ILocationLimit).FullName);
            }
            if (objectUnderValidation is ICustomerOrderID)
            {
                ICustomerOrderID myTest = objectUnderValidation as ICustomerOrderID;
                //if (!coreSc.Is_Valid_Order_ID(myTest.Order_ID)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICustomerOrderID).FullName);
            }

            if (objectUnderValidation is IProductOptions)
            {
                IProductOptions myTest = objectUnderValidation as IProductOptions;
                if (!coreSc.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                if (objectUnderValidation is IDcCreateProduct)
                {
                    if (myTest.systemProductCode != String.Empty)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                else
                {
                    if (!coreSc.Is_Valid_String(myTest.systemProductCode)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                if (!coreSc.Is_Valid_String(myTest.productName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_TaxRate(myTest.purchaseTaxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_MoneyValue(myTest.purchasePrice))
                {
                    //if (objectUnderValidation is DC_Create_Org_Product)
                    if (objectUnderValidation is IDcCreateProduct)
                    {
                        if (myTest.purchasePrice.monetaryAmount == 0 && myTest.purchasePrice.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                        {
                            //this is ok it needs to be like this as the backend sets the currency to match the org
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                if (!coreSc.Is_Valid_MoneyValue(myTest.salesPrice))
                {
                    if (objectUnderValidation is IDcCreateProduct)
                    {
                        if (myTest.salesPrice.monetaryAmount == 0 && myTest.salesPrice.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                        {
                            //this is ok it needs to be like this as the backend sets the currency to match the org
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                if (!coreSc.Is_Valid_String(myTest.systemProductCode))
                {
                    if (objectUnderValidation is IDcCreateProduct)
                    {
                        if (myTest.systemProductCode == String.Empty)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                if (!coreSc.Is_Valid_String(myTest.userProductCode))
                {
                    if (objectUnderValidation is IDcCreateProduct && String.IsNullOrEmpty(myTest.userProductCode))
                    {
                        //this is ok
                    }
                    //else if (objectUnderValidation is IDcUpdateOrgProduct && String.IsNullOrEmpty(myTest.userProductCode))
                    else if (objectUnderValidation is IDcUpdateOrgProduct && String.IsNullOrEmpty(myTest.userProductCode))
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage(); return false;
                    }
                }
                if (!coreSc.Is_Valid_TaxRate(myTest.salesTaxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IProductOptions).FullName);
            }
            if (objectUnderValidation is ITSOOptionsList)
            {
                ITSOOptionsList myTest = objectUnderValidation as ITSOOptionsList;
                //foreach (BaseTsoOptions tsoOptions in myTest.listOfTSOOptions)
                foreach (ITsoOptions tsoOptions in myTest.listOfTSOOptions)
                {
                    String errorMessageOut = String.Empty;
                    if (!coreSc.Is_Valid(coreProject, coreSc, coreDb, utils, tsoOptions, typeof(ITsoOptions)))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(ITSOOptionsList).FullName);
            }
            if (objectUnderValidation is ITimeZoneIANA)
            {
                ITimeZoneIANA myTest = objectUnderValidation as ITimeZoneIANA;
                if (objectUnderValidation is IDCCreateOrgResource || objectUnderValidation is IDCUpdateResource)
                {
                    if (myTest.timeZoneIANA != String.Empty) { errorMessage = ValidationErrorMessage(); return false; }
                }
                else
                {
                    if (!coreSc.Is_Valid_TimeZoneIANA(myTest.timeZoneIANA)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(ITimeZoneIANA).FullName);
            }
            if (objectUnderValidation is IEmailAddress)
            {
                IEmailAddress myTest = objectUnderValidation as IEmailAddress;
                if (!coreSc.Is_Valid_EmailAddress(myTest.emailAddress))
                {
                    if ((objectUnderValidation is IContactOptions) && myTest.emailAddress == String.Empty)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IEmailAddress).FullName);
            }
            if (objectUnderValidation is ITSOCompleteList)
            {
                ITSOCompleteList myTest = objectUnderValidation as ITSOCompleteList;
                //no properties defined in this class
                interfacesValidated.Add(typeof(ITSOCompleteList).FullName);
            }
            if (objectUnderValidation is IEmailID)
            {
                IEmailID myTest = objectUnderValidation as IEmailID;
                if (!coreSc.Is_Valid_Email_To_Send_ID(coreProject, myTest.emailId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailID).FullName);
            }
            if (objectUnderValidation is IEmailOptions)
            {
                IEmailOptions myTest = objectUnderValidation as IEmailOptions;
                if (!coreSc.Is_Valid_Email_Message(myTest.emailMessage)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_String(myTest.emailSubject)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_EmailAddress(myTest.toAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailOptions).FullName);
            }
            if (objectUnderValidation is IEmailTo)
            {
                IEmailTo myTest = objectUnderValidation as IEmailTo;
                if (!coreSc.Is_Valid_EmailAddress(myTest.toAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailTo).FullName);
            }
            if (objectUnderValidation is IGuidStr)
            {
                IGuidStr myTest = objectUnderValidation as IGuidStr;
                if (!coreSc.Is_Valid_GuidStr(myTest.guidStr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IGuidStr).FullName);
            }
            if (objectUnderValidation is IName)
            {
                IName myTest = objectUnderValidation as IName;
                if (!coreSc.Is_Valid_NameStr(myTest.name)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IName).FullName);
            }
            if (objectUnderValidation is IServiceOptions)
            {
                IServiceOptions myTest = objectUnderValidation as IServiceOptions;
                //it has no properties of its own
                interfacesValidated.Add(typeof(IServiceOptions).FullName);
            }
            if (objectUnderValidation is IDescription)
            {
                IDescription myTest = objectUnderValidation as IDescription;
                if (!coreSc.Is_Valid_DescriptionStr(myTest.description)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IDescription).FullName);
            }
            if (objectUnderValidation is ICost)
            {
                ICost myTest = objectUnderValidation as ICost;
                if (!coreSc.Is_Valid_Service_Cost(myTest.monetaryAmount, myTest.monetaryCurrency,coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICost).FullName);
            }
            if (objectUnderValidation is ITaxRate)
            {
                ITaxRate myTest = objectUnderValidation as ITaxRate;
                if (!coreSc.Is_Valid_TaxRate(myTest.taxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITaxRate).FullName);
            }
            if (objectUnderValidation is IServiceID)
            {
                IServiceID myTest = objectUnderValidation as IServiceID;
                if (!coreSc.Is_Valid_Service_ID(coreProject, myTest.serviceId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceID).FullName);
            }
            if (objectUnderValidation is IContactOptions)
            {
                IContactOptions myTest = objectUnderValidation as IContactOptions;
                if (!coreSc.Is_Valid_ContactType((int)myTest.contactType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!coreSc.Is_Valid_User_Title((int)myTest.contactTitle)) { errorMessage = ValidationErrorMessage(); return false; }

                if (myTest.contactType == ENUM_SYS_ContactType.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.contactTitle == Enum_SYS_User_Title.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.contactFirstName == String.Empty && myTest.contactLastName == String.Empty)
                {
                    //if either of these are empty then an org must be specified
                    if (myTest.orgName == String.Empty)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (myTest.orgName == String.Empty)
                {
                    //if the org is empty both first + last name must be specified
                    if (myTest.contactFirstName == String.Empty && myTest.contactLastName == String.Empty)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IContactOptions).FullName);
            }
            if (objectUnderValidation is IFirstName)
            {
                IFirstName myTest = objectUnderValidation as IFirstName;
                if (!coreSc.Is_Valid_String(myTest.contactFirstName))
                {
                    if ((objectUnderValidation is IContactOptions) && myTest.contactFirstName == String.Empty)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IFirstName).FullName);
            }
            if (objectUnderValidation is ILastName)
            {
                ILastName myTest = objectUnderValidation as ILastName;
                if (!coreSc.Is_Valid_String(myTest.contactLastName))
                {
                    if ((objectUnderValidation is IContactOptions) && myTest.contactLastName == String.Empty)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(ILastName).FullName);
            }
            if (objectUnderValidation is IContactId)
            {
                IContactId myTest = objectUnderValidation as IContactId;
                if (!coreSc.Is_Valid_Contact_ID(coreProject, myTest.contactId, coreDb)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IContactId).FullName);
            }
            if (objectUnderValidation is IOrgName)
            {
                IOrgName myTest = objectUnderValidation as IOrgName;
                if (!coreSc.Is_Valid_String(myTest.orgName))
                {
                    if (!(objectUnderValidation is IContactOptions))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                    else if (myTest.orgName != String.Empty)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IOrgName).FullName);
            }
            if (objectUnderValidation is IMoneyValue)
            {
                IMoneyValue myTest = objectUnderValidation as IMoneyValue;
                if (!coreSc.Is_Valid_MoneyAmount(myTest.monetaryAmount) || myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown || !Enum.IsDefined(typeof(ENUM_SYS_CurrencyOption), myTest.monetaryCurrency))
                {
                    if (myTest.monetaryAmount == -2 && objectUnderValidation is IDcCreateOrgServiceOrder && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                    {
                        //this is ok when creating a service order
                    }
                    else if (myTest.monetaryAmount == -2 && objectUnderValidation is IDcCreateOrgServiceFulfilmentConfigResourceMap && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                    {
                        //this is ok when creating a resource (!member) based map for service fulfilment configs
                    }
                    else if (myTest.monetaryAmount == -2 && objectUnderValidation is IDcCreateInvoiceableItem && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                    {
                        //this is ok when creating a resource (!member) based map for service fulfilment configs
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IMoneyValue).FullName);
            }
            //if (objectUnderValidation is IServiceResourceMapOptions)
            //{
            //    IServiceResourceMapOptions myTest = objectUnderValidation as IServiceResourceMapOptions;
            //    if (!coreSc.Is_Valid_Service_Relationship(myTest.relationship))
            //    {
            //        return false;
            //    }
            //    interfacesValidated.Add(typeof(IServiceResourceMapOptions).FullName);
            //}
            if (objectUnderValidation is ISalesPrice)
            {
                ISalesPrice myTest = objectUnderValidation as ISalesPrice;
                //it has none of its own values
                interfacesValidated.Add(typeof(ISalesPrice).FullName);
            }
            if (objectUnderValidation is ITimeDuration)
            {
                ITimeDuration myTest = objectUnderValidation as ITimeDuration;
                if (!coreSc.Is_Valid_MsDuration(myTest.durationMilliseconds))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ITimeDuration).FullName);
            }
            if (objectUnderValidation is IFileUploadStream)
            {
                IFileUploadStream myTest = objectUnderValidation as IFileUploadStream;

                interfacesValidated.Add(typeof(IFileUploadStream).FullName);
            }
            if (objectUnderValidation is IFileStream)
            {
                IFileStream myTest = objectUnderValidation as IFileStream;

                //if (myTest.data.length == 0)
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                interfacesValidated.Add(typeof(IFileStream).FullName);
            }
            if (objectUnderValidation is IFileOptions)
            {
                IFileOptions myTest = objectUnderValidation as IFileOptions;
                //no options
                interfacesValidated.Add(typeof(IFileOptions).FullName);
            }
            if (objectUnderValidation is IFileName)
            {
                IFileName myTest = objectUnderValidation as IFileName;
                if (!coreSc.Is_Valid_File_Name(myTest.fileName,coreSc))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IFileName).FullName);
            }
            if (objectUnderValidation is IFileExtension)
            {
                IFileExtension myTest = objectUnderValidation as IFileExtension;
                if (!coreSc.Is_Valid_File_Extension(myTest.fileExtension, coreSc))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IFileExtension).FullName);
            }
            if (objectUnderValidation is ICreatedBy)
            {
                ICreatedBy myTest = objectUnderValidation as ICreatedBy;
                if (!coreSc.Is_Valid_User_ID(coreProject, myTest.createdByUserId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICreatedBy).FullName);
            }
            if (objectUnderValidation is IFileWriteCoreAction)
            {
                IFileWriteCoreAction myTest = objectUnderValidation as IFileWriteCoreAction;
                //no specified properties
                interfacesValidated.Add(typeof(IFileWriteCoreAction).FullName);
            }
            if (objectUnderValidation is ICoreAction)
            {
                ICoreAction myTest = objectUnderValidation as ICoreAction;
                if (myTest.coreAction == ENUM_Core_Function.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICoreAction).FullName);
            }
            if (objectUnderValidation is IStream)
            {
                IStream myTest = objectUnderValidation as IStream;
                if (myTest.streamData == null)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IStream).FullName);
            }
            if (objectUnderValidation is ISha256)
            {
                ISha256 myTest = objectUnderValidation as ISha256;
                if (!coreSc.Is_Valid_SHA256_String(myTest.sha256))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ISha256).FullName);
            }

            if (objectUnderValidation is IFileServiceMap)
            {
                IFileServiceMap myTest = objectUnderValidation as IFileServiceMap;
                //no members
                interfacesValidated.Add(typeof(IFileServiceMap).FullName);
            }
            if (objectUnderValidation is IIsActive)
            {
                IIsActive myTest = objectUnderValidation as IIsActive;
                if (myTest.isActive == ENUM_Activation_State.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IIsActive).FullName);
            }
            if (objectUnderValidation is IAddressID)
            {
                IAddressID myTest = objectUnderValidation as IAddressID;
                if (!coreSc.Is_Valid_Address_ID(coreProject, myTest.addressId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAddressID).FullName);
            }
            if (objectUnderValidation is IAddressOptions)
            {
                IAddressOptions myTest = objectUnderValidation as IAddressOptions;
                if (!coreSc.Is_Valid_Address_String(myTest.address1) || !coreSc.Is_Valid_Address_String(myTest.address2))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_String(myTest.attention) && !coreSc.Is_Valid_String(myTest.city) && !coreSc.Is_Valid_String(myTest.town) && !coreSc.Is_Valid_String(myTest.zipcode))
                if (!coreSc.Is_Valid_String(myTest.attention) || !coreSc.Is_Valid_String(myTest.city) || !coreSc.Is_Valid_String(myTest.town) || !coreSc.Is_Valid_String(myTest.zipcode))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (!coreSc.Is_Valid_CountryLocation(myTest.country))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                // added by saddam
                if (myTest.addressType == ENUM_SYS_AddressType.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }

                interfacesValidated.Add(typeof(IAddressOptions).FullName);
            }
            if (objectUnderValidation is ICountryLocation)
            {
                ICountryLocation myTest = objectUnderValidation as ICountryLocation;
                if (myTest.country == Enum_SYS_Country_Location.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICountryLocation).FullName);
            }

            if (objectUnderValidation is IServiceOrderOptions)
            {
                IServiceOrderOptions myTest = objectUnderValidation as IServiceOrderOptions;

                interfacesValidated.Add(typeof(IServiceOrderOptions).FullName);
            }
            if (objectUnderValidation is IOrderID)
            {
                IOrderID myTest = objectUnderValidation as IOrderID;
                /*if (!coreSc.Is_Valid_Order_ID(myTest.orderId))
                {
                    if (objectUnderValidation is IDcCreateOrgServiceOrder && myTest.orderId == 0)
                    {
                        //this is ok
                    }
                    else
                    {
                        return false;
                    }
                }*/
                interfacesValidated.Add(typeof(IOrderID).FullName);
            }
            if (objectUnderValidation is IPerformedByResourceID)
            {
                IPerformedByResourceID myTest = objectUnderValidation as IPerformedByResourceID;
                if (!coreSc.Is_Valid_Resource_ID(coreProject, myTest.performedByResourceId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPerformedByResourceID).FullName);
            }
            if (objectUnderValidation is IRequireResourceID)
            {
                IRequireResourceID myTest = objectUnderValidation as IRequireResourceID;
                if (!coreSc.Is_Valid_Resource_ID(coreProject, myTest.requireResourceByResourceId, coreDb))
                {
                    if (objectUnderValidation is IDcCreateOrgServiceOrder && myTest.requireResourceByResourceId == 0)
                    {
                        //this is ok
                    }
                    else if (objectUnderValidation is IDcUpdateOrgServiceOrder && myTest.requireResourceByResourceId == 0)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IRequireResourceID).FullName);
            }
            if (objectUnderValidation is ICustomerOrderOptions)
            {
                ICustomerOrderOptions myTest = objectUnderValidation as ICustomerOrderOptions;
                if (!coreSc.Is_Valid_Resource_ID(coreProject, myTest.customerId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICustomerOrderOptions).FullName);
            }
            if (objectUnderValidation is ICustomerID)
            {
                ICustomerID myTest = objectUnderValidation as ICustomerID;
                if (!coreSc.Is_Valid_Resource_ID(coreProject, myTest.customerId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICustomerID).FullName);
            }
            if (objectUnderValidation is IOrgCustomerOrderOptions)
            {
                IOrgCustomerOrderOptions myTest = objectUnderValidation as IOrgCustomerOrderOptions;
                interfacesValidated.Add(typeof(IOrgCustomerOrderOptions).FullName);
            }
            if (objectUnderValidation is IOrderOptions)
            {
                IOrderOptions myTest = objectUnderValidation as IOrderOptions;
                if (myTest.orderState == ENUM_SYS_Order_State.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                else
                {
                    interfacesValidated.Add(typeof(IOrderOptions).FullName);
                }
            }
            if (objectUnderValidation is IServiceOrderId)
            {
                IServiceOrderId myTest = objectUnderValidation as IServiceOrderId;
                if (!coreSc.Is_Valid_ServiceOrder_ID(coreProject, myTest.serviceOrderId, coreDb))
                {
                    if (objectUnderValidation is IDcCreatePayment)
                    {
                        IDcCreatePayment myPayment = objectUnderValidation as IDcCreatePayment;
                        if (coreSc.Is_Valid_Invoice_ID(coreProject, myPayment.invoiceId, coreDb) && myPayment.serviceOrderId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcCreateTempPaypal)
                    {
                        IDcCreateTempPaypal tmpPaypal = objectUnderValidation as IDcCreateTempPaypal;
                        if (coreSc.Is_Valid_Invoice_ID(coreProject, tmpPaypal.invoiceId, coreDb) && tmpPaypal.serviceOrderId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcCreateInvoiceableItem)
                    {
                        IDcCreateInvoiceableItem tmpPaypal = objectUnderValidation as IDcCreateInvoiceableItem;
                        if (coreSc.Is_Valid_Product_ID(coreProject, tmpPaypal.productId, coreDb) && tmpPaypal.serviceOrderId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IServiceOrderId).FullName);
            }
            if (objectUnderValidation is IContactTitle)
            {
                IContactTitle myTest = objectUnderValidation as IContactTitle;
                if (myTest.contactTitle == Enum_SYS_User_Title.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IContactTitle).FullName);
            }
            if (objectUnderValidation is IOrijiAppGUID)
            {
                IOrijiAppGUID myTest = objectUnderValidation as IOrijiAppGUID;

                // Need to resolve
                //if (!coreSc.Is_Valid_GuidStr(myTest.applicationGUID) || !SC_Oriji_App.projectGuids.Contains(myTest.applicationGUID))
                if (!coreSc.Is_Valid_GuidStr(myTest.applicationGUID))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IOrijiAppGUID).FullName);
            }
            if (objectUnderValidation is IRoleName)
            {
                IRoleName myTest = objectUnderValidation as IRoleName;
                if (!coreSc.Is_Valid_Role_Name(myTest.roleName))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleName).FullName);
            }
            if (objectUnderValidation is IRoleID)
            {
                IRoleID myTest = objectUnderValidation as IRoleID;
                if (!coreSc.Is_Valid_Role_ID(coreProject, myTest.roleId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleID).FullName);
            }
            if (objectUnderValidation is IPermissionList)
            {
                IPermissionList myTest = objectUnderValidation as IPermissionList;
                foreach (int permissionId in myTest.permissionList)
                {
                    if (!Enum.IsDefined(typeof(ENUM_Core_Function), permissionId))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IPermissionList).FullName);
            }
            if (objectUnderValidation is IRoleOptions)
            {
                IRoleOptions myTest = objectUnderValidation as IRoleOptions;
                if (!coreSc.Is_Valid_Role_Name(myTest.roleName))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleOptions).FullName);
            }
            if (objectUnderValidation is IInvoiceOptions)
            {
                IInvoiceOptions myTest = objectUnderValidation as IInvoiceOptions;
                // (!coreSc.Is_Valid_MoneyAmount(myTest.monetaryAmount))
                //{
                //    return false;
                //}
                if (myTest.invoiceState == ENUM_SYS_Invoice_State.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IInvoiceOptions).FullName);
            }
            if (objectUnderValidation is IDeadline)
            {
                IDeadline myTest = objectUnderValidation as IDeadline;
                if (!coreSc.Is_Valid_DateTime_String(myTest.deadline_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDeadline).FullName);
            }
            if (objectUnderValidation is ICreatedOn)
            {
                ICreatedOn myTest = objectUnderValidation as ICreatedOn;
                if (!coreSc.Is_Valid_DateTime_String(myTest.createdOn_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICreatedOn).FullName);
            }
            if (objectUnderValidation is IDeliveryDate)
            {
                IDeliveryDate myTest = objectUnderValidation as IDeliveryDate;
                if (!coreSc.Is_Valid_DateTime_String(myTest.deliveryDate_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDeliveryDate).FullName);
            }
            if (objectUnderValidation is IReferenceString)
            {
                IReferenceString myTest = objectUnderValidation as IReferenceString;

                //if (!coreSc.Is_Valid_String(myTest.reference) && myTest.reference != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.reference) && myTest.reference == String.Empty)
                {
                    if (myTest.reference == String.Empty && myTest is IDcCreateInvoice)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IReferenceString).FullName);
            }

            if (objectUnderValidation is IServiceOrderCompleteList)
            {
                IServiceOrderCompleteList myTest = objectUnderValidation as IServiceOrderCompleteList;
                foreach (IServiceOrderComplete serviceOrder in myTest.serviceOrderList)
                {
                    String errorMessageInternal;
                    if (!coreSc.Is_Valid(coreProject, coreSc, coreDb, utils,  serviceOrder, typeof(IServiceOrderComplete)))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IServiceOrderCompleteList).FullName);
            }
            if (objectUnderValidation is IDiscountComplete)
            {
                IDiscountComplete myTest = objectUnderValidation as IDiscountComplete;
                if (myTest.discountType == ENUM_Discount_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDiscountComplete).FullName);
            }
            if (objectUnderValidation is IMonetaryAmount)
            {
                IMonetaryAmount myTest = objectUnderValidation as IMonetaryAmount;
                if (!coreSc.Is_Valid_MoneyAmount(myTest.monetaryAmount))
                {
                    if (myTest is IDcCreateOrgServiceOrder && myTest.monetaryAmount == -2)
                    {
                        //this is ok
                    }
                    else if (myTest is IDcCreateOrgServiceFulfilmentConfigResourceMap && myTest.monetaryAmount == -2)
                    {
                        //this is ok
                    }
                    else if (myTest is IDcCreateInvoiceableItem && myTest.monetaryAmount == -2)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IMonetaryAmount).FullName);
            }
            if (objectUnderValidation is IMonetaryCurrency)
            {
                IMonetaryCurrency myTest = objectUnderValidation as IMonetaryCurrency;
                if (myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                {
                    if (myTest is IDcCreateOrgServiceOrder)
                    {
                        IDcCreateOrgServiceOrder servOrder = myTest as IDcCreateOrgServiceOrder;
                        if (servOrder.monetaryAmount == -2 && servOrder.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (myTest is IDcCreateOrgServiceFulfilmentConfigResourceMap)
                    {
                        IDcCreateOrgServiceFulfilmentConfigResourceMap servOrder = myTest as IDcCreateOrgServiceFulfilmentConfigResourceMap;
                        if (servOrder.monetaryAmount == -2 && servOrder.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (myTest is IDcCreateInvoiceableItem)
                    {
                        IDcCreateInvoiceableItem servOrder = myTest as IDcCreateInvoiceableItem;
                        if (servOrder.monetaryAmount == -2 && servOrder.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IMonetaryCurrency).FullName);
            }
            if (objectUnderValidation is IPercentageValue)
            {
                IPercentageValue myTest = objectUnderValidation as IPercentageValue;
                //if (myTest.percentageValue < 0 && myTest.percentageValue > 100)
                if (myTest.percentageValue < 0 || myTest.percentageValue > 100)

                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPercentageValue).FullName);
            }

            if (objectUnderValidation is IInvoiceID)
            {
                IInvoiceID myTest = objectUnderValidation as IInvoiceID;
                if (!coreSc.Is_Valid_Invoice_ID(coreProject, myTest.invoiceId, coreDb))
                {
                    if (objectUnderValidation is IDcCreateTempPaypal)
                    {
                        IDcCreateTempPaypal tmpPaypal = objectUnderValidation as IDcCreateTempPaypal;
                        if (coreSc.Is_Valid_ServiceOrder_ID(coreProject, tmpPaypal.serviceOrderId, coreDb) && tmpPaypal.invoiceId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (objectUnderValidation is IDcCreatePayment)
                    {
                        IDcCreatePayment tmpPaypal = objectUnderValidation as IDcCreatePayment;
                        if (coreSc.Is_Valid_ServiceOrder_ID(coreProject, tmpPaypal.serviceOrderId, coreDb) && tmpPaypal.invoiceId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IInvoiceID).FullName);
            }
            if (objectUnderValidation is IComputedSalesPrice)
            {
                IComputedSalesPrice myTest = objectUnderValidation as IComputedSalesPrice;
                if (!coreSc.Is_Valid_MoneyValue(myTest.computedMoneyValue))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IComputedSalesPrice).FullName);
            }
            if (objectUnderValidation is IInvoiceableItemOptions)
            {
                IInvoiceableItemOptions myTest = objectUnderValidation as IInvoiceableItemOptions;
                //no specific parameters
                interfacesValidated.Add(typeof(IInvoiceableItemOptions).FullName);
            }
            if (objectUnderValidation is IProductID)
            {
                IProductID myTest = objectUnderValidation as IProductID;
                if (!coreSc.Is_Valid_Product_ID(coreProject, myTest.productId, coreDb))
                {
                    if (myTest.productId == 0 && myTest is IDcCreateInvoiceableItem)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IProductID).FullName);
            }
            if (objectUnderValidation is IPaymentOptions)
            {
                IPaymentOptions myTest = objectUnderValidation as IPaymentOptions;
                if (myTest.paymentType == ENUM_SYS_Payment_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentOptions).FullName);
            }
            if (objectUnderValidation is IPaymentDate)
            {
                IPaymentDate myTest = objectUnderValidation as IPaymentDate;
                if (!coreSc.Is_Valid_DateTime_String(myTest.paymentDate))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentDate).FullName);
            }
            if (objectUnderValidation is IPaymentId)
            {
                IPaymentId myTest = objectUnderValidation as IPaymentId;
                if (!coreSc.Is_Valid_Payment_ID(coreProject, myTest.paymentId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentId).FullName);
            }
            if (objectUnderValidation is IServiceFulfilmentConfigID)
            {
                IServiceFulfilmentConfigID myTest = objectUnderValidation as IServiceFulfilmentConfigID;
                if (!coreSc.Is_Valid_ServiceFulfilmentConfig_ID(coreProject, myTest.serviceFulfilmentConfigId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigID).FullName);
            }
            if (objectUnderValidation is IServiceFulfilmentConfigOptions)
            {
                IServiceFulfilmentConfigOptions myTest = objectUnderValidation as IServiceFulfilmentConfigOptions;
                if (objectUnderValidation is IDcCreateOrgServiceFulfilmentConfig)
                {
                    IDcCreateOrgServiceFulfilmentConfig tmpCreateServFulfil = objectUnderValidation as IDcCreateOrgServiceFulfilmentConfig;
                    if (tmpCreateServFulfil.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        //return true
                    }
                    else
                    {
                        if (tmpCreateServFulfil.numberOfRequiredResources != 0)
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                if (objectUnderValidation is IDcUpdateOrgServiceFulfilmentConfig)
                {
                    IDcUpdateOrgServiceFulfilmentConfig tmpCreateServFulfil = objectUnderValidation as IDcUpdateOrgServiceFulfilmentConfig;
                    if (tmpCreateServFulfil.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        //return true
                    }
                    else
                    {
                        if (tmpCreateServFulfil.numberOfRequiredResources != 0)
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                if (myTest.prePaymentRequired == ENUM_SYS_PrePaymentRequired.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigOptions).FullName);
            }

            if (objectUnderValidation is IServiceFulfilmentConfigResourceMapID)
            {
                IServiceFulfilmentConfigResourceMapID myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMapID;
                if (!coreSc.Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(coreProject, myTest.serviceFulfilmentConfigResourceMapID, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMapID).FullName);
            }
            if (objectUnderValidation is IServiceFulfilmentConfigResourceMapOptions)
            {
                IServiceFulfilmentConfigResourceMapOptions myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMapOptions;
                if (myTest.serviceFulfilmentResourceConfigRelationship == ENUM_SYS_ServiceResource_Relationship.Unknown || myTest.serviceFulfilmentResourceConfigRequiredOptional == ENUM_SYS_ServiceResource_RequiredOptional.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMapOptions).FullName);
            }
            if (objectUnderValidation is IIsPlatform)
            {
                IIsPlatform myTest = objectUnderValidation as IIsPlatform;
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.YesPlatformSpecific && objectUnderValidation is IDcCreateService)
                {
                    IDcCreateService createService = myTest as IDcCreateService;
                    if (createService.cmd_user_id != GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.YesPlatformSpecific && objectUnderValidation is IDcUpdateOrgService)
                {
                    IDcUpdateOrgService updateServiceObj = objectUnderValidation as IDcUpdateOrgService;
                    if (updateServiceObj.cmd_user_id != GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        //only wildcard user can update platform services
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IIsPlatform).FullName);
            }
            if (objectUnderValidation is ITempPaypalOptions)
            {
                ITempPaypalOptions myTest = objectUnderValidation as ITempPaypalOptions;
                // only one property to be validated is paypalkey - no validation routine
                interfacesValidated.Add(typeof(ITempPaypalOptions).FullName);
            }
            if (objectUnderValidation is IPaypalPaymentID)
            {
                IPaypalPaymentID myTest = objectUnderValidation as IPaypalPaymentID;

                interfacesValidated.Add(typeof(IPaypalPaymentID).FullName);
            }
            if (objectUnderValidation is ITempPaypalID)
            {
                ITempPaypalID myTest = objectUnderValidation as ITempPaypalID;
                if (!coreSc.Is_Valid_TempPaypalID(coreProject, myTest.tempPaypalId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ITempPaypalID).FullName);
            }
            if (objectUnderValidation is IGender)
            {
                IGender myTest = objectUnderValidation as IGender;
                if (!coreSc.Is_Valid_Gender(myTest.gender))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IGender).FullName);
            }
            if (objectUnderValidation is IAnimalID)
            {
                IAnimalID myTest = objectUnderValidation as IAnimalID;
                if (!coreSc.Is_Valid_Animal_ID(coreProject, myTest.animalId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAnimalID).FullName);
            }
            if (objectUnderValidation is IAnimalOptions)
            {
                IAnimalOptions myTest = objectUnderValidation as IAnimalOptions;
                if (myTest.animalBreed == ENUM_Animal_Breed.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.animalSpecies == ENUM_Animal_Species.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.bloodGroup == ENUM_Blood_Group.Unknown)
                {
                    //This can be ok
                    //return false;
                }
                if (!coreSc.Is_Valid_DateTime_String(myTest.deceasedDate))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.deceasedStatus == ENUM_Deceased_Status.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.desexedStatus == ENUM_Desexed_Status.Unknown)
                {
                    //This can be ok
                    //return false
                }

                //if (!coreSc.Is_Valid_String(myTest.insuranceReferenceNumber) && myTest.insuranceReferenceNumber != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.insuranceReferenceNumber))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_String(myTest.mainColour) && myTest.mainColour != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.mainColour))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_String(myTest.secondaryColour) && myTest.secondaryColour != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.secondaryColour))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_String(myTest.microchipId) && myTest.microchipId != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.microchipId))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_String(myTest.passportNumber) && myTest.passportNumber != String.Empty)
                if (!coreSc.Is_Valid_String(myTest.passportNumber))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAnimalOptions).FullName);
            }
            if (objectUnderValidation is IMedicalNoteOptions)
            {
                IMedicalNoteOptions myTest = objectUnderValidation as IMedicalNoteOptions;
                if (myTest.medicalNoteType == ENUM_Medical_Note_Type.Unknown || !coreSc.Is_Valid_Long_String(myTest.noteDescription))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalNoteOptions).FullName);
            }
            if (objectUnderValidation is IMedicalRecordId)
            {
                IMedicalRecordId myTest = objectUnderValidation as IMedicalRecordId;
                if (!coreSc.Is_Valid_MedicalRecord_ID(coreProject, myTest.medicalRecordId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalRecordId).FullName);
            }
            if (objectUnderValidation is IMedicalNoteId)
            {
                IMedicalNoteId myTest = objectUnderValidation as IMedicalNoteId;
                if (!coreSc.Is_Valid_MedicalNote_ID(coreProject, myTest.medicalNoteId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalNoteId).FullName);
            }
            if (objectUnderValidation is IMedicalRecordOptions)
            {
                IMedicalRecordOptions myTest = objectUnderValidation as IMedicalRecordOptions;
                //nothing here
                interfacesValidated.Add(typeof(IMedicalRecordOptions).FullName);
            }
            if (objectUnderValidation is IFileServiceFulfilmentConfigMap)
            {
                IFileServiceFulfilmentConfigMap myTest = objectUnderValidation as IFileServiceFulfilmentConfigMap;
                //nothing here
                interfacesValidated.Add(typeof(IFileServiceFulfilmentConfigMap).FullName);
            }
            if (objectUnderValidation is IInvoiceableItemId)
            {
                IInvoiceableItemId myTest = objectUnderValidation as IInvoiceableItemId;
                if (!coreSc.Is_Valid_InvoiceableItem_ID(coreProject, myTest.invoiceableItemId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IInvoiceableItemId).FullName);
            }
            if (objectUnderValidation is IMonetaryCurrency)
            {
                IMonetaryCurrency myTest = objectUnderValidation as IMonetaryCurrency;
                if (!coreSc.Is_Valid_Currency((int)myTest.monetaryCurrency))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMonetaryCurrency).FullName);
            }
            if (objectUnderValidation is INotificationID)
            {
                INotificationID myTest = objectUnderValidation as INotificationID;
                if (!coreSc.Is_Valid_Notification_ID(coreProject, (int)myTest.notificationId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(INotificationID).FullName);
            }
            if (objectUnderValidation is INotification)
            {
                INotification myTest = objectUnderValidation as INotification;
                //no details
                interfacesValidated.Add(typeof(INotification).FullName);
            }
            if (objectUnderValidation is IMoneyString)
            {
                IMoneyString myTest = objectUnderValidation as IMoneyString;
                //no validation required its readonly and runtime generated currently
                interfacesValidated.Add(typeof(IMoneyString).FullName);
            }
            if (objectUnderValidation is IUserLanguageID)
            {
                IUserLanguageID myTest = objectUnderValidation as IUserLanguageID;
                if (myTest.languageKey == ENUM_SYS_LanguageKey.Unknown || !Enum.IsDefined(typeof(ENUM_SYS_LanguageKey), myTest.languageKey))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IUserLanguageID).FullName);
            }
            if (objectUnderValidation is IdOB)
            {
                IdOB myTest = objectUnderValidation as IdOB;
                if (!coreSc.Is_Valid_DateTime_String(myTest.dateOfBirth))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IdOB).FullName);
            }
            if (objectUnderValidation is IRadiusInMeters)
            {
                IRadiusInMeters myTest = objectUnderValidation as IRadiusInMeters;
                if (!coreSc.Is_Valid_Radius(myTest.radiusInMeters))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRadiusInMeters).FullName);
            }
            if (objectUnderValidation is IPageRequest)
            {
                IPageRequest myTest = objectUnderValidation as IPageRequest;
                if (!coreSc.Is_Valid_PageRequest(myTest))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPageRequest).FullName);
            }
            if (objectUnderValidation is IOrgOptions)
            {
                IOrgOptions myTest = objectUnderValidation as IOrgOptions;
                if (!coreSc.Is_Valid_String(myTest.name))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_DateTime_String(myTest.))
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                if (!coreSc.Is_Valid_User_ID(coreProject, myTest.creatorId, coreDb))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!coreSc.Is_Valid_DateTime_String(myTest.Org_Last_Modified_Time))
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                interfacesValidated.Add(typeof(IOrgOptions).FullName);
            }


            if (objectUnderValidation is IDcUpdateAppointment)
            {
                IDcUpdateAppointment myTest = objectUnderValidation as IDcUpdateAppointment;

                // This condition may be need to apply for all enum in is_valid function.
                // This condition become true when we not specify any value to enum variable from unit myTest.updateAppointmentType == 0 
                if (myTest.updateAppointmentType == ENUM_Repeat_UpdateType.Unknown || myTest.updateAppointmentType == 0)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDcUpdateAppointment).FullName);
            }
            if (objectUnderValidation is IBookable)
            {
                IBookable myTest = objectUnderValidation as IBookable;
                //no validation needed
                interfacesValidated.Add(typeof(IBookable).FullName);
            }
            foreach (Type tinterface in objectType.GetInterfaces())
            {
                interfacesInsideClass.Add(tinterface.ToString());
            }
            List<string> ThirdList = interfacesInsideClass.Except(interfacesValidated).ToList();
            if (ThirdList.Count == 0)
            {
                //verify the request doesnt breach there subscription level
                //if (coreDbWithinSubscription(objectUnderValidation, objectType))
                {
                    errorMessage = ValidationOk();
                    return true;
                }
            }
            errorMessage = ValidationErrorMessage();
            return false;
        
    }


        public bool WithinSubscription(ICoreProject coreProject, IUtils utils, ICoreDatabase coreDb, ICoreSc coreSc, IValidation validation, object objectUnderValidation, Type objectType)
        {
            if (objectUnderValidation is IOrgID)
            {
                //its an org related function we should check it
                if (objectUnderValidation is DC_Org_Create_Member)
                {
                    DC_Org_Create_Member castObj = objectUnderValidation as DC_Org_Create_Member;
                    DC_Org_ID orgId = new DC_Org_ID(coreProject);
                    orgId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    orgId.orgId = castObj.orgId;
                    IDcrStringList projectGuid = coreSc.Org_Read_App_GUID(orgId, utils, validation, coreSc, coreDb);
                    if (projectGuid.func_status != ENUM_Cmd_Status.ok)
                    {
                        return false;
                    }
                    IDcrUserList orgMemberDetails = coreSc.Read_All_Org_Members_By_Org_ID(orgId, utils, validation, coreSc, coreDb);
                    if (orgMemberDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        return false;
                    }
                    //read the limit for this user

                    //Need to resolve.
                    //foreach (BaseMonthlyPricePlans pricePlan in SC_Oriji_App.projectPricePlans[projectGuid.StringList.ElementAt(0)])
                    //{

                    //}
                }
            }
            else if (objectUnderValidation is DC_Create_Org)
            {

            }
            else
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_CountryLocation(Enum_SYS_Country_Location countryLocation)
        {
            if (countryLocation != Enum_SYS_Country_Location.Unknown)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Service_Relationship(ENUM_SYS_ServiceResource_Relationship applyTo)
        {
            if (applyTo != ENUM_SYS_ServiceResource_Relationship.Unknown)
            {
                return true;
            }
            return false;
        }
        
        public bool Is_Valid_Latitude(double latitudeToTest)
        {
            return true;
        }

        public bool Is_Valid_Longitude(double longitudeToTest)
        {
            return true;
        }

        public bool Is_Valid_Component_ID(int componentId)
        {
            return true;
        }


        public bool Is_Valid_TaxRate(decimal componentId)
        {
            if (componentId >= 0 && componentId < 100000)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_TaxRate(long componentId)
        {
            return Is_Valid_TaxRate(Convert.ToDecimal(componentId));
        }


        public bool Is_Valid_Price(decimal componentId)
        {
            if (componentId >= 0 && componentId < 10000000)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Service_Cost(decimal costAmount, ENUM_SYS_CurrencyOption currencyValue,ICoreSc coreSc)
        {
            decimal newCurrcency;
            return coreSc.CONVERT_Currency(costAmount, currencyValue, GeneralConfig.DEFAULT_SYSTEM_CURRENCY, out newCurrcency);
        }

        public bool CONVERT_Currency(decimal currencyAmount, ENUM_SYS_CurrencyOption currency, ENUM_SYS_CurrencyOption outputCurrency, out decimal newCurrencyVal)
        {
            newCurrencyVal = 10;
            return true;
        }

        public bool Is_Calendar_Belonging_To_Organisation(int orgId, int calendarId)
        {
            return true;
        }


        public bool Is_Valid_SearchRange(int rangeLimitInMeters)
        {
            return true;
        }

        public bool Is_Valid_Future_Duration(long futureTimeInMs)
        {
            //0 = off 
            return (futureTimeInMs <= GeneralConfig.MAX_RESOURCE_FUTURE_TIME_MS && futureTimeInMs >= 0);
        }

        public bool Is_Valid_File_Name(string fileNameStr,ICoreSc coreSc)
        {
            return coreSc.Is_Valid_String(fileNameStr) && fileNameStr.Length <= GeneralConfig.MAX_FILENAME_LENGTH;
        }
        public bool Is_Valid_GuidStr(string guidStr)
        {
            Guid guid;
            bool resp = Guid.TryParse(guidStr, out guid);
            return resp;
        }

        public bool Is_Valid_File_Extension(string fileExtStr, ICoreSc coreSc)
        {
            return coreSc.Is_Valid_String(fileExtStr) && fileExtStr.Length <= GeneralConfig.MAX_FILEEXT_LENGTH;
        }

        public bool Is_Valid_SHA256_String(string sha256)
        {
            return Regex.IsMatch(sha256, "[A-Fa-f0-9]{64}");
        }


        public bool Is_Valid_Address_ID(ICoreProject coreProject, int addressId, ICoreDatabase coreDb)
        {
            bool addressIsKnown;
            if (coreDb.DB_Is_ID_Known(coreProject, addressId, DB_Base.DBTable_Org_Address_Table, DB_Base.DBTable_Org_Address_Table_ID, out addressIsKnown) == ENUM_DB_Status.DB_SUCCESS)
            {
                return addressIsKnown;
            }
            return false;
        }


        public bool Is_Valid_CoreWebFile_String(string cwfileStr)
        {
            List<String> validCoreWebFileStrings = new List<string> {
                "imgService",
            };
            if (validCoreWebFileStrings.Contains(cwfileStr, StringComparer.OrdinalIgnoreCase))
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_Gender(ENUM_Gender gender)
        {
            if (gender != ENUM_Gender.Unknown)
            {
                return true;
            }
            return false;
        }

        public bool Is_Valid_PageRequest(IPageRequest pageRequest)
        {
            if ((pageRequest.pagingStop > pageRequest.pagingStart || pageRequest.pagingStart == 0 && pageRequest.pagingStop == 0) && pageRequest.pagingStart >= 0 && pageRequest.pagingStop >= 0)
            {
                return true;
            }
            return false;
        }


        public bool Is_Valid_Login(ICoreProject coreProject, string username, string password,ICoreSc coreSc)
        {
            if (coreSc.Is_Valid_EmailAddress(username) && coreSc.Is_Valid_Password(password))
            {
                byte[] hashBytes = new byte[1024];
                DB_Base db = new DB_Base();

                String query = "SELECT " + DB_Base.DBTable_SYS_User_Table_User_PW + " FROM " + DB_Base.DBTable_SYS_User_Table + " WHERE " + DB_Base.DBTable_SYS_User_Table_User_Email + " =@username AND " + DB_Base.DBTable_SYS_User_Table_Site_Registration_State + "=" + (int)ENUM_User_State_In_System.User_Exists_And_Activated +
                    " OR " + DB_Base.DBTable_SYS_User_Table_User_registeredDate + " >= DATEADD(month,-1,GETDATE()) )";
                using (SqlConnection conn = new SqlConnection(coreProject.dbStr))
                {
                    SqlCommand get_user_pw = new SqlCommand(query, conn);
                    get_user_pw.Parameters.AddWithValue("@username", username);
                    if (db != null && !String.IsNullOrEmpty(query) && get_user_pw != null && conn != null)
                    {
                        get_user_pw.Connection.Open();
                        SqlDataReader reader = get_user_pw.ExecuteReader();
                        while (reader.Read())
                        {
                            byte[] binaryString = (byte[])reader[0];
                            PasswordHash hash = new PasswordHash(binaryString);
                            if (hash.Verify(password))
                            {
                                return true;
                            }
                        }
                        get_user_pw.Connection.Close();
                    }
                }
            }
            return false;
        }

        public bool Is_Valid_Radius(int radius)
        {
            if (radius > 0 && radius < 100000)
            {
                return true;
            }

            return false;
        }

        public bool Is_Valid_Notification_ID(ICoreProject coreProject, int notificationId, ICoreDatabase coreDb)
        {
            bool tso_known = false;
            if (notificationId > 0 && notificationId < int.MaxValue)
            {

                if (coreDb.DB_Is_Notification_ID_Known(coreProject, notificationId, out tso_known) == ENUM_DB_Status.DB_SUCCESS)
                {
                    return tso_known;
                }
            }
            return false;
        }

    }
}
