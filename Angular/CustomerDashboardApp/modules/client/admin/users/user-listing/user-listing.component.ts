import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import {
  ResponseService,
  AuthService,
  NotificationService,
  LocalStorageService,
  LoaderService
} from "@app/core/services";

import { errorMessages, successMessages } from "@app/config/messages.config";

import { CustomTableComponent } from "@app/shared/ui/custom-datatable/custom-table.component";
import { BaseClientComponent } from "@app/shared/base/base-client.component";


@Component({
  selector: 'sa-client-users',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent extends BaseClientComponent implements OnInit {
  @ViewChild(CustomTableComponent) customTableComponent;

  windowPopup: any;

  selectedUser: any;
  columnsList: any = [];
  dataList: any = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private localStorageService: LocalStorageService,
    private responseService: ResponseService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    super(route, router);
  }

  ngOnInit() {
    this.isClarityAdmin = this.localStorageService.isClarityAdmin();

    this.columnsList = [
      {
        ColumnName: "FirstName",
        DisplayName: "First Name",
        AllowSorting: true
      },
      {
        ColumnName: "LastName",
        DisplayName: "Last Name",
        AllowSorting: true
      },
      {
        ColumnName: "Email",
        DisplayName: "Email",
        AllowSorting: true
      },
      {
        ColumnName: "Phone",
        DisplayName: "Phone",
        AllowSorting: true
      },
      {
        ColumnName: "JobTitle",
        DisplayName: "Job Title",
        AllowSorting: true
      },
      {
        ColumnName: "Active",
        ClassName: "text-center",
        DisplayName: "Active",
        AllowSorting: false
      },
      {
        ColumnName: "Action",
        ClassName: "text-center",
        DisplayName: "Action",
        AllowSorting: false
      }
    ];
  }

  filterGrid(request) {
    request.companyId = this.companyId;
    request.screenUrl = this.screenUrl;
    this.authService.executeStitchFunction("getCompanyUsers", [request]).then(
      response => {
        if (response.success == true) {
          this.dataList = response.data;
          this.customTableComponent.bindTable(response.data, response.totalRecords);
        }
      },
      error => {
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.notificationService.errorSmallMessageBox(message);
      }
    );
  }

  changeStatus(row, index) {
    this.notificationService.smartMessageBox(
      {
        title: `<i class='fa fa-user txt-color-orangeDark'></i> ${row.Active? 'Deactivate': 'Active'} <strong class="txt-color-orangeDark">${row.FirstName} ${row.LastName}</strong>?`,
        content: `This action will ${row.Active? 'deactivate': 'activate'} this user. Are you sure?`,
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          let request: any = {};
          request.companyId = this.companyId;
          request.screenUrl = this.screenUrl;
          request._id = row._id;
          request.status = !row.Active;

          this.authService.executeStitchFunction("changeCompanyUserStatus", [request]).then(
            response => {
              if (response.success == true) {
                this.dataList[index].Active = request.status;
                this.notificationService.successSmallMessageBox(request.status?successMessages.USER_ACTIVE_SUCCESS:successMessages.USER_DEACTIVE_SUCCESS);
              } 
            },
            error => {
              const message = this.responseService.handleError(
                error,
                errorMessages.DATA_FETCH_FAILURE
              );
              this.notificationService.errorSmallMessageBox(message);
            }
          );
        }
      }
    );
  }

  openConfigurationPopup(userId: any) {
    if(userId && userId) {
      this.loaderService.startLoading();
      this.authService.executeStitchFunction("getUserDetailsByUserId", [userId]).then(response => {
        if(response.success == true) {
          this.localStorageService.setImpersonateUserDetails(response.data);

          const currentUrl = window.location.href.split('?')[0];
          const hostUrl = currentUrl.replace(this.screenUrl, '');

          const top = (screen.availHeight - 600) / 2;
          const left = (screen.availWidth - 800) / 2;

          this.windowPopup = window.open(`${hostUrl}/client/dashboard?userId=${userId}` , "_blank", "directories=no,height=600,width=800,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no,top=" + top + ",left=" + left);

          this.windowPopup.onbeforeunload = () => {
            this.loaderService.stopLoading();
            this.localStorageService.removeImpersonateUserDetails();

          };
        } else {
          this.loaderService.stopLoading();
        }
      }, error => {
        const message = this.responseService.handleError(error, errorMessages.SOMETHING_WENT_WRONG);
        this.notificationService.errorSmallMessageBox(message);
        this.loaderService.stopLoading();
      });
    } else {
      this.notificationService.errorSmallMessageBox(errorMessages.USER_NOT_ACTIVE);
    }
  }

  
}
