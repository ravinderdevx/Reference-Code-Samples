import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AlertModel } from 'src/app/core/models/alert.model';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/core/models/auth.model';
import { LocalStorageService } from 'src/app/core/services';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  alert: AlertModel;
  loading: boolean = false;

  messageObject:any;

  loginFormData: LoginModel = {
    email: null,
    password: null
  }
  loginData: any;

  constructor(
    private apiservice: ApiService,
    private messageService: MessageService,
    private router: Router,
    private localStorageService: LocalStorageService
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

    onSubmit() {
    debugger;
    this.loading = true;
    this.loading = true;
    this.apiservice.login(this.loginFormData).subscribe(
      response => {
        debugger;
        this.loginData=response;
        if(this.loginData.Status==true){
          debugger;
        this.localStorageService.storeAuthToken(response.Data.Token);
        this.localStorageService.storeUserDetail(response.Data);
        this.alert = this.messageService.successMessageObject('User created successfully');
        this.router.navigateByUrl("auth/profile");
        }
        else{

          // this.messageService.successMessageObject(this.loginData.Message);
          // this.showMessage(error, 'error');

        }
      },
      error => {
        this.alert=this.messageService.errorMessageObject(error.error.Message);

      })
  

  }
}
