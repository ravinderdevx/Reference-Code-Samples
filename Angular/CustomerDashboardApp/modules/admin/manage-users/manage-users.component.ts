import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import {
  MessageService,
  ResponseService,
  AuthService,
  ModalService,
  NotificationService
} from "@app/core/services";

import { errorMessages, successMessages } from "@app/config/messages.config";

import { CustomTableComponent } from "@app/shared/ui/custom-datatable/custom-table.component";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "sa-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.css"]
})
export class ManageUsersComponent implements OnInit {
  @ViewChild(CustomTableComponent) customTableComponent;
  @ViewChild('UserRegisterModal') userRegisterModal;
  
  selectedUser: any;
  columnsList: any = [];
  dataList: any = [];

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
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
        ColumnName: "Active",
        DisplayName: "Active",
        ClassName: 'text-center',
        AllowSorting: false
      },
      {
        ColumnName: "Action",
        DisplayName: "Action",
        ClassName: 'text-center',
        AllowSorting: false
      }
    ];
  }

  filterGrid(request) {
    this.authService.executeStitchFunction("getClarityUsers", [request]).then(
      response => {
        if (response.status == true) {
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
          request._id = row._id;
          request.status = !row.Active;

          this.authService.executeStitchFunction("changeClarityAdminStatus", [request]).then(
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

  addOpenClarityUserPopUp(data: any = null) {
    this.selectedUser = data;
    this.modalService.openModal(this.userRegisterModal);
  }

  reloadTable() {
    this.customTableComponent.filterTable();

    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
