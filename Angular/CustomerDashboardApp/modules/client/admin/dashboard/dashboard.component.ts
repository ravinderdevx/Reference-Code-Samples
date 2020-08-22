import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomTableComponent } from '@app/shared/ui/custom-datatable/custom-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, MessageService, ResponseService, AuthService, NotificationService } from '@app/core/services';
import { errorMessages } from '@app/config/messages.config';
import { BaseClientComponent } from '@app/shared/base/base-client.component';

@Component({
  selector: 'sa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseClientComponent implements OnInit {

  @ViewChild(CustomTableComponent) customTableComponent;
  
  windowPopup: any;
  columnsList: any = [];
  dataList: any = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    super(route, router);
  }

  ngOnInit() {
    this.getDashboardConfigurationData();
  }

  getDashboardConfigurationData() {
    this.loading = true;

    let request: any = {};
    request.screenUrl = this.screenUrl;
    this.authService.executeStitchFunction("getCompanyDashboardConfigurationPages", [request]).then(
      response => {
        this.loading = false;
    
        if (response.success == true) {
          this.dataList = response.data;
        }
      },
      error => {
        this.loading = false;
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }

  openConfigurationPopup(data: any) {
    const currentUrl = window.location.href.split('?')[0];
    const hostUrl = currentUrl.replace(this.screenUrl, '');

    const top = (screen.availHeight - 600) / 2;
    const left = (screen.availWidth - 800) / 2;
    this.windowPopup = window.open(`${hostUrl}${data.ScreenUrl}?configuration=${this.screenUrl}` , "_blank", "directories=no,height=600,width=800,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no,top=" + top + ",left=" + left);
  }

}
