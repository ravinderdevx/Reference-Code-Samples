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
using ClassLibrary1;
using Core.Configuration;
using CoreDatabase;
using CoreInterfaces.IObjects;
using System.IO;

namespace SCImplementations
{
    public class Validation : IValidation
    {
        private IValidationBelong belong;
        private IValidationDates dates;
        private IValidationEnums enums;
        private IValidationInterfaces interfaces;
        private IValidationLocation location;
        private IValidationNumbers numbers;
        private IValidationStrings strings;
        private IValidationSystem system;
        private IIsValid isValid;

        public Validation(IValidationBelong belong,
                          IValidationDates dates,
                          IValidationEnums enums,
                          IValidationInterfaces interfaces,
                          IValidationLocation location,
                          IValidationNumbers numbers,
                          IValidationStrings strings,
                          IValidationSystem system,
                          IIsValid isValid)

        {
            this.belong = belong;
            this.dates = dates;
            this.enums = enums;
            this.interfaces = interfaces;
            this.location = location;
            this.numbers = numbers;
            this.strings = strings;
            this.system = system;
            this.isValid = isValid;
        }

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


        #region IValidationBelong

        public bool BELONG_Org_Role(ICoreProject coreProject, int orgId, int role_id, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.BELONG_Org_Role(coreProject, orgId, role_id, coreSc, coreDb, coreFactory);
        }

        public bool BELONG_Org_Calendar(ICoreProject coreProject, int orgId, int calendarId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.BELONG_Org_Calendar(coreProject, orgId, calendarId, coreSc, coreDb, coreFactory);
        }
        public bool BELONG_Org_Appointment(ICoreProject coreProject, int orgId, int appointmentId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.BELONG_Org_Appointment(coreProject, orgId, appointmentId, coreSc, coreDb, coreFactory);
        }
        public bool BELONG_Org_Exception(ICoreProject coreProject, int orgId, int exceptionId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.BELONG_Org_Exception(coreProject, orgId, exceptionId, coreSc, coreDb, coreFactory);
        }
        public bool Is_Appointment_Belonging_To_Organisation(ICoreProject coreProject, int orgId, int appointmentId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_Appointment_Belonging_To_Organisation(coreProject, orgId, appointmentId, coreDb, coreFactory);
        }
        public bool Is_Exception_Belonging_To_Organisation(ICoreProject coreProject, int orgId, int exceptionId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_Exception_Belonging_To_Organisation(coreProject, orgId, exceptionId, coreDb, coreFactory);
        }
        public bool Is_Belonging_To_Org(ICoreProject coreProject, object objectToValidate, IUtils utils, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_Belonging_To_Org(coreProject, objectToValidate, utils, coreSc, coreDb, coreFactory);
        }
        public bool Is_Valid_Org_Customer(ICoreProject coreProj, int userId, int orgId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_Valid_Org_Customer(coreProj, userId, orgId, coreDb, coreFactory);
        }
        public bool Is_User_Member_Of_Organisation(ICoreProject coreProject, IUtils utils, int user_id, int orgId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_User_Member_Of_Organisation(coreProject, utils, user_id, orgId, coreDb, coreFactory);
        }
        public bool Is_Calendar_Belonging_To_Organisation(int orgId, int calendarId)
        {
            return belong.Is_Calendar_Belonging_To_Organisation(orgId, calendarId);
        }
        public bool Is_Org_Resource(ICoreProject coreProject, int orgId, int resId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return belong.Is_Org_Resource(coreProject, orgId, resId, coreSc, coreDb, coreFactory);
        }

        #endregion

        #region  IValidationStrings
        public bool Is_Valid_Email_Message(string inputStr)
        {
            return strings.Is_Valid_Email_Message(inputStr);
        }
        public bool Is_Valid_String(string inputStr)
        {
            return strings.Is_Valid_String(inputStr);
        }
        public bool Is_Valid_Long_String(string inputStr)
        {
            return strings.Is_Valid_Long_String(inputStr);
        }
        public bool Is_Valid_NameStr(string inputStr)
        {
            return strings.Is_Valid_NameStr(inputStr);
        }
        public bool Is_Valid_DescriptionStr(string inputStr)
        {
            return strings.Is_Valid_DescriptionStr(inputStr);
        }
        public bool Is_Valid_EmailAddress(string email_addr)
        {
            return strings.Is_Valid_EmailAddress(email_addr);
        }
        public bool Is_Valid_Password(string password)
        {
            return strings.Is_Valid_Password(password);
        }
        public bool Is_Valid_Tag_Name(string categorie_name)
        {
            return strings.Is_Valid_Tag_Name(categorie_name);
        }
        public bool Is_Valid_Organisation_Name(string newOrgName)
        {
            return strings.Is_Valid_Organisation_Name(newOrgName);
        }
        public bool Is_Valid_Role_Name(string role_name)
        {
            return strings.Is_Valid_Role_Name(role_name);
        }

        public bool Is_Valid_Resource_Name(string resource_name)
        {
            return strings.Is_Valid_Resource_Name(resource_name);
        }
        public bool Is_Valid_Component_Name(string component_name)
        {
            return strings.Is_Valid_Component_Name(component_name);
        }
        public bool Is_Valid_Product_Name(string product_name)
        {
            return strings.Is_Valid_Product_Name(product_name);
        }
        public bool Is_Valid_Notification_Message(string notification_message)
        {
            return strings.Is_Valid_Notification_Message(notification_message);
        }
        public bool Is_Valid_Customer_Company_Name(string customer_company_name)
        {
            return strings.Is_Valid_Customer_Company_Name(customer_company_name);
        }
        public bool Is_Valid_Address_String(string address_line)
        {
            return strings.Is_Valid_Address_String(address_line);
        }
        public bool Is_Valid_Post_Code(string post_code, ICountry country_data)
        {
            return strings.Is_Valid_Post_Code(post_code, country_data);
        }
        public bool Is_Valid_Phone_Number(string phone_number, ICountry country_data)
        {
            return strings.Is_Valid_Phone_Number(phone_number, country_data);
        }
        public bool Is_Valid_Appointment_Title(string appointmentTitle, ICoreSc coreSc)
        {
            return strings.Is_Valid_Appointment_Title(appointmentTitle, coreSc);
        }
        public bool Is_Valid_Exception_Title(string exceptionTitle, ICoreSc coreSc)
        {
            return strings.Is_Valid_Exception_Title(exceptionTitle, coreSc);
        }
        public bool Is_Valid_TimeZoneIANA(string timeZoneStr)
        {
            return strings.Is_Valid_TimeZoneIANA(timeZoneStr);
        }
        public bool Is_Valid_File_Name(string fileNameStr, ICoreSc coreSc)
        {
            return strings.Is_Valid_File_Name(fileNameStr, coreSc);
        }

        public bool Is_Valid_File_Extension(string fileExtStr, ICoreSc coreSc)
        {
            return strings.Is_Valid_File_Extension(fileExtStr, coreSc);
        }
        public bool Is_Valid_CoreWebFile_String(string cwfileStr)
        {
            return strings.Is_Valid_CoreWebFile_String(cwfileStr);
        }
        public bool Is_Valid_DateTime_String(string str_date_time)
        {
            return strings.Is_Valid_DateTime_String(str_date_time);
        }
        public bool Is_Known_Email_To_System(ICoreProject coreProject, string email_address, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return strings.Is_Known_Email_To_System(coreProject, email_address, coreSc, coreDb, coreFactory);
        }
        public bool Is_Valid_SHA256_String(string sha256)
        {
            return strings.Is_Valid_SHA256_String(sha256);
        }

        #endregion

