import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  MessageService,
  ResponseService,
  AuthService,
  ModalService
} from "@app/core/services";
import { errorMessages } from "@app/config/messages.config";
import { CustomTableComponent } from "@app/shared/ui/custom-datatable/custom-table.component";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "sa-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  @ViewChild(CustomTableComponent) customTableComponent;
  @ViewChild('ClientRegisterModal') clientRegisterModal;
  @ViewChild('DataImportModal') dataImportModal;

  bsModalRef: BsModalRef;

  selectedClient: any;
  columnsList: any = [];
  dataList: any = [];
  messageObject: any;
  services: any = [];

  constructor(
    private router: Router,
    private modalService: ModalService,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.columnsList = [
      {
        ColumnName: "CompanyName",
        DisplayName: "Company Name",
        AllowSorting: true
      },
      {
        ColumnName: "ContactName",
        DisplayName: "Contact Name",
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
        ColumnName: "Action",
        DisplayName: "Action",
        ClassName: "text-center",
        AllowSorting: false
      }
    ];

    this.getClarityServices();
    //this.getClarityLocations();
  }

  getClarityServices(): any {
    this.authService.executeStitchFunction("getClarityServices", []).then(
      response => {
        if (response.success == true) {
          this.services = response.data;
        }
      },
      error => {
        console.log(error);
      });
  }

  // getClarityLocations(): any {
  //   this.authService.executeStitchFunction("getClarityLocations", []).then(
  //     response => {
  //       if (response.success == true) {
  //         this.locations = response.data;
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }

  filterGrid(request) {
    this.authService.executeStitchFunction("getAllCompanies", [request]).then(
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
        this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }
  addOpenClientPopUp(data: any = null) {
    this.selectedClient = data;
    this.modalService.openModal(this.clientRegisterModal);
  }

  openImportPopUp(data: any) {
    this.selectedClient = data;
    this.modalService.openModal(this.dataImportModal);
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
