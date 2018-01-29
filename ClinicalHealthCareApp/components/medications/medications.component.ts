import { Component, OnInit, TemplateRef } from '@angular/core';

import {ApiService} from './../../shared/services/api.service';
import { APIURLS } from './../../shared/common/api_urls';
import { debounce } from 'rxjs/operator/debounce';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css'],
  providers: [ApiService]
})
export class MedicationsComponent implements OnInit {

  records: Array<any>;
  isDesc: boolean = false;
  column: string = 'CategoryName';
  direction: number;

  Medications:any = [];

  public alert: any = { "alertClass": "", "alertMessage": "" };

  constructor (
              private _ApiService:ApiService
            ) { }

  ngOnInit() {
      this.loadMedications();
  }

  public loadMedications() {
    this._ApiService.get(APIURLS.GET_ALL_MEDICATION_API).subscribe(
      (data) => {
        this.Medications = data.MedicationList;
    });
  }

  sort(property){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };
}
