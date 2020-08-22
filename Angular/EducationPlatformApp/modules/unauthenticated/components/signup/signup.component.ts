import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Router } from '@angular/router';
import { SignupModel } from 'src/app/core/models/auth.model';
import { LocalStorageService } from 'src/app/core/services';
import { AlertModel } from 'src/app/core/models/alert.model';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignupComponent implements OnInit {

  alert: AlertModel;
 
  SignupFormData:SignupModel={
    email:null,
    registrationcode:null,
    password:null,
    cpassword:null
  }
  data: any;

  constructor( 
      private apiservice: ApiService,
      private messageService: MessageService,
      private router: Router,
      private localStorageService :LocalStorageService
    ) { }

  ngOnInit() { }

  markFormGroupTouched(formGroup: NgForm) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  onSubmit(){
    debugger;
        this.apiservice.register(this.SignupFormData).subscribe(
          response => {
            debugger;
           this.data=response
          //  this.alert = this.messageService.successMessageObject(this.data.Message);
          },
          error => {
           console.log(error);
          
          })
      
  }

}