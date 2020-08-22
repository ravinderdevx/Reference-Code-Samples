import {Component, OnInit, Input} from '@angular/core';
import {LoginInfoComponent} from "../../user/login-info/login-info.component";
import { LocalStorageService, AuthService } from '@app/core/services';


@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  @Input() userId: any;
  user: any;

  constructor(private authService: AuthService, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    if(this.userId) {
      this.user = this.localStorageService.getImpersonateUserDetails();
    } else {
      this.user = this.localStorageService.getUserDetail();
    }
  }

}
