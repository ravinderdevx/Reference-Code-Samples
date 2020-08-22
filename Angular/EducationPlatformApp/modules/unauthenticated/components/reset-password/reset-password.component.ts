import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordModel } from 'src/app/core/models/forgot.email';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  data: any;
  email: string;
  token: string
  constructor(private apiservice: ApiService, private route: ActivatedRoute, private router: Router,
  ) { }


  ngOnInit(): void {
    debugger
    this.email = this.route.snapshot.queryParams.email
    this.token = this.route.snapshot.queryParams.token
    let query = {
      email: this.email,
      token: this.token
    }
    this.apiservice.validateResetPasswordToken(query).subscribe(
      response => {

      },
      error => {
        console.log(error);
      })
  }

  resetPasswordData: ForgotPasswordModel = {
    token: null,
    newpassword: null
  }

  onSubmit() {
    debugger;
    this.resetPasswordData.email = this.email;
    this.resetPasswordData.token = this.token;
    this.apiservice.resetPassword(this.resetPasswordData).subscribe(
      response => {
        this.data = response;
        this.router.navigateByUrl("/login");
      },
      error => {
        console.log(error);
      })
    


  }

}
