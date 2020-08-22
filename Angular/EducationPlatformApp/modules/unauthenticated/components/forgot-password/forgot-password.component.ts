import { Component, OnInit } from '@angular/core';
import { ForgotPasswordModel } from 'src/app/core/models/forgot.email';
import { ApiService } from '../../services/api.service';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  data: any;
  emailSent: boolean = false;
  verifiedEmail: boolean = false;


  constructor(private apiservice: ApiService) { }

  ngOnInit(): void {
  }
  markFormGroupTouched(formGroup: NgForm) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  forgotPasswordData: ForgotPasswordModel = {
    email: null
  }
  onSubmit() {
    debugger;
    this.apiservice.sendForgotPasswordEmail(this.forgotPasswordData).subscribe(
      response => {
        this.data = response;
        this.emailSent = true;
      },
      error => {
        console.log(error);
      })

  }

}
