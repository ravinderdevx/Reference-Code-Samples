import { Component, OnInit, TemplateRef } from '@angular/core';
import {Router} from "@angular/router";


import { AuthService } from '@app/core/services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
 
  registerModel: any = {
    FirstName: null,
    LastName: null,
    Email:null,
    Password: null
  }

  bsModalRef: BsModalRef;
  public termsAgreed = false

  constructor(
    private router: Router,  
    private authService: AuthService,
    private modalService: BsModalService) {}
 
   ngOnInit() {}

  register(event){
    event.preventDefault();

    // this.authService.resendConfirmationEmail(this.registerModel.email).then(response => {
    //   console.log(response);
    // }, error => {
    //   console.log(error.message);
    // })

    this.authService.register(this.registerModel).then(response => {
      console.log(response);
    }, error => {
      console.log(error.message);
    })
    //this.router.navigate(['/dashboard'])
  }

  openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  onTermsAgree(){
    this.termsAgreed = true
    this.bsModalRef.hide()
  }

  onTermsClose(){
    this.bsModalRef.hide()
  }


}
