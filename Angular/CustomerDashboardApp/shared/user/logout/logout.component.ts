import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/core/services";

@Component({
  selector: "sa-logout",
  template: `
            <div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
                <span> <a title="Sign Out"><i class="fa fa-sign-out"></i></a> </span>
            </div>
          `,
  styles: []
})
export class LogoutComponent implements OnInit {
  @Input() username: string;
  @Output() logout = new EventEmitter();

  constructor(
    private notificationService: NotificationService
  ) 
  { }

  ngOnInit() {
  }

  showPopup() {
    this.notificationService.smartMessageBox(
      {
        title: `<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>${this.username}</strong></span> ?`,
        content: "You can improve your security further after logging out by closing this browser window",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          this.logout.emit(true);
        }
      }
    );
  }
}
