import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { ApiService } from './../../shared/services/api.service';
import { APIURLS } from './../../shared/common/api_urls';
import { debounce } from 'rxjs/operator/debounce';

@Component({
  selector: 'app-add-medications',
  templateUrl: './add-medications.component.html',
  styleUrls: ['./add-medications.component.css'],
  providers: [ApiService]
})
export class AddMedicationsComponent implements OnInit {

  constructor(
    private _ApiService: ApiService,
    private _FormBuilder: FormBuilder,
    private _sanitizer: DomSanitizer
  ) { }


  MedicationForm: FormGroup;

  ngOnInit() {
    this.MedicationForm = this._FormBuilder.group({
      'Name': [null, Validators.required],
      'Quantity': [null, Validators.required],
      'Dosage': [null, Validators.required],
      'Unit': [null, Validators.required],
      'Form': [null, Validators.required],
      'Method': [null, Validators.required],
      'Indication': [null],
      'Frequency': [null, Validators.required],
      'Duration': [null, Validators.required],
      'StartDate': [null, Validators.required],
      'EndDate': [null, Validators.required],
      'Prescriber': [null, Validators.required],
      'RxNumber': [null, Validators.required],
      'Notes': [null],
      'Active': [null]
    });
  }

  public alert: any = { "alertClass": "", "alertMessage": "" };

  title: string = "Add Medication";

  public SEARCH_MEDICATION_API: string = APIURLS.SEARCH_MEDICATION_API + "?keyword=:my_own_keyword";

  public UnitDropdown: string[] = [
    "mcg", 
    "mg"
  ];

  public FormDropdown: string[] = [
    "Tab",
    "Capsules",
    "Spoon"
  ]

  public MethodDropdown: string[] = [
    "Intervenus",
    "Oral"
  ];

  isFieldValid(field: string) {
    debugger;
    return !this.MedicationForm.get(field).valid && this.MedicationForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  onSubmit() {
    if (this.MedicationForm.valid) {
      this._ApiService.post(APIURLS.CREATE_MEDICATION_API, this.MedicationForm.value).subscribe(
        (data) => {
          if (data.Success == true) {
            this.reset();
            this.alert.alertMessage = "Medication saved sucessfully.";
            this.alert.alertClass = "alert alert-success";
          } else {
            this.alert.alertMessage = data.Message;
            this.alert.alertClass = "alert alert-danger"
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
