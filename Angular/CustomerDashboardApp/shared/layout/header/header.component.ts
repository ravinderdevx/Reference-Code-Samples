import {Component, OnInit, ViewChild, HostListener, Input} from '@angular/core';
import {Router} from "@angular/router";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { ModalDirective } from "ngx-bootstrap";
import { AuthService, LocalStorageService, ModalService } from '@app/core/services';
import { environment } from '@env/environment';
declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @ViewChild('SessionExireWarningPopup') sessionExireWarningPopup: ModalDirective;
  
  @Input() configurationMode: boolean;
  @Input() userId: any;
   
  user: any;
  countDown: number;
  searchMobileActive = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private idle: Idle
  ) {

    if(this.localStorageService.isRememberMeChecked() == false) {
      idle.setIdle(environment.sessionTimout - 870);
      idle.setTimeout(60);
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onTimeoutWarning.subscribe((countdown: number) => {
        this.countDown = countdown;
        this.sessionExireWarningPopup.show();
      });

      idle.onIdleEnd.subscribe(() => {
        this.sessionExireWarningPopup.hide();
      });

      idle.onTimeout.subscribe(() => {
        this.sessionExireWarningPopup.hide();
        this.logout();
      });

      idle.watch();
    }
  }

  ngOnInit() {
    this.user = this.localStorageService.getUserDetail();  
  }

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);
  }

  showSessionWarningPopup() {
    this.modalService.openModal(this.sessionExireWarningPopup);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  logout() {
    this.idle.stop();
    this.idle.ngOnDestroy(); //includes this.idle.stop() and this.clearInterrupts() both.
    this.localStorageService.logout();
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

}
