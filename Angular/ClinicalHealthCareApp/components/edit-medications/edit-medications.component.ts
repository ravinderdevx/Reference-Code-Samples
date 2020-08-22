import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { APIURLS } from '../../shared/common/api_urls';
import { ApiService } from '../../shared/services/api.service';
import { Messages } from '../../shared/common/messages';

@Component({
  selector: 'app-edit-medications',
  templateUrl: './edit-medications.component.html',
  styleUrls: ['./edit-medications.component.css'],
  providers: [ApiService, DatePipe]
})
export class EditMedicationsComponent implements OnInit {
  
  constructor(
    private _ApiService: ApiService,
    private _FormBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  id: number;
  private sub: any;
  Medication: any;

  MedicationForm: FormGroup;
  
  ngOnInit() {
    debugger;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });

    this.GetMedicationDetailById();

    this.MedicationForm = this._FormBuilder.group({
      'Name': [null, Validators.required],
      'Method': [null, Validators.required],
      'Dosage': [null, Validators.required],
      'Frequency': [null, Validators.required],
      'StartDate': [null, Validators.required],
      'EndDate': [null, Validators.required],
      'Prescriber': [null, Validators.required],
      'RxNumber': [null, Validators.required],
      'Notes': [null],
      'Active': [null]
    });
  }

  title: string = "Update Medication";

  public alert: any = { "alertClass": "", "alertMessage": "" };

  public SEARCH_MEDICATION_API: string = APIURLS.SEARCH_MEDICATION_API + "?keyword=:my_own_keyword";

  public MethodDropdown: string[] = [
    "BLOOD TEST",
    "BUCCAL",
    "BUCCAL SUBLINGU",
    "CATHETER",
    "CAUDAL BLOCK",
    "CAUDAL EPIDURAL",
    "DENTAL",
    "DENTAL INFILTRA",
    "DENTAL INTRAMUS",
    "DENTAL ORAL",
    "DENTAL ORAL TOP",
    "DENTAL SUBCUTAN",
    "DENTAL TOPICAL",
    "EPIDURAL",
    "G TUBE",
    "IM INTRA-ARTICU",
    "IMPLANT",
    "INFILTRATION",
    "INHALATION",
    "INHALATION INTR",
    "INHALATION NASA",
    "INHALATION ORAL",
    "INJECTABLE",
    "INTRA-ARTERIAL",
    "INTRA-ARTICULAR",
    "INTRACARDIAC",
    "INTRACARDIAC IN",
    "INTRACAVERNOSAL",
    "INTRACAVITY",
    "INTRACAVITY INT",
    "INTRADERMAL",
    "INTRADISCAL",
    "INTRALESIONAL",
    "INTRAMUSCULAR",
    "INTRAMUSCULAR I",
    "INTRAOCULAR",
    "INTRAPERITONEAL",
    "INTRAPLEURAL",
    "INTRASPINAL",
    "INTRASYNOVIAL",
    "INTRATHECAL",
    "INTRATHECAL INT",
    "INTRATRACHEAL",
    "INTRAUTERINE",
    "INTRAVASCULAR",
    "INTRAVENOUS",
    "INTRAVENOUS INH",
    "INTRAVENOUS INT",
    "INTRAVESICAL",
    "INTRAVITREAL",
    "IRRIGATION",
    "IV PIGGYBACK",
    "MISCELLANEOUS",
    "MISCELLANEOUS D",
    "MISCELLANEOUS I",
    "MISCELLANEOUS U",
    "NASAL",
    "NASAL ORAL",
    "NG TUBE",
    "NOSE",
    "OPHTHALMIC",
    "OPTHALMIC",
    "ORAL",
    "ORAL INHALATION",
    "ORAL INTRADERMA",
    "ORAL INTRAMUSCU",
    "ORAL MISC INTRA",
    "ORAL TOPICAL",
    "ORAL VAGINAL",
    "OTIC",
    "OTIC INTRAOCULA",
    "PERCUTANEOUS",
    "RECTAL",
    "RECTAL TOPICAL",
    "SUBCUTANEOUS",
    "SUBCUTANEOUS IN",
    "SUBLINGUAL",
    "TOPICAL",
    "TOPICAL DENTAL",
    "TRANSDERMAL",
    "URETHRAL",
    "URINE TEST",
    "URINE/BLOOD TES",
    "URTHRAL",
    "VAGINAL"
  ];

  public FrequencyDropdown: string[] = [
    "once a day",
    "twice a day",
    "three times a day",
    "four times a day",
    "five times a day",
    "once a week",
    "once a month",
    "once every other day",
    "as needed (or other)"
  ];

  GetMedicationDetailById() {
    debugger;
    this._ApiService.get(APIURLS.GET_MEDICATION_API+this.id).subscribe(
      (data) => {
        if(data.Success == true){
          this.Medication = data.medication;
          
          this.MedicationForm.get("Name").setValue(this.Medication.Name);
          this.MedicationForm.get("Method").setValue(this.Medication.Method);
          this.MedicationForm.get("Dosage").setValue(this.Medication.Dosage);
          this.MedicationForm.get("Frequency").setValue(this.Medication.Frequency);
          this.MedicationForm.get("StartDate").setValue(this.transformDate(this.Medication.StartDate));
          this.MedicationForm.get("EndDate").setValue(this.transformDate(this.Medication.EndDate));
          this.MedicationForm.get("Prescriber").setValue(this.Medication.Prescriber);
          this.MedicationForm.get("RxNumber").setValue(this.Medication.RxNumber);
          this.MedicationForm.get("Notes").setValue(this.Medication.Notes);
          this.MedicationForm.get("Active").setValue(this.Medication.Active);
        } else {
          alert(data.error);
        }

    });
  }

  transformDate(date): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  isFieldValid(field: string) {
    return !this.MedicationForm.get(field).valid && this.MedicationForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  UpdateMedication() {
    if (this.MedicationForm.valid) {
      this._ApiService.post(APIURLS.CREATE_MEDICATION_API, this.MedicationForm.value).subscribe(
        (data) => {
          if (data.Success == true) {
            this.reset();
            this.alert.alertMessage = Messages.MEDICATION_UPDATED_SUCCESS;
            this.alert.alertClass = Messages.ALERT_SUCCESS;
          } else {
            this.alert.alertMessage = data.Message;
            this.alert.alertClass = Messages.ALERT_DANGER;
          }
        });
    } else {
      this.validateAllFormFields(this.MedicationForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  reset() {
    this.MedicationForm.reset();
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

}
