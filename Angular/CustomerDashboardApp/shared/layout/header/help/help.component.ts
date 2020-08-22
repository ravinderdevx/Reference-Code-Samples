import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService, LocalStorageService, AuthService } from "@app/core/services";
import { constants } from "@app/config/constants";


@Component({
  selector: "app-help",
  template: `
  <div id="help" class="btn-header transparent pull-right hidden-sm hidden-xs">
    <span><a (click)="openScreenHelpPopUp()" title="Help"><i class="fa fa-question"></i></a></span>
  </div>
  `,
  styles: []
})
export class HelpComponent {
  screenUrl: string;
  windowPopup: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) {
    
  }

  openScreenHelpPopUp() {
    this.screenUrl = this.router.url;
    const currentUrl = window.location.href.split('?')[0];
    const hostUrl = currentUrl.replace(this.screenUrl, '');

    let screenUrlWithoutQueryString = this.screenUrl.split('?')[0];
  
    const top = (screen.availHeight - 600) / 2;
    const left = (screen.availWidth - 800) / 2;
    this.windowPopup = window.open(`${hostUrl}/client/screen-help?screen-url=${screenUrlWithoutQueryString}` , "_blank", "directories=no,height=600,width=800,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no,top=" + top + ",left=" + left);
  }
}