        #region IValidationNumbers
        public bool Is_Valid_MsDuration(long durationInMs)
        {
            return numbers.Is_Valid_MsDuration(durationInMs);
        }
        public bool Is_Valid_Categorie_ID(ICoreProject coreProject, int categorie_id, int orgId)
        {
            return numbers.Is_Valid_Categorie_ID(coreProject, categorie_id, orgId);
        }
        public bool Is_Valid_Currency(int value)
        {
            return numbers.Is_Valid_Currency(value);
        }
        public bool Is_Max_Decimal_Places_2(decimal dec)
        {
            return numbers.Is_Max_Decimal_Places_2(dec);
        }
        public bool Is_Valid_Appointment_ID(ICoreProject coreProject, int appointment_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Appointment_ID(coreProject, appointment_id, coreDb, coreFactory);
        }
        public bool Is_Valid_Animal_ID(ICoreProject coreProject, int animalId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Animal_ID(coreProject, animalId, coreDb, coreFactory);
        }
        public bool Is_Valid_MedicalRecord_ID(ICoreProject coreProject, int medicalRecordId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_MedicalRecord_ID(coreProject, medicalRecordId, coreDb, coreFactory);
        }
        public bool Is_Valid_MedicalNote_ID(ICoreProject coreProject, int medicalNoteId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_MedicalNote_ID(coreProject, medicalNoteId, coreDb, coreFactory);
        }
        public bool Is_Valid_InvoiceableItem_ID(ICoreProject coreProject, int invoiceableItemId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_InvoiceableItem_ID(coreProject, invoiceableItemId, coreDb, coreFactory);
        }
        public bool Is_Valid_Notification_ID(ICoreProject coreProject, int notificationId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Notification_ID(coreProject, notificationId, coreDb, coreFactory);
        }
        public bool Is_Valid_TSO_Id(ICoreProject coreProject, int tso_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_TSO_Id(coreProject, tso_id, coreDb, coreFactory);
        }
        public bool Is_Valid_Email_To_Send_ID(ICoreProject coreProject, int email_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Email_To_Send_ID(coreProject, email_id, coreDb, coreFactory);

        }
        public bool Is_Valid_Exception_ID(ICoreProject coreProject, int exception_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Exception_ID(coreProject, exception_id, coreDb, coreFactory);
        }
        public bool Is_Valid_Role_ID(ICoreProject coreProject, int role_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Role_ID(coreProject, role_id, coreDb, coreFactory);
        }
        public bool Is_Valid_Invoice_ID(ICoreProject coreProject, int invoiceId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Invoice_ID(coreProject, invoiceId, coreDb, coreFactory);
        }
        public bool Is_Valid_Product_ID(ICoreProject coreProject, int productId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Product_ID(coreProject, productId, coreDb, coreFactory);
        }
        public bool Is_Valid_Payment_ID(ICoreProject coreProject, int paymentId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Payment_ID(coreProject, paymentId, coreDb, coreFactory);
        }
        public bool Is_Valid_ServiceFulfilmentConfig_ID(ICoreProject coreProject, int serviceFulfilmentConfig, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_ServiceFulfilmentConfig_ID(coreProject, serviceFulfilmentConfig, coreDb, coreFactory);

        }
        public bool Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(ICoreProject coreProject, int serviceFulfilmentConfigResMap, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(coreProject, serviceFulfilmentConfigResMap, coreDb, coreFactory);
        }
        public bool Is_Valid_TempPaypalID(ICoreProject coreProject, int tempPaypalId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_TempPaypalID(coreProject, tempPaypalId, coreDb, coreFactory);
        }
        public bool Is_Valid_Repeat_ID(ICoreProject coreProject, int repeat_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Repeat_ID(coreProject, repeat_id, coreDb, coreFactory);
        }
        public bool Is_Valid_User_ID(ICoreProject coreProject, int user_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_User_ID(coreProject, user_id, coreDb, coreFactory);
        }
        public bool Is_Valid_Org_ID(ICoreProject coreProject, int orgId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Org_ID(coreProject, orgId, coreDb, coreFactory);
        }
        public bool Is_Valid_Categorie_Type_ID(ICoreProject coreProject, int categorie_type_id)
        {
            return numbers.Is_Valid_Categorie_Type_ID(coreProject, categorie_type_id);
        }
        public bool Is_Valid_Resource_Type_ID(int resource_type_id)
        {
            return numbers.Is_Valid_Resource_Type_ID(resource_type_id);
        }
        public bool Is_Valid_Appointment_Type_ID(int appointment_type_id)
        {
            return numbers.Is_Valid_Appointment_Type_ID(appointment_type_id);
        }
        public bool Is_Valid_Exception_Type_ID(int exception_type_id)
        {
            return numbers.Is_Valid_Exception_Type_ID(exception_type_id);
        }
        public bool Is_Valid_Resource_ID(ICoreProject coreProject, int resource_id, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Resource_ID(coreProject, resource_id, coreDb, coreFactory);
        }
        public bool Is_Valid_ServiceOrder_ID(ICoreProject coreProject, int serviceOrderId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_ServiceOrder_ID(coreProject, serviceOrderId, coreDb, coreFactory);
        }
        public bool Is_Valid_Contact_ID(ICoreProject coreProject, int contactId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Contact_ID(coreProject, contactId, coreDb, coreFactory);
        }
        public bool Is_Valid_Service_ID(ICoreProject coreProject, int serviceId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Service_ID(coreProject, serviceId, coreDb, coreFactory);
        }
        public bool Is_Valid_Platform_Service_ID(ICoreProject coreProject, int platformserviceId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Platform_Service_ID(coreProject, platformserviceId, coreDb, coreFactory);
        }
        public bool Is_Valid_Customer_ID(ICoreProject coreProject, int customer_id, int orgId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Customer_ID(coreProject, customer_id, orgId, coreSc, coreDb, coreFactory);
        }
        public bool Is_Valid_Repeat_WeekDay(int weekDayNum)
        {
            return numbers.Is_Valid_Repeat_WeekDay(weekDayNum);
        }
        public bool Is_Valid_WeekDay(int weekDayNum)
        {
            return numbers.Is_Valid_WeekDay(weekDayNum);
        }
        public bool Is_Valid_Repeat_Week(int weekNum)
        {
            return numbers.Is_Valid_Repeat_Week(weekNum);
        }
        public bool Is_Valid_Week(int weekNum)
        {
            return numbers.Is_Valid_Week(weekNum);
        }
        public bool Is_Valid_Day(int day)
        {
            return numbers.Is_Valid_Day(day);
        }
        public bool Is_Valid_Repeat_Limit(int limit)
        {
            return numbers.Is_Valid_Repeat_Limit(limit);
        }
        public bool Is_Valid_Repeat_Day(int day)
        {
            return numbers.Is_Valid_Repeat_Day(day);
        }
        public bool Is_Valid_Repeat_Type(int repeatType)
        {
            return numbers.Is_Valid_Repeat_Type(repeatType);
        }
        public bool Is_Valid_MonthDay(int year, int month, int day)
        {
            return numbers.Is_Valid_MonthDay(year, month, day);
        }
        public bool Is_Valid_Repeat_Month(int month)
        {
            return numbers.Is_Valid_Repeat_Month(month);
        }
        public bool Is_Valid_Month(int month)
        {
            return numbers.Is_Valid_Month(month);
        }
        public bool Is_Valid_Repeat_Year(int year)
        {
            return numbers.Is_Valid_Repeat_Year(year);
        }
        public bool Is_Valid_Year(int year)
        {
            return numbers.Is_Valid_Year(year);
        }
        public bool Is_Valid_Repeat_Modifier(int modifier)
        {
            return numbers.Is_Valid_Repeat_Modifier(modifier);
        }
        public bool Is_Valid_Calendar_ID(ICoreProject coreProject, int calendarId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Calendar_ID(coreProject, calendarId, coreDb, coreFactory);
        }
        public bool Is_Valid_File_ID(ICoreProject coreProject, int fileId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_File_ID(coreProject, fileId, coreDb, coreFactory);
        }
        public bool Is_Valid_Latitude(double latitudeToTest)
        {
            return numbers.Is_Valid_Latitude(latitudeToTest);
        }
        public bool Is_Valid_Longitude(double longitudeToTest)
        {
            return numbers.Is_Valid_Longitude(longitudeToTest);
        }
        public bool Is_Valid_Component_ID(int componentId)
        {
            return numbers.Is_Valid_Component_ID(componentId);
        }
        public bool Is_Valid_TaxRate(decimal componentId)
        {
            return numbers.Is_Valid_TaxRate(componentId);
        }
        public bool Is_Valid_TaxRate(long componentId)
        {
            return numbers.Is_Valid_TaxRate(componentId);
        }
        public bool Is_Valid_Price(decimal componentId)
        {
            return numbers.Is_Valid_Price(componentId);
        }
        public bool Is_Valid_SearchRange(int rangeLimitInMeters)
        {
            return numbers.Is_Valid_SearchRange(rangeLimitInMeters);
        }
        public bool Is_Valid_Future_Duration(long futureTimeInMs)
        {
            return numbers.Is_Valid_Future_Duration(futureTimeInMs);
        }
        public bool Is_Valid_Address_ID(ICoreProject coreProject, int addressId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Address_ID(coreProject, addressId, coreDb, coreFactory);
        }
        public bool Is_Valid_Radius(int radius)
        {
            return numbers.Is_Valid_Radius(radius);
        }
        public bool Is_Valid_Service_Cost(decimal costAmount, ENUM_SYS_CurrencyOption currencyValue, ICoreSc coreSc)
        {
            return numbers.Is_Valid_Service_Cost(costAmount, currencyValue, coreSc);
        }
        public bool Is_Valid_ContactType(int contactType)
        {
            return numbers.Is_Valid_ContactType(contactType);
        }
        public bool Is_Valid_User_Title(int userTitle)
        {
            return numbers.Is_Valid_User_Title(userTitle);
        }
        public bool Is_Valid_Time_AllocationType(int slotLimit)
        {
            return numbers.Is_Valid_Time_AllocationType(slotLimit);
        }
        public bool Is_Valid_Daily_User_Slot_Limit(long slotLimit)
        {
            return numbers.Is_Valid_Daily_User_Slot_Limit(slotLimit);
        }
        public bool Is_Valid_SlotDuration(long slotDuration)
        {
            return numbers.Is_Valid_SlotDuration(slotDuration);
        }
        public bool Is_Valid_MoneyAmount(decimal moneyVal)
        {
            return numbers.Is_Valid_MoneyAmount(moneyVal);
        }
        public bool Is_Valid_Repeat_WeekDay(List<int> weekDayNums)
        {
            return numbers.Is_Valid_Repeat_WeekDay(weekDayNums);
        }
        public bool Is_Valid_Resource_ID_List(ICoreProject coreProject, IList<int> resourceList, int orgId, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return numbers.Is_Valid_Resource_ID_List(coreProject, resourceList, orgId, coreDb, coreFactory);
        }
        public bool Is_Valid_MoneyValue(IMoneyValue value)
        {
            return numbers.Is_Valid_MoneyValue(value);
        }


        #endregion

        #region IValidationEnums
        public bool Is_Valid_BookingOverlap(Enum_SYS_BookingOverlap obj)
        {
            return enums.Is_Valid_BookingOverlap(obj);
        }
        public bool Is_Valid_Repeat_Type(ENUM_Event_Repeat_Type repeatType)
        {
            return enums.Is_Valid_Repeat_Type(repeatType);
        }
        public bool Is_Valid_Apply_To(ENUM_Repeat_Apply_To applyTo)
        {
            return enums.Is_Valid_Apply_To(applyTo);
        }
        public bool Is_Valid_CountryLocation(Enum_SYS_Country_Location countryLocation)
        {
            return enums.Is_Valid_CountryLocation(countryLocation);
        }
        public bool Is_Valid_Service_Relationship(ENUM_SYS_ServiceResource_Relationship applyTo)
        {
            return enums.Is_Valid_Service_Relationship(applyTo);
        }
        public bool Is_Valid_Gender(ENUM_Gender gender)
        {
            return enums.Is_Valid_Gender(gender);
        }
        #endregion

