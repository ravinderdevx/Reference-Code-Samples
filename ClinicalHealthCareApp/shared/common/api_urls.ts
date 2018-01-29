/*
  Created By   : Harmesh 
  Created Date : 25-11-2017
  Purpose      : This contant file is used store api urls.
*/

// API Application url.
export const SITE_URL: string = 'http://localhost:17453';

export class APIURLS { 
  public static get GET_ALL_MEDICATION_API(): string { return SITE_URL + "/MedicationAPI/GetAllMedicationDetails"; };
  public static get GET_MEDICATION_API(): string { return SITE_URL + "/MedicationAPI/GetMedicationDetailsById?id="; };
  public static get CREATE_MEDICATION_API(): string { return SITE_URL + "/MedicationAPI/SaveMedication"; };
  public static get SEARCH_MEDICATION_API(): string { return SITE_URL + "/MedicationAPI/SearchMedication"; };
}