        #region IValidationSystem
        public bool Is_Valid_PageRequest(IPageRequest pageRequest)
        {
            return system.Is_Valid_PageRequest(pageRequest);
        }
        public bool Is_Valid_Login(ICoreProject coreProject, string username, string password, ICoreSc coreSc)
        {
            return system.Is_Valid_Login(coreProject, username, password, coreSc);
        }
        public bool Permissions_User_Can_Do_System_Action(int user_id, ENUM_SYS_Action action_id)
        {
            return system.Permissions_User_Can_Do_System_Action(user_id, action_id);
        }
        public bool Is_Activation_String_Valid(ICoreProject coreProject, int user_id, string activation_string, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {
            return system.Is_Activation_String_Valid(coreProject, user_id, activation_string, coreDb, coreFactory);
        }
        public bool Permissions_User_Can_Do_Core_Action(ICoreProject coreProject, ICoreSc coreSc, ICoreDatabase coreDb, IUtils utils, IFactoryCore coreFactory, int user_id, int orgId, ENUM_Core_Function action_id)
        {
            return system.Permissions_User_Can_Do_Core_Action(coreProject, coreSc, coreDb, utils, coreFactory, user_id, orgId, action_id);
        }
        public bool Is_Valid_Email_ID_Combo(ICoreProject coreProject, string emailAddress, int userId, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory)
        {

            return system.Is_Valid_Email_ID_Combo(coreProject, emailAddress, userId, coreSc, coreDb, coreFactory);
        }
        public bool WithinSubscription(IDC_Base request_obj, IValidation validation, IUtils utils, ICoreSc coreSc, ICoreDatabase coreDb, IFactoryCore coreFactory, object objectUnderValidation, Type objectType)
        {
            return system.WithinSubscription(request_obj, validation, utils, coreSc, coreDb, coreFactory, objectUnderValidation, objectType);
        }

        #endregion

        #region IValidationLocation
        public bool Is_Valid_Location(double lat, double lng)
        {
            return location.Is_Valid_Location(lat, lng);
        }


        #endregion

        #region IValidationInterfaces
        public bool Is_Valid_RepeatParams(IRepeatOptions repeatData, ICoreSc coreSc)
        {
            return interfaces.Is_Valid_RepeatParams(repeatData, coreSc);
        }



        #endregion

        #region IValidationDates

        public bool Is_Valid_DateTime(Instant date_time)
        {
            return dates.Is_Valid_DateTime(date_time);
        }

        public bool Is_Valid_TimeScale(ITimeScale timeScale)
        {
            return dates.Is_Valid_TimeScale(timeScale);
        }

        public bool CheckTimeIsWithinSystemTimeBoundaries(IInstantStartStop startAndStop)
        {
            return dates.CheckTimeIsWithinSystemTimeBoundaries(startAndStop);
        }


        #endregion

        static string ValidationErrorMessage([CallerLineNumber] int lineNumber = 0, [CallerMemberName] string caller = null)
        {
            return "validation failed at line " + lineNumber + " (" + caller + ")";
        }

        private static string ValidationOk()
        {
            return "Validation Ok";
        }

        public bool Is_Valid(ICoreProject coreProject, ICoreSc coreSc, ICoreDatabase coreDb, IUtils utils, IFactoryCore coreFactory, object objectUnderValidation, Type objectType)
        {
            IList<String> interfacesValidated = coreFactory.ListString();
            IList<String> interfacesInsideClass = coreFactory.ListString();
            List<Type> interfacesToValidate = objectType.GetInterfaces().ToList();
            interfacesToValidate.Add(objectType);
            if (interfacesToValidate.Contains(typeof(IDC_Base)))
            {
                IDC_Base myTest = objectUnderValidation as IDC_Base;
                if (numbers.Is_Valid_User_ID(coreProject, myTest.cmd_user_id, coreDb, coreFactory) || myTest.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
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
            if (!belong.Is_Belonging_To_Org(coreProject, objectUnderValidation, utils, coreSc, coreDb, coreFactory))
            {
                errorMessage = ValidationErrorMessage();
                return false;
            }
            if (interfacesToValidate.Contains(typeof(IExceptionID)))
            {
                IExceptionID myTest = objectUnderValidation as IExceptionID;
                if (!numbers.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb, coreFactory))
                {
                    if ((interfacesToValidate.Contains(typeof(ITSO)) && myTest.exceptionId == 0) ||
                        (interfacesToValidate.Contains(typeof(ITsoOptions)) && myTest.exceptionId == 0))
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
            if (interfacesToValidate.Contains(typeof(IAppointmentID)))
            {
                IAppointmentID myTest = objectUnderValidation as IAppointmentID;

                if (!numbers.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb, coreFactory))
                {
                    if ((interfacesToValidate.Contains(typeof(ITSO)) && myTest.appointmentId == 0) ||
                        (interfacesToValidate.Contains(typeof(ITsoOptions)) && myTest.appointmentId == 0 ||
                        interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder)) && myTest.appointmentId == 0)
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
            if (interfacesToValidate.Contains(typeof(INotificationOptions)))
            {
                INotificationOptions myTest = objectUnderValidation as INotificationOptions;
                if (!strings.Is_Valid_Notification_Message(myTest.notificationMessage))
                {
                    errorMessage = ValidationErrorMessage(); return false;
                }
                if (myTest.notificationType == ENUM_Notification_Type.Unknown) { errorMessage = ValidationErrorMessage(); return false; }
                if (myTest.notificationState == ENUM_Notification_State.Unknown) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(INotificationOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrgAppointment)))
            {
                IOrgAppointment myTest = objectUnderValidation as IOrgAppointment;
                if (!numbers.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_Appointment_Title(myTest.appointmentTitle, coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                //if (!coreSc.Is_Valid_Email_ID_Combo(myTest.creatorEmail, myTest.creatorId)) { return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Resource_ID_List(coreProject, myTest.resourceIdList, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!dates.Is_Valid_TimeScale(myTest)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IOrgAppointment).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRepeatOptions)))
            {
                IRepeatOptions myTest = objectUnderValidation as IRepeatOptions;
                if (!numbers.Is_Valid_Repeat_Day(myTest.repeatDay)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Type((int)myTest.repeatType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Month(myTest.repeatMonth)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Week(myTest.repeatWeek)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_WeekDay(myTest.repeatWeekDays)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Year(myTest.repeatYear)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Limit(myTest.maxOccurances)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_Modifier(myTest.modifier)) { errorMessage = ValidationErrorMessage(); return false; }
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
                        if (!numbers.Is_Valid_Day(myTest.repeatDay))
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                }
                interfacesValidated.Add(typeof(IRepeatOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrgID)))
            {
                IOrgID myTest = objectUnderValidation as IOrgID;
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory))
                {
                    if (interfacesToValidate.Contains(typeof(IResourceOptions)))
                    {
                        IResourceOptions createResObj = objectUnderValidation as IResourceOptions;
                        if (createResObj.orgId == 0 && numbers.Is_Valid_User_ID(coreProject, createResObj.userId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IServiceOptions)))
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
                    else if (interfacesToValidate.Contains(typeof(IDcServiceId)))
                    {
                        IDcServiceId serviceIdDetails = objectUnderValidation as IDcServiceId;

                        ITrueFalse isPlatformService = coreFactory.TrueFalse();
                        if (coreDb.DB_Is_Platform_Service_ID_Known(coreProject, serviceIdDetails.serviceId, isPlatformService) != ENUM_DB_Status.DB_SUCCESS)
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                        if (serviceIdDetails.orgId == 0 && isPlatformService.isTrue)
                        {

                            //this 
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                        interfacesValidated.Add(typeof(IDcServiceId).FullName);
                    }
                    else if (interfacesToValidate.Contains(typeof(IContactOptions)))
                    {
                        IContactOptions contactOptions = objectUnderValidation as IContactOptions;
                        if (contactOptions.orgId == 0 && numbers.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IAddressOptions)))
                    {
                        IAddressOptions contactOptions = objectUnderValidation as IAddressOptions;
                        if (contactOptions.orgId == 0 && numbers.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage(); return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcOrgAddressUserId)))
                    {
                        IDcOrgAddressUserId contactOptions = objectUnderValidation as IDcOrgAddressUserId;
                        if (contactOptions.orgId == 0 && numbers.Is_Valid_User_ID(coreProject, contactOptions.userId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    //else if (interfacesToValidate.Contains(typeof(IServiceOrderOptions && interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder)
                    else if (interfacesToValidate.Contains(typeof(IServiceOrderOptions)) && interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder)))
                    {
                        IDcCreateOrgServiceOrder serviceOrderOptions = objectUnderValidation as IDcCreateOrgServiceOrder;
                        if (serviceOrderOptions.orgId == 0 && numbers.Is_Valid_Platform_Service_ID(coreProject, serviceOrderOptions.serviceId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(INotificationOptions)) && interfacesToValidate.Contains(typeof(IDC_Create_Notification)))
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
                    //else if (interfacesToValidate.Contains(typeof(DC_Create_User)
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
                    //else if (interfacesToValidate.Contains(typeof(DC_Create_Org_Contact)
                    //{
                    //    DC_Create_Org_Contact createContactObj = objectUnderValidation as DC_Create_Org_Contact;
                    //    if (createContactObj.orgId == 0 && numbers.Is_Valid_User_ID(createContactObj.userId) && createContactObj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
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
            if (interfacesToValidate.Contains(typeof(IRepeatID)))
            {
                IRepeatID myTest = objectUnderValidation as IRepeatID;
                if (!numbers.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb, coreFactory))
                {
                    if ((interfacesToValidate.Contains(typeof(ITSO)) && myTest.repeatId == 0) ||
                        (interfacesToValidate.Contains(typeof(ITsoOptions)) && myTest.repeatId == 0))
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
            if (interfacesToValidate.Contains(typeof(ICreatorID)))
            {
                ICreatorID myTest = objectUnderValidation as ICreatorID;
                if (!numbers.Is_Valid_User_ID(coreProject, myTest.creatorId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICreatorID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeScale)))
            {
                ITimeScale myTest = objectUnderValidation as ITimeScale;
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (DateTime.Parse(myTest.end) < DateTime.Parse(myTest.start))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //IInstantStartStop tr = new BaseInstantStartStop();
                IInstantStartStop tr = coreFactory.InstantStartStop();

                tr.start = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                //tr.Duration = TimeSpan.FromMilliseconds(myTest.durationMilliseconds);
                tr.stop = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                if (!dates.CheckTimeIsWithinSystemTimeBoundaries(tr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeScale).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeStartEnd)))
            {
                ITimeStartEnd myTest = objectUnderValidation as ITimeStartEnd;
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (DateTime.Parse(myTest.end) < DateTime.Parse(myTest.start))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //BaseInstantStartStop tr = new BaseInstantStartStop();
                IInstantStartStop tr = coreFactory.InstantStartStop();
                tr.start = InstantPattern.ExtendedIsoPattern.Parse(myTest.start).Value;
                tr.stop = InstantPattern.ExtendedIsoPattern.Parse(myTest.end).Value;
                if (!dates.CheckTimeIsWithinSystemTimeBoundaries(tr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeStartEnd).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICreateException)))
            {
                ICreateException myTest = objectUnderValidation as ICreateException;
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!belong.Is_User_Member_Of_Organisation(coreProject, utils, myTest.creatorId, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_Exception_Title(myTest.exceptionTitle, coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if(myTest.calendarIdList.Count == 0 && myTest.resourceIdList.Count == 0)
                {
                    return false;
                }*/
                interfacesValidated.Add(typeof(ICreateException).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICreateAppointment)))
            {
                ICreateAppointment myTest = objectUnderValidation as ICreateAppointment;
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!belong.Is_User_Member_Of_Organisation(coreProject, utils, myTest.creatorId, myTest.orgId, coreDb, coreFactory))
                {
                    if (!belong.Is_Valid_Org_Customer(coreProject, myTest.creatorId, myTest.orgId, coreDb, coreFactory))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_Exception_Title(myTest.appointmentTitle, coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if (myTest.calendarIdList.Count == 0 && myTest.resourceIdList.Count == 0)
                {
                    return false;
                }*/
                interfacesValidated.Add(typeof(ICreateAppointment).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IExceptionOptions)))
            {
                IExceptionOptions myTest = objectUnderValidation as IExceptionOptions;
                if (!strings.Is_Valid_Exception_Title(myTest.exceptionTitle, coreSc))
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
            if (interfacesToValidate.Contains(typeof(IRepeatable)))
            {
                IRepeatable myTest = objectUnderValidation as IRepeatable;
                if (!enums.Is_Valid_Repeat_Type(myTest.isAAutoGenEvent)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IRepeatable).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IResourceID)))
            {
                IResourceID myTest = objectUnderValidation as IResourceID;
                if (!numbers.Is_Valid_Resource_ID(coreProject, myTest.resourceId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IResourceID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IApplyTo)))
            {
                IApplyTo myTest = objectUnderValidation as IApplyTo;
                if (!enums.Is_Valid_Apply_To(myTest.applyTo)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IApplyTo).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeStart)))
            {
                ITimeStart myTest = objectUnderValidation as ITimeStart;
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeStart).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeEnd)))
            {
                ITimeEnd myTest = objectUnderValidation as ITimeEnd;
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITimeEnd).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRepeatRules)))
            {
                IRepeatRules myTest = objectUnderValidation as IRepeatRules;
                if (myTest.repeatRules.Count > 0)
                {
                    //foreach (BaseRepeat repeatData in myTest.repeatRules)
                    foreach (IRepeat repeatData in myTest.repeatRules)
                    {
                        if (isValid.Is_Valid(coreProject, coreSc, coreDb, utils, coreFactory, repeatData, typeof(IRepeat)))
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
            if (interfacesToValidate.Contains(typeof(IResourceIDList)))
            {
                IResourceIDList myTest = objectUnderValidation as IResourceIDList;
                foreach (int resourceId in myTest.resourceIdList)
                {
                    if (!numbers.Is_Valid_Resource_ID(coreProject, resourceId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IResourceIDList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRepeatOptionsList)))
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
                    if (!isValid.Is_Valid(coreProject, coreSc, coreDb, utils, coreFactory, repeatOptions, typeof(IRepeatOptions))) { errorMessage = ValidationErrorMessage(); return false; }
                }

                interfacesValidated.Add(typeof(IRepeatOptionsList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IBaseCommand)))
            {
                IBaseCommand myTest = objectUnderValidation as IBaseCommand;
                if (!numbers.Is_Valid_User_ID(coreProject, myTest.cmd_user_id, coreDb, coreFactory))
                {
                    if (myTest is IDcDateLatLng && myTest.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
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
            if (interfacesToValidate.Contains(typeof(IGeneratedOn)))
            {
                IGeneratedOn myTest = objectUnderValidation as IGeneratedOn;
                if (!strings.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IGeneratedOn).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITSOID)))
            {
                ITSOID myTest = objectUnderValidation as ITSOID;
                if (!numbers.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRepeatIDList)))
            {
                IRepeatIDList myTest = objectUnderValidation as IRepeatIDList;
                foreach (int repeatId in myTest.repeatIds)
                {
                    if (!numbers.Is_Valid_Repeat_ID(coreProject, repeatId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IRepeatIDList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITSOComplete)))
            {
                ITSOComplete myTest = objectUnderValidation as ITSOComplete;
                if (!numbers.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb, coreFactory))
                {
                    if (myTest.appointmentId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!strings.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb, coreFactory))
                {
                    //zero is ok for the TSO obj
                    if (myTest.exceptionId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb, coreFactory))
                {
                    if (myTest.repeatId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                foreach (int resId in myTest.resourceIdList)
                {
                    if (!numbers.Is_Valid_Resource_ID(coreProject, resId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOComplete).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITsoOptions)))
            {
                ITsoOptions myTest = objectUnderValidation as ITsoOptions;
                if (!numbers.Is_Valid_Appointment_ID(coreProject, myTest.appointmentId, coreDb, coreFactory))
                {
                    if (myTest.appointmentId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!strings.Is_Valid_DateTime_String(myTest.dateOfGeneration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Exception_ID(coreProject, myTest.exceptionId, coreDb, coreFactory))
                {
                    //zero is ok for the TSO obj
                    if (myTest.exceptionId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Repeat_ID(coreProject, myTest.repeatId, coreDb, coreFactory))
                {
                    if (myTest.repeatId != 0)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (!strings.Is_Valid_DateTime_String(myTest.start)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.end)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITsoOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAppointmentOptions)))
            {
                IAppointmentOptions myTest = objectUnderValidation as IAppointmentOptions;
                if (!strings.Is_Valid_Appointment_Title(myTest.appointmentTitle, coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
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
            if (interfacesToValidate.Contains(typeof(IAppointment)))
            {
                IAppointment myTest = objectUnderValidation as IAppointment;
                //no unique properties                
                interfacesValidated.Add(typeof(IAppointment).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IException)))
            {
                IException myTest = objectUnderValidation as IException;
                //no unique properties                
                interfacesValidated.Add(typeof(IException).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPassword)))
            {
                IPassword myTest = objectUnderValidation as IPassword;
                if (!strings.Is_Valid_Password(myTest.password)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IPassword).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IUserID)))
            {
                IUserID myTest = objectUnderValidation as IUserID;
                if (!numbers.Is_Valid_User_ID(coreProject, myTest.userId, coreDb, coreFactory))
                {
                    if (interfacesToValidate.Contains(typeof(IDCCreateOrgResource)))
                    {
                        IDCCreateOrgResource createResObj = objectUnderValidation as IDCCreateOrgResource;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDCUpdateResource)))
                    {
                        IDCUpdateResource createResObj = objectUnderValidation as IDCUpdateResource;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcCreateContact)))
                    {
                        IDcCreateContact createResObj = objectUnderValidation as IDcCreateContact;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory) && (createResObj.contactType == ENUM_SYS_ContactType.Customer || createResObj.contactType == ENUM_SYS_ContactType.Supplier))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }

                    }
                    //else if (interfacesToValidate.Contains(typeof(IDcUpdateOrgContact)
                    else if (interfacesToValidate.Contains(typeof(IDcUpdateOrgContact)))
                    {
                        IDcUpdateOrgContact createResObj = objectUnderValidation as IDcUpdateOrgContact;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory) && (createResObj.contactType == ENUM_SYS_ContactType.Customer || createResObj.contactType == ENUM_SYS_ContactType.Supplier))
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
                    else if (interfacesToValidate.Contains(typeof(IDcCreateOrgAddress)))
                    {
                        IDcCreateOrgAddress createResObj = objectUnderValidation as IDcCreateOrgAddress;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcOrgAddressUserId)))
                    {
                        IDcOrgAddressUserId createResObj = objectUnderValidation as IDcOrgAddressUserId;
                        if (createResObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createResObj.orgId, coreDb, coreFactory))
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    // IDC_Create_Notification 
                    else if (interfacesToValidate.Contains(typeof(IDC_Create_Notification)))
                    {
                        IDC_Create_Notification createNotificationObj = objectUnderValidation as IDC_Create_Notification;
                        if (createNotificationObj.userId == 0 && numbers.Is_Valid_Org_ID(coreProject, createNotificationObj.orgId, coreDb, coreFactory))
                        {
                            // this is ok
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
            if (interfacesToValidate.Contains(typeof(IRepeatRules)))
            {
                IRepeatRules myTest = objectUnderValidation as IRepeatRules;
                //foreach (BaseRepeat repeatRule in myTest.repeatRules)
                foreach (IRepeat repeatRule in myTest.repeatRules)
                {
                    String errorMessageInternal;
                    //if (!coreSc.Is_Valid(coreProject, dbs, dbo, utils, coreDb, repeatRule, typeof(BaseRepeat))) { errorMessage = ValidationErrorMessage(); return false; }
                    if (!isValid.Is_Valid(coreProject, coreSc, coreDb, utils, coreFactory, repeatRule, typeof(IRepeat))) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(IRepeatRules).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IUserOptions)))
            {
                IUserOptions myTest = objectUnderValidation as IUserOptions;
                if (!strings.Is_Valid_EmailAddress(myTest.emailAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                //if (!numbers.Is_Valid_User_ID(myTest.userId)) { errorMessage = ValidationErrorMessage(); return false; }
                /*if (!(interfacesToValidate.Contains(typeof(DC_Create_User))
                {
                    if (!strings.Is_Valid_String(myTest.userLastName)) { errorMessage = ValidationErrorMessage(); return false; }
                    if (!strings.Is_Valid_String(myTest.userLastName)) { errorMessage = ValidationErrorMessage(); return false;}
                }*/
                interfacesValidated.Add(typeof(IUserOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITSOID)))
            {
                ITSOID myTest = objectUnderValidation as ITSOID;
                if (!numbers.Is_Valid_TSO_Id(coreProject, myTest.tsoId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITSOID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICalendarOptions)))
            {
                ICalendarOptions myTest = objectUnderValidation as ICalendarOptions;
                if (!strings.Is_Valid_String(myTest.calendarName)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICalendarOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICalendarID)))
            {
                ICalendarID myTest = objectUnderValidation as ICalendarID;
                if (!numbers.Is_Valid_Calendar_ID(coreProject, myTest.calendarId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICalendarID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileID)))
            {
                IFileID myTest = objectUnderValidation as IFileID;
                if (!numbers.Is_Valid_File_ID(coreProject, myTest.fileId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IFileID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IResourceOptions)))
            {
                IResourceOptions myTest = objectUnderValidation as IResourceOptions;
                if (!enums.Is_Valid_BookingOverlap(myTest.allowsOverlaps)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.maxAppointmentDuration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Daily_User_Slot_Limit(myTest.maxDailyUserSlots)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MsDuration(myTest.maxExceptionDuration)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Future_Duration(myTest.maxAppointmentFutureTimeInMs)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_Resource_Name(myTest.resourceName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_SlotDuration(myTest.slotDuration))
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
                if (!numbers.Is_Valid_Time_AllocationType((int)myTest.timeAllocationType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (interfacesToValidate.Contains(typeof(IDCCreateOrgResource)) || interfacesToValidate.Contains(typeof(IDCUpdateResource)))
                {
                    if (myTest.timeZoneIANA != String.Empty) { errorMessage = ValidationErrorMessage(); return false; }

                }
                else
                {
                    if (!strings.Is_Valid_TimeZoneIANA(myTest.timeZoneIANA)) { errorMessage = ValidationErrorMessage(); return false; }
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
            if (interfacesToValidate.Contains(typeof(IComponentOptions)))
            {
                IComponentOptions myTest = objectUnderValidation as IComponentOptions;
                if (!strings.Is_Valid_String(myTest.componentName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_DateTime_String(myTest.componentExpiry_UTC)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Longitude(myTest.longitude)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IComponentOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IComponentID)))
            {
                IComponentID myTest = objectUnderValidation as IComponentID;
                if (!numbers.Is_Valid_Component_ID(myTest.componentId)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IComponentID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICalendarIDList)))
            {
                ICalendarIDList myTest = objectUnderValidation as ICalendarIDList;
                foreach (int calendarId in myTest.calendarIdList)
                {
                    if (!numbers.Is_Valid_Calendar_ID(coreProject, calendarId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(ICalendarIDList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ILocation)))
            {
                ILocation myTest = objectUnderValidation as ILocation;
                if (!numbers.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Longitude(myTest.longitude)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ILocation).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITSO)))
            {
                ITSO myTest = objectUnderValidation as ITSO;
                interfacesValidated.Add(typeof(ITSO).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ILocationLimit)))
            {
                ILocationLimit myTest = objectUnderValidation as ILocationLimit;
                if (!numbers.Is_Valid_Latitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_Longitude(myTest.latitude)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_SearchRange(myTest.limitInMeters)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ILocationLimit).FullName);
            }
            //if (interfacesToValidate.Contains(typeof(ICustomerOrderID)
            //{
            //    ICustomerOrderID myTest = objectUnderValidation as ICustomerOrderID;
            //    //if (!coreSc.Is_Valid_Order_ID(myTest.Order_ID)) { errorMessage = ValidationErrorMessage(); return false; }
            //    interfacesValidated.Add(typeof(ICustomerOrderID).FullName);
            //}

            if (interfacesToValidate.Contains(typeof(IProductOptions)))
            {
                IProductOptions myTest = objectUnderValidation as IProductOptions;
                if (!numbers.Is_Valid_Org_ID(coreProject, myTest.orgId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                if (interfacesToValidate.Contains(typeof(IDcCreateProduct)))
                {
                    if (myTest.systemProductCode != String.Empty)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                else
                {
                    if (!strings.Is_Valid_String(myTest.systemProductCode)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                if (!strings.Is_Valid_String(myTest.productName)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_TaxRate(myTest.purchaseTaxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_MoneyValue(myTest.purchasePrice))
                {
                    //if (interfacesToValidate.Contains(typeof(DC_Create_Org_Product)
                    if (interfacesToValidate.Contains(typeof(IDcCreateProduct)))
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
                if (!numbers.Is_Valid_MoneyValue(myTest.salesPrice))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateProduct)))
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
                if (!strings.Is_Valid_String(myTest.systemProductCode))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateProduct)))
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
                if (!strings.Is_Valid_String(myTest.userProductCode))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateProduct)) && String.IsNullOrEmpty(myTest.userProductCode))
                    {
                        //this is ok
                    }
                    //else if (interfacesToValidate.Contains(typeof(IDcUpdateOrgProduct && String.IsNullOrEmpty(myTest.userProductCode))
                    else if (interfacesToValidate.Contains(typeof(IDcUpdateOrgProduct)) && String.IsNullOrEmpty(myTest.userProductCode))
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage(); return false;
                    }
                }
                if (!numbers.Is_Valid_TaxRate(myTest.salesTaxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IProductOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITSOOptionsList)))
            {
                ITSOOptionsList myTest = objectUnderValidation as ITSOOptionsList;
                //foreach (BaseTsoOptions tsoOptions in myTest.listOfTSOOptions)
                foreach (ITsoOptions tsoOptions in myTest.listOfTSOOptions)
                {
                    String errorMessageOut = String.Empty;
                    if (!isValid.Is_Valid(coreProject, coreSc, coreDb, utils, coreFactory, tsoOptions, typeof(ITsoOptions)))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(ITSOOptionsList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeZoneIANA)))
            {
                ITimeZoneIANA myTest = objectUnderValidation as ITimeZoneIANA;
                if (interfacesToValidate.Contains(typeof(IDCCreateOrgResource)) || interfacesToValidate.Contains(typeof(IDCUpdateResource)))
                {
                    if (myTest.timeZoneIANA != String.Empty) { errorMessage = ValidationErrorMessage(); return false; }
                }
                else
                {
                    if (!strings.Is_Valid_TimeZoneIANA(myTest.timeZoneIANA)) { errorMessage = ValidationErrorMessage(); return false; }
                }
                interfacesValidated.Add(typeof(ITimeZoneIANA).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IEmailAddress)))
            {
                IEmailAddress myTest = objectUnderValidation as IEmailAddress;
                if (!strings.Is_Valid_EmailAddress(myTest.emailAddress))
                {
                    if ((interfacesToValidate.Contains(typeof(IContactOptions))) && myTest.emailAddress == String.Empty)
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
            if (interfacesToValidate.Contains(typeof(ITSOCompleteList)))
            {
                ITSOCompleteList myTest = objectUnderValidation as ITSOCompleteList;
                //no properties defined in this class
                interfacesValidated.Add(typeof(ITSOCompleteList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IEmailID)))
            {
                IEmailID myTest = objectUnderValidation as IEmailID;
                if (!numbers.Is_Valid_Email_To_Send_ID(coreProject, myTest.emailId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IEmailOptions)))
            {
                IEmailOptions myTest = objectUnderValidation as IEmailOptions;
                if (!strings.Is_Valid_Email_Message(myTest.emailMessage)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_String(myTest.emailSubject)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!strings.Is_Valid_EmailAddress(myTest.toAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IEmailTo)))
            {
                IEmailTo myTest = objectUnderValidation as IEmailTo;
                if (!strings.Is_Valid_EmailAddress(myTest.toAddress)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IEmailTo).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IGuidStr)))
            {
                IGuidStr myTest = objectUnderValidation as IGuidStr;
                if (!strings.Is_Valid_GUID_String(myTest.guidStr)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IGuidStr).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IName)))
            {
                IName myTest = objectUnderValidation as IName;
                if (!strings.Is_Valid_NameStr(myTest.name)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IName).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceOptions)))
            {
                IServiceOptions myTest = objectUnderValidation as IServiceOptions;
                //it has no properties of its own
                interfacesValidated.Add(typeof(IServiceOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDescription)))
            {
                IDescription myTest = objectUnderValidation as IDescription;
                if (!strings.Is_Valid_DescriptionStr(myTest.description)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IDescription).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICost)))
            {
                ICost myTest = objectUnderValidation as ICost;
                if (!numbers.Is_Valid_Service_Cost(myTest.monetaryAmount, myTest.monetaryCurrency, coreSc)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ICost).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITaxRate)))
            {
                ITaxRate myTest = objectUnderValidation as ITaxRate;
                if (!numbers.Is_Valid_TaxRate(myTest.taxRate)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(ITaxRate).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceId)))
            {
                IServiceId myTest = objectUnderValidation as IServiceId;
                if (!numbers.Is_Valid_Service_ID(coreProject, myTest.serviceId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IContactOptions)))
            {
                IContactOptions myTest = objectUnderValidation as IContactOptions;
                if (!numbers.Is_Valid_ContactType((int)myTest.contactType)) { errorMessage = ValidationErrorMessage(); return false; }
                if (!numbers.Is_Valid_User_Title((int)myTest.contactTitle)) { errorMessage = ValidationErrorMessage(); return false; }

                if (myTest.contactType == ENUM_SYS_ContactType.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }

                // Modify By   : Saddam
                // Modify Date : 19-06-2017
                if (myTest.contactAcquisition == ENUM_Contact_Acquisition.Unknown)
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
            if (interfacesToValidate.Contains(typeof(IFirstName)))
            {
                IFirstName myTest = objectUnderValidation as IFirstName;
                if (!strings.Is_Valid_String(myTest.contactFirstName))
                {
                    if ((interfacesToValidate.Contains(typeof(IContactOptions))) && myTest.contactFirstName == String.Empty)
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
            if (interfacesToValidate.Contains(typeof(ILastName)))
            {
                ILastName myTest = objectUnderValidation as ILastName;
                if (!strings.Is_Valid_String(myTest.contactLastName))
                {
                    if ((interfacesToValidate.Contains(typeof(IContactOptions))) && myTest.contactLastName == String.Empty)
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
            if (interfacesToValidate.Contains(typeof(IContactId)))
            {
                IContactId myTest = objectUnderValidation as IContactId;
                if (!numbers.Is_Valid_Contact_ID(coreProject, myTest.contactId, coreDb, coreFactory)) { errorMessage = ValidationErrorMessage(); return false; }
                interfacesValidated.Add(typeof(IContactId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrgName)))
            {
                IOrgName myTest = objectUnderValidation as IOrgName;
                if (!strings.Is_Valid_String(myTest.orgName))
                {
                    if (!(interfacesToValidate.Contains(typeof(IContactOptions))))
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
            if (interfacesToValidate.Contains(typeof(IMoneyValue)))
            {
                IMoneyValue myTest = objectUnderValidation as IMoneyValue;
                if (!numbers.Is_Valid_MoneyAmount(myTest.monetaryAmount) || myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown || !Enum.IsDefined(typeof(ENUM_SYS_CurrencyOption), myTest.monetaryCurrency))
                {
                    if (myTest.monetaryAmount == -2 && interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder)) && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                    {
                        //this is ok when creating a service order
                    }
                    else if (myTest.monetaryAmount == -2 && interfacesToValidate.Contains(typeof(IDcCreateOrgServiceFulfilmentConfigResourceMap)) && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
                    {
                        //this is ok when creating a resource (!member) based map for service fulfilment configs
                    }
                    else if (myTest.monetaryAmount == -2 && interfacesToValidate.Contains(typeof(IDcCreateInvoiceableItem)) && myTest.monetaryCurrency == ENUM_SYS_CurrencyOption.Unknown)
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
            //if (interfacesToValidate.Contains(typeof(IServiceResourceMapOptions)
            //{
            //    IServiceResourceMapOptions myTest = objectUnderValidation as IServiceResourceMapOptions;
            //    if (!coreSc.Is_Valid_Service_Relationship(myTest.relationship))
            //    {
            //        return false;
            //    }
            //    interfacesValidated.Add(typeof(IServiceResourceMapOptions).FullName);
            //}
            if (interfacesToValidate.Contains(typeof(ISalesPrice)))
            {
                ISalesPrice myTest = objectUnderValidation as ISalesPrice;
                //it has none of its own values
                interfacesValidated.Add(typeof(ISalesPrice).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITimeDuration)))
            {
                ITimeDuration myTest = objectUnderValidation as ITimeDuration;
                if (!numbers.Is_Valid_MsDuration(myTest.durationMilliseconds))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ITimeDuration).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileUploadStream)))
            {
                IFileUploadStream myTest = objectUnderValidation as IFileUploadStream;

                interfacesValidated.Add(typeof(IFileUploadStream).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileStream)))
            {
                IFileStream myTest = objectUnderValidation as IFileStream;

                //if (myTest.data.length == 0)
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                interfacesValidated.Add(typeof(IFileStream).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileOptions)))
            {
                IFileOptions myTest = objectUnderValidation as IFileOptions;
                //no options
                interfacesValidated.Add(typeof(IFileOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileName)))
            {
                IFileName myTest = objectUnderValidation as IFileName;
                if (!strings.Is_Valid_File_Name(myTest.fileName, coreSc))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IFileName).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileExtension)))
            {
                IFileExtension myTest = objectUnderValidation as IFileExtension;
                if (!strings.Is_Valid_File_Extension(myTest.fileExtension, coreSc))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IFileExtension).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICreatedBy)))
            {
                ICreatedBy myTest = objectUnderValidation as ICreatedBy;
                if (!numbers.Is_Valid_User_ID(coreProject, myTest.createdByUserId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICreatedBy).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileWriteCoreAction)))
            {
                IFileWriteCoreAction myTest = objectUnderValidation as IFileWriteCoreAction;
                //no specified properties
                interfacesValidated.Add(typeof(IFileWriteCoreAction).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICoreAction)))
            {
                ICoreAction myTest = objectUnderValidation as ICoreAction;
                if (myTest.coreAction == ENUM_Core_Function.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICoreAction).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IStream)))
            {
                IStream myTest = objectUnderValidation as IStream;
                if (myTest.streamData == null)




                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IStream).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ISha256)))
            {
                ISha256 myTest = objectUnderValidation as ISha256;
                if (!strings.Is_Valid_SHA256_String(myTest.sha256))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ISha256).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IFileServiceMap)))
            {
                IFileServiceMap myTest = objectUnderValidation as IFileServiceMap;
                //no members
                interfacesValidated.Add(typeof(IFileServiceMap).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IIsActive)))
            {
                IIsActive myTest = objectUnderValidation as IIsActive;
                if (myTest.isActive == ENUM_Activation_State.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IIsActive).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAddressID)))
            {
                IAddressID myTest = objectUnderValidation as IAddressID;
                if (!numbers.Is_Valid_Address_ID(coreProject, myTest.addressId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAddressID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAddressOptions)))
            {
                IAddressOptions myTest = objectUnderValidation as IAddressOptions;
                if (!strings.Is_Valid_Address_String(myTest.address1) || !strings.Is_Valid_Address_String(myTest.address2))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_String(myTest.attention) && !strings.Is_Valid_String(myTest.city) && !strings.Is_Valid_String(myTest.town) && !strings.Is_Valid_String(myTest.zipcode))
                if (!strings.Is_Valid_String(myTest.attention) || !strings.Is_Valid_String(myTest.city) || !strings.Is_Valid_String(myTest.town) || !strings.Is_Valid_String(myTest.zipcode))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (!enums.Is_Valid_CountryLocation(myTest.country))
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
            if (interfacesToValidate.Contains(typeof(ICountryLocation)))
            {
                ICountryLocation myTest = objectUnderValidation as ICountryLocation;
                if (myTest.country == Enum_SYS_Country_Location.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICountryLocation).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IServiceOrderOptions)))
            {
                IServiceOrderOptions myTest = objectUnderValidation as IServiceOrderOptions;

                interfacesValidated.Add(typeof(IServiceOrderOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrderID)))
            {
                IOrderID myTest = objectUnderValidation as IOrderID;
                /*if (!coreSc.Is_Valid_Order_ID(myTest.orderId))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder && myTest.orderId == 0)
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
            if (interfacesToValidate.Contains(typeof(IPerformedByResourceID)))
            {
                IPerformedByResourceID myTest = objectUnderValidation as IPerformedByResourceID;
                if (!numbers.Is_Valid_Resource_ID(coreProject, myTest.performedByResourceId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPerformedByResourceID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRequireResourceID)))
            {
                IRequireResourceID myTest = objectUnderValidation as IRequireResourceID;
                if (!numbers.Is_Valid_Resource_ID(coreProject, myTest.requireResourceByResourceId, coreDb, coreFactory))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateOrgServiceOrder)) && myTest.requireResourceByResourceId == 0)
                    {
                        //this is ok
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcUpdateOrgServiceOrder)) && myTest.requireResourceByResourceId == 0)
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
            //if (interfacesToValidate.Contains(typeof(ICustomerOrderOptions)
            //{
            //    ICustomerOrderOptions myTest = objectUnderValidation as ICustomerOrderOptions;
            //    if (!numbers.Is_Valid_Resource_ID(coreProject, myTest.customerId, coreDb))
            //    {
            //        errorMessage = ValidationErrorMessage();
            //        return false;
            //    }
            //    interfacesValidated.Add(typeof(ICustomerOrderOptions).FullName);
            //}
            //if (interfacesToValidate.Contains(typeof(ICustomerID)
            //{
            //    ICustomerID myTest = objectUnderValidation as ICustomerID;
            //    if (!numbers.Is_Valid_Resource_ID(coreProject, myTest.customerId, coreDb))
            //    {
            //        errorMessage = ValidationErrorMessage();
            //        return false;
            //    }
            //    interfacesValidated.Add(typeof(ICustomerID).FullName);
            //}
            //if (interfacesToValidate.Contains(typeof(IOrgCustomerOrderOptions)
            //{
            //    IOrgCustomerOrderOptions myTest = objectUnderValidation as IOrgCustomerOrderOptions;
            //    interfacesValidated.Add(typeof(IOrgCustomerOrderOptions).FullName);
            //}
            if (interfacesToValidate.Contains(typeof(IOrderOptions)))
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
            if (interfacesToValidate.Contains(typeof(IServiceOrderId)))
            {
                IServiceOrderId myTest = objectUnderValidation as IServiceOrderId;
                if (!numbers.Is_Valid_ServiceOrder_ID(coreProject, myTest.serviceOrderId, coreDb, coreFactory))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreatePayment)))
                    {
                        IDcCreatePayment myPayment = objectUnderValidation as IDcCreatePayment;
                        if (numbers.Is_Valid_Invoice_ID(coreProject, myPayment.invoiceId, coreDb, coreFactory) && myPayment.serviceOrderId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcCreateTempPaypal)))
                    {
                        IDcCreateTempPaypal tmpPaypal = objectUnderValidation as IDcCreateTempPaypal;
                        if (numbers.Is_Valid_Invoice_ID(coreProject, tmpPaypal.invoiceId, coreDb, coreFactory) && tmpPaypal.serviceOrderId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcCreateInvoiceableItem)))
                    {
                        IDcCreateInvoiceableItem tmpPaypal = objectUnderValidation as IDcCreateInvoiceableItem;
                        if (numbers.Is_Valid_Product_ID(coreProject, tmpPaypal.productId, coreDb, coreFactory) && tmpPaypal.serviceOrderId == 0)
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
            if (interfacesToValidate.Contains(typeof(IContactTitle)))
            {
                IContactTitle myTest = objectUnderValidation as IContactTitle;
                if (myTest.contactTitle == Enum_SYS_User_Title.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IContactTitle).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrijiAppGUID)))
            {
                IOrijiAppGUID myTest = objectUnderValidation as IOrijiAppGUID;

                // Need to resolve
                //if (!coreSc.Is_Valid_GUID_String(myTest.applicationGUID) || !SC_Oriji_App.projectGuids.Contains(myTest.applicationGUID))
                if (!strings.Is_Valid_GUID_String(myTest.applicationGUID))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IOrijiAppGUID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRoleName)))
            {
                IRoleName myTest = objectUnderValidation as IRoleName;
                if (!strings.Is_Valid_Role_Name(myTest.roleName))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleName).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRoleID)))
            {
                IRoleID myTest = objectUnderValidation as IRoleID;
                if (!numbers.Is_Valid_Role_ID(coreProject, myTest.roleId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPermissionList)))
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
            if (interfacesToValidate.Contains(typeof(IRoleOptions)))
            {
                IRoleOptions myTest = objectUnderValidation as IRoleOptions;
                if (!strings.Is_Valid_Role_Name(myTest.roleName))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRoleOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IInvoiceOptions)))
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
            if (interfacesToValidate.Contains(typeof(IDeadline)))
            {
                IDeadline myTest = objectUnderValidation as IDeadline;
                if (!strings.Is_Valid_DateTime_String(myTest.deadline_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDeadline).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICreatedOn)))
            {
                ICreatedOn myTest = objectUnderValidation as ICreatedOn;
                if (!strings.Is_Valid_DateTime_String(myTest.createdOn_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ICreatedOn).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDeliveryDate)))
            {
                IDeliveryDate myTest = objectUnderValidation as IDeliveryDate;
                if (!strings.Is_Valid_DateTime_String(myTest.deliveryDate_UTC))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDeliveryDate).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IReferenceString)))
            {
                IReferenceString myTest = objectUnderValidation as IReferenceString;

                //if (!strings.Is_Valid_String(myTest.reference) && myTest.reference != String.Empty)
                if (!strings.Is_Valid_String(myTest.reference) && myTest.reference == String.Empty)
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

            if (interfacesToValidate.Contains(typeof(IServiceOrderCompleteList)))
            {
                IServiceOrderCompleteList myTest = objectUnderValidation as IServiceOrderCompleteList;
                foreach (IServiceOrderComplete serviceOrder in myTest.serviceOrderList)
                {
                    String errorMessageInternal;
                    if (!isValid.Is_Valid(coreProject, coreSc, coreDb, utils, coreFactory, serviceOrder, typeof(IServiceOrderComplete)))
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IServiceOrderCompleteList).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDiscountComplete)))
            {
                IDiscountComplete myTest = objectUnderValidation as IDiscountComplete;
                if (myTest.discountType == ENUM_Discount_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDiscountComplete).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMonetaryAmount)))
            {
                IMonetaryAmount myTest = objectUnderValidation as IMonetaryAmount;
                if (!numbers.Is_Valid_MoneyAmount(myTest.monetaryAmount))
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
            if (interfacesToValidate.Contains(typeof(IMonetaryCurrency)))
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
            if (interfacesToValidate.Contains(typeof(IPercentageValue)))
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

            if (interfacesToValidate.Contains(typeof(IInvoiceID)))
            {
                IInvoiceID myTest = objectUnderValidation as IInvoiceID;
                if (!numbers.Is_Valid_Invoice_ID(coreProject, myTest.invoiceId, coreDb, coreFactory))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateTempPaypal)))
                    {
                        IDcCreateTempPaypal tmpPaypal = objectUnderValidation as IDcCreateTempPaypal;
                        if (numbers.Is_Valid_ServiceOrder_ID(coreProject, tmpPaypal.serviceOrderId, coreDb, coreFactory) && tmpPaypal.invoiceId == 0)
                        {
                            //this is ok
                        }
                        else
                        {
                            errorMessage = ValidationErrorMessage();
                            return false;
                        }
                    }
                    else if (interfacesToValidate.Contains(typeof(IDcCreatePayment)))
                    {
                        IDcCreatePayment tmpPaypal = objectUnderValidation as IDcCreatePayment;
                        if (numbers.Is_Valid_ServiceOrder_ID(coreProject, tmpPaypal.serviceOrderId, coreDb, coreFactory) && tmpPaypal.invoiceId == 0)
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
            if (interfacesToValidate.Contains(typeof(IComputedSalesPrice)))
            {
                IComputedSalesPrice myTest = objectUnderValidation as IComputedSalesPrice;
                if (!numbers.Is_Valid_MoneyValue(myTest.computedMoneyValue))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IComputedSalesPrice).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IInvoiceableItemOptions)))
            {
                IInvoiceableItemOptions myTest = objectUnderValidation as IInvoiceableItemOptions;
                //no specific parameters
                interfacesValidated.Add(typeof(IInvoiceableItemOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IProductID)))
            {
                IProductID myTest = objectUnderValidation as IProductID;
                if (!numbers.Is_Valid_Product_ID(coreProject, myTest.productId, coreDb, coreFactory))
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
            if (interfacesToValidate.Contains(typeof(IPaymentOptions)))
            {
                IPaymentOptions myTest = objectUnderValidation as IPaymentOptions;
                if (myTest.paymentType == ENUM_SYS_Payment_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPaymentDate)))
            {
                IPaymentDate myTest = objectUnderValidation as IPaymentDate;
                if (!strings.Is_Valid_DateTime_String(myTest.paymentDate))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentDate).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPaymentId)))
            {
                IPaymentId myTest = objectUnderValidation as IPaymentId;
                if (!numbers.Is_Valid_Payment_ID(coreProject, myTest.paymentId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPaymentId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigID)))
            {
                IServiceFulfilmentConfigID myTest = objectUnderValidation as IServiceFulfilmentConfigID;
                if (!numbers.Is_Valid_ServiceFulfilmentConfig_ID(coreProject, myTest.serviceFulfilmentConfigId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigOptions)))
            {
                IServiceFulfilmentConfigOptions myTest = objectUnderValidation as IServiceFulfilmentConfigOptions;
                if (interfacesToValidate.Contains(typeof(IDcCreateOrgServiceFulfilmentConfig)))
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
                if (interfacesToValidate.Contains(typeof(IDcUpdateOrgServiceFulfilmentConfig)))
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

            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigResourceMapID)))
            {
                IServiceFulfilmentConfigResourceMapID myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMapID;
                if (!numbers.Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(coreProject, myTest.serviceFulfilmentConfigResourceMapID, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMapID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigResourceMapOptions)))
            {
                IServiceFulfilmentConfigResourceMapOptions myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMapOptions;
                if (myTest.serviceFulfilmentResourceConfigRelationship == ENUM_SYS_ServiceResource_Relationship.Unknown || myTest.serviceFulfilmentResourceConfigRequiredOptional == ENUM_SYS_ServiceResource_RequiredOptional.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMapOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IIsPlatform)))
            {
                IIsPlatform myTest = objectUnderValidation as IIsPlatform;
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.YesPlatformSpecific && interfacesToValidate.Contains(typeof(IDcCreateService)))
                {
                    IDcCreateService createService = myTest as IDcCreateService;
                    if (createService.cmd_user_id != GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                if (myTest.isPlatformSpecific == ENUM_Org_Is_Platform.YesPlatformSpecific && interfacesToValidate.Contains(typeof(IDcUpdateOrgService)))
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
            if (interfacesToValidate.Contains(typeof(ITempPaypalOptions)))
            {
                ITempPaypalOptions myTest = objectUnderValidation as ITempPaypalOptions;
                // only one property to be validated is paypalkey - no validation routine
                interfacesValidated.Add(typeof(ITempPaypalOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPaypalPaymentID)))
            {
                IPaypalPaymentID myTest = objectUnderValidation as IPaypalPaymentID;

                interfacesValidated.Add(typeof(IPaypalPaymentID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITempPaypalID)))
            {
                ITempPaypalID myTest = objectUnderValidation as ITempPaypalID;
                if (!numbers.Is_Valid_TempPaypalID(coreProject, myTest.tempPaypalId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ITempPaypalID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IGender)))
            {
                IGender myTest = objectUnderValidation as IGender;
                if (!enums.Is_Valid_Gender(myTest.gender))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IGender).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAnimalID)))
            {
                IAnimalID myTest = objectUnderValidation as IAnimalID;
                if (!numbers.Is_Valid_Animal_ID(coreProject, myTest.animalId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAnimalID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAnimalOptions)))
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
                if (!strings.Is_Valid_DateTime_String(myTest.deceasedDate))
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

                //if (!strings.Is_Valid_String(myTest.insuranceReferenceNumber) && myTest.insuranceReferenceNumber != String.Empty)
                if (!strings.Is_Valid_String(myTest.insuranceReferenceNumber))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_String(myTest.mainColour) && myTest.mainColour != String.Empty)
                if (!strings.Is_Valid_String(myTest.mainColour))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_String(myTest.secondaryColour) && myTest.secondaryColour != String.Empty)
                if (!strings.Is_Valid_String(myTest.secondaryColour))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_String(myTest.microchipId) && myTest.microchipId != String.Empty)
                if (!strings.Is_Valid_String(myTest.microchipId))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_String(myTest.passportNumber) && myTest.passportNumber != String.Empty)
                if (!strings.Is_Valid_String(myTest.passportNumber))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAnimalOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMedicalNoteOptions)))
            {
                IMedicalNoteOptions myTest = objectUnderValidation as IMedicalNoteOptions;
                if (myTest.medicalNoteType == ENUM_Medical_Note_Type.Unknown || !strings.Is_Valid_Long_String(myTest.noteDescription))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalNoteOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMedicalRecordId)))
            {
                IMedicalRecordId myTest = objectUnderValidation as IMedicalRecordId;
                if (!numbers.Is_Valid_MedicalRecord_ID(coreProject, myTest.medicalRecordId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalRecordId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMedicalNoteId)))
            {
                IMedicalNoteId myTest = objectUnderValidation as IMedicalNoteId;
                if (!numbers.Is_Valid_MedicalNote_ID(coreProject, myTest.medicalNoteId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMedicalNoteId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMedicalRecordOptions)))
            {
                IMedicalRecordOptions myTest = objectUnderValidation as IMedicalRecordOptions;
                //nothing here
                interfacesValidated.Add(typeof(IMedicalRecordOptions).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IFileServiceFulfilmentConfigMap)))
            {
                IFileServiceFulfilmentConfigMap myTest = objectUnderValidation as IFileServiceFulfilmentConfigMap;
                //nothing here
                interfacesValidated.Add(typeof(IFileServiceFulfilmentConfigMap).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IInvoiceableItemId)))
            {
                IInvoiceableItemId myTest = objectUnderValidation as IInvoiceableItemId;
                if (!numbers.Is_Valid_InvoiceableItem_ID(coreProject, myTest.invoiceableItemId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IInvoiceableItemId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMonetaryCurrency)))
            {
                IMonetaryCurrency myTest = objectUnderValidation as IMonetaryCurrency;
                if (!numbers.Is_Valid_Currency((int)myTest.monetaryCurrency))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IMonetaryCurrency).FullName);
            }
            if (interfacesToValidate.Contains(typeof(INotificationID)))
            {
                INotificationID myTest = objectUnderValidation as INotificationID;
                if (!numbers.Is_Valid_Notification_ID(coreProject, (int)myTest.notificationId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(INotificationID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(INotification)))
            {
                INotification myTest = objectUnderValidation as INotification;
                //no details
                interfacesValidated.Add(typeof(INotification).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IMoneyString)))
            {
                IMoneyString myTest = objectUnderValidation as IMoneyString;
                //no validation required its readonly and runtime generated currently
                interfacesValidated.Add(typeof(IMoneyString).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IUserLanguageID)))
            {
                IUserLanguageID myTest = objectUnderValidation as IUserLanguageID;
                if (myTest.languageKey == ENUM_SYS_LanguageKey.Unknown || !Enum.IsDefined(typeof(ENUM_SYS_LanguageKey), myTest.languageKey))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IUserLanguageID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IdOB)))
            {
                IdOB myTest = objectUnderValidation as IdOB;
                if (!strings.Is_Valid_DateTime_String(myTest.dateOfBirth))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IdOB).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IRadiusInMeters)))
            {
                IRadiusInMeters myTest = objectUnderValidation as IRadiusInMeters;
                if (!numbers.Is_Valid_Radius(myTest.radiusInMeters))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IRadiusInMeters).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IPageRequest)))
            {
                IPageRequest myTest = objectUnderValidation as IPageRequest;
                if (!system.Is_Valid_PageRequest(myTest))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IPageRequest).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrgOptions)))
            {
                IOrgOptions myTest = objectUnderValidation as IOrgOptions;
                if (!strings.Is_Valid_String(myTest.orgName))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                //if (!strings.Is_Valid_DateTime_String(myTest.))
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                if (!numbers.Is_Valid_User_ID(coreProject, myTest.creatorId, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }

                // Business Type 
                if (myTest.businessType == Enum_Business_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }

                //if (!strings.Is_Valid_DateTime_String(myTest.Org_Last_Modified_Time))
                //{
                //    errorMessage = ValidationErrorMessage();
                //    return false;
                //}
                interfacesValidated.Add(typeof(IOrgOptions).FullName);
            }


            if (interfacesToValidate.Contains(typeof(IDcUpdateAppointment)))
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
            if (interfacesToValidate.Contains(typeof(IBookable)))
            {
                IBookable myTest = objectUnderValidation as IBookable;
                //no validation needed
                interfacesValidated.Add(typeof(IBookable).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IResourceTimeRange)))
            {
                IResourceTimeRange myTest = objectUnderValidation as IResourceTimeRange;
                //no validation needed
                interfacesValidated.Add(typeof(IResourceTimeRange).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDcResourceId)))
            {
                IDcResourceId myTest = objectUnderValidation as IDcResourceId;
                //no validation needed
                interfacesValidated.Add(typeof(IDcResourceId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ITsoResourceId)))
            {
                ITsoResourceId myTest = objectUnderValidation as ITsoResourceId;
                //no validation needed
                interfacesValidated.Add(typeof(ITsoResourceId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IResourcesTimeRange)))
            {
                IResourcesTimeRange myTest = objectUnderValidation as IResourcesTimeRange;
                //no validation needed
                interfacesValidated.Add(typeof(IResourcesTimeRange).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IOrg)))
            {
                IOrg myTest = objectUnderValidation as IOrg;
                //no validation needed
                interfacesValidated.Add(typeof(IOrg).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IApplicationGUID)))
            {
                IApplicationGUID myTest = objectUnderValidation as IApplicationGUID;
                if (!strings.Is_Valid_String(myTest.applicationGUID))
                {
                    if (interfacesToValidate.Contains(typeof(IDcCreateOrg)))
                    {
                        if (myTest.applicationGUID == String.Empty)
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
                interfacesValidated.Add(typeof(IApplicationGUID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IYid)))
            {

                if (interfacesToValidate.Contains(typeof(IDcCreateOrg)))
                {
                    IYid myTest = objectUnderValidation as IYid;
                    if (myTest.yId == 0)
                    {
                        //this is ok
                    }
                    else
                    {
                        errorMessage = ValidationErrorMessage();
                        return false;
                    }
                }
                interfacesValidated.Add(typeof(IYid).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IisClaimed)))
            {
                IisClaimed myTest = objectUnderValidation as IisClaimed;
                if (myTest.isClaimed == ENUM_Is_Claimed.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IisClaimed).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ISubscriptionDefinitionId)))
            {
                ISubscriptionDefinitionId myTest = objectUnderValidation as ISubscriptionDefinitionId;
                if (myTest.subscriptionDefinitionId != 0)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(ISubscriptionDefinitionId).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IService)))
            {
                IService myTest = objectUnderValidation as IService;
                //no props to validate
                interfacesValidated.Add(typeof(IService).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IWHDValue)))
            {
                IWHDValue myTest = objectUnderValidation as IWHDValue;
                //no props to validate
                interfacesValidated.Add(typeof(IWHDValue).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IWidthValue)))
            {
                IWidthValue myTest = objectUnderValidation as IWidthValue;
                if (myTest.widthValue < 0 || myTest.widthValue > 10000000)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.widthUnitType == Measurement_Unit_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IWidthValue).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IHeightValue)))
            {
                IHeightValue myTest = objectUnderValidation as IHeightValue;
                if (myTest.heightValue < 0 || myTest.heightValue > 10000000)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.heightUnitType == Measurement_Unit_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IHeightValue).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDepthValue)))
            {
                IDepthValue myTest = objectUnderValidation as IDepthValue;
                if (myTest.depthValue < 0 || myTest.depthValue > 10000000)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                if (myTest.depthUnitType == Measurement_Unit_Type.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IDepthValue).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IResource)))
            {
                IResource myTest = objectUnderValidation as IResource;
                //no props to validate
                interfacesValidated.Add(typeof(IResource).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICalendarTimeRange)))
            {
                ICalendarTimeRange myTest = objectUnderValidation as ICalendarTimeRange;
                //no props to validate
                interfacesValidated.Add(typeof(ICalendarTimeRange).FullName);
            }
            if (interfacesToValidate.Contains(typeof(ICalendar)))
            {
                ICalendar myTest = objectUnderValidation as ICalendar;
                //no props to validate
                interfacesValidated.Add(typeof(ICalendar).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IActivationState)))
            {
                IActivationState myTest = objectUnderValidation as IActivationState;
                if (myTest.ActivationState == ENUM_Activation_State.Unknown)
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IActivationState).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IActivationString)))
            {
                IActivationString myTest = objectUnderValidation as IActivationString;
                if (!Is_Valid_GUID_String(myTest.activationString))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IActivationString).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfig)))
            {
                IServiceFulfilmentConfig myTest = objectUnderValidation as IServiceFulfilmentConfig;
                //no props to validate
                interfacesValidated.Add(typeof(IServiceFulfilmentConfig).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigResourceMap)))
            {
                IServiceFulfilmentConfigResourceMap myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMap;
                //no props to validate
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMap).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IDcServiceFulfilmentConfigResourceOptions)))
            {
                IDcServiceFulfilmentConfigResourceOptions myTest = objectUnderValidation as IDcServiceFulfilmentConfigResourceOptions;
                //no props to validate
                interfacesValidated.Add(typeof(IDcServiceFulfilmentConfigResourceOptions).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IServiceFulfilmentConfigResourceMapID)))
            {
                IServiceFulfilmentConfigResourceMapID myTest = objectUnderValidation as IServiceFulfilmentConfigResourceMapID;
                if (!Is_Valid_ServiceFulfilmentConfig_Resource_Map_ID(coreProject, myTest.serviceFulfilmentConfigResourceMapID, coreDb, coreFactory))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IServiceFulfilmentConfigResourceMapID).FullName);
            }
            if (interfacesToValidate.Contains(typeof(IAdvancedOrBasic)))
            {
                IAdvancedOrBasic myTest = objectUnderValidation as IAdvancedOrBasic;
                if (!enums.Is_Valid_AdvancedOrBasic(objectUnderValidation))
                {
                    errorMessage = ValidationErrorMessage();
                    return false;
                }
                interfacesValidated.Add(typeof(IAdvancedOrBasic).FullName);
            }
            // New Added interface validation
            
            if (interfacesToValidate.Contains(typeof(IDcServiceFulfilmentConfigOptions)))
            {
                IDcServiceFulfilmentConfigOptions myTest = objectUnderValidation as IDcServiceFulfilmentConfigOptions;

                // no parameter specification
                interfacesValidated.Add(typeof(IDcServiceFulfilmentConfigOptions).FullName);
            }

            
            if (interfacesToValidate.Contains(typeof(IDcServiceFulfilmentConfig)))
            {
                IDcServiceFulfilmentConfig myTest = objectUnderValidation as IDcServiceFulfilmentConfig;

                // no parameter specification
                interfacesValidated.Add(typeof(IDcServiceFulfilmentConfig).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IDcResource)))
            {
                IDcResource myTest = objectUnderValidation as IDcResource;

                // no parameter specification
                interfacesValidated.Add(typeof(IDcResource).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IDiscountID)))
            {
                IDiscountID myTest = objectUnderValidation as IDiscountID;

                // no parameter specification
                interfacesValidated.Add(typeof(IDiscountID).FullName);
            }

            if (interfacesToValidate.Contains(typeof(IDiscountOptions)))
            {
                IDiscountOptions myTest = objectUnderValidation as IDiscountOptions;

                // no parameter specification
                interfacesValidated.Add(typeof(IDiscountOptions).FullName);
            }
            
            // Created Date : 08.08.2017
            if (interfacesToValidate.Contains(typeof(ICoreDbScope)))
            {
                ICoreDbScope myTest = objectUnderValidation as ICoreDbScope;

                // no parameter specification
                interfacesValidated.Add(typeof(ICoreDbScope).FullName);
            }


            if (interfacesToValidate.Contains(typeof(IDC_Base)))
            {
                IDC_Base myTest = objectUnderValidation as IDC_Base;

                // no parameter specification
                interfacesValidated.Add(typeof(IDC_Base).FullName);
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

        public bool CONVERT_Currency(decimal currencyAmount, ENUM_SYS_CurrencyOption currency, ENUM_SYS_CurrencyOption outputCurrency, out decimal newCurrencyVal)
        {
            newCurrencyVal = 10;
            return true;
        }

        public bool Is_Valid_GUID_String(string stringToTest)
        {
            return strings.Is_Valid_GUID_String(stringToTest);
        }

        public bool Is_Valid_AdvancedOrBasic(object gender)
        {
            return enums.Is_Valid_AdvancedOrBasic(gender);
        }
        
    }
}
