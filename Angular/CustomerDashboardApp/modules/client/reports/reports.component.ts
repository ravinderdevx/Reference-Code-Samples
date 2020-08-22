import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { formatDate } from "@angular/common";

import { BaseClientComponent } from '@app/shared/base/base-client.component';

import {
  MessageService,
  ResponseService,
  AuthService,
  ModalService,
  AWSService,
  LocalStorageService,
  NotificationService
} from "@app/core/services";


import { ModalDirective } from "ngx-bootstrap";
import { errorMessages, successMessages } from "@app/config/messages.config";
import { DatatableComponent } from "@app/shared/ui/datatable/datatable.component";


@Component({
  selector: 'sa-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent extends BaseClientComponent implements OnInit {
  @ViewChild(DatatableComponent) datatableComponent;

  @ViewChild('DataExportModal') dataExportModal;
  @ViewChild('UploadFilesModal') uploadFilesModal;
  @ViewChild('CreateDirectoryModal') createDirectoryModal: ModalDirective;
  
  
  dataTableOptions: any;
  companyName: string;
  root: string;
  folder: string;

  bucketFiles: S3FileModel[] = [];

  createDirectoryModel: any = {
    directoryName: null,
    key: null
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private modalService: ModalService,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private awsService: AWSService,
    public localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) {
    super(route, router);
  }

  ngOnInit() {
    if(this.userId) {
      this.isClarityAdmin = false;
    } else {
      this.isClarityAdmin = this.localStorageService.isClarityAdmin();
    }

    this.initializeDefaultOptions();
    this.getCompanyReportInformation();
  }

  initializeDefaultOptions() {
    this.dataTableOptions = {
      responsive: true,
      data: [],
      columns: [ 
        {
          data: 'Name',
          width: '60%',
          render: (data, type, full, meta) => {
            let temp = '';
            for(let i = 0; i < full.Level; i++)
              temp += '<span class="tab"></span>';

            temp += `${full.IsFolder?'<i class="glyphicon glyphicon-folder-open text-primary" *ngIf="file.IsFolder"></i>':''} ${data}`;
            return temp;
          }
        },
        {
          data: 'LastModified',
          width: '20%',
          render: (data, type, full, meta) => {
            return formatDate(data, 'MM/dd/yyyy hh:mm a', 'en-US');
          }
        },
        {
          data: '_id',
          width: '20%',
          class: "action text-center",
          render: (data, type, full, meta) => {
            let action = '';
            if(full.IsFolder && this.isClarityAdmin) { 
              action += `<a href="javascript:void(0)" data-action="create" data-key="${full.Key}" title="CREATE DIRECTORY"><i class="glyphicon glyphicon-plus-sign"></i></a>
              <a href="javascript:void(0)" data-action="upload" data-key="${full.Key}" title="UPLOAD"><i class="glyphicon glyphicon-cloud-upload"></i></a>`;
              action += meta.row > 0?`<a href="javascript:void(0)" data-action="delete" data-key="${full.Key}" data-folder="true" title="DELETE"><i class="glyphicon glyphicon-trash text-danger"></i></a>`:``;
            } else if(!full.IsFolder) {
              //action += `<a><i class="glyphicon glyphicon-plus-sign invisible"></i></a>`;
              action += `<a href="javascript:void(0)" data-action="download" data-key="${full.Key}" title="DOWNLOAD"><i class="glyphicon glyphicon-cloud-download"></i></a>`;
              action += this.isClarityAdmin?`<a href="javascript:void(0)" data-action="delete" data-key="${full.Key}" data-folder="false" title="DELETE"><i class="glyphicon glyphicon-trash text-danger"></i></a>`:``;
            }
            return action;
          }
        }
      ],
      "bSort" : false,
      drawCallback: () => {
        const self = this;
        $('a[data-action]').off("click");
        $('a[data-action]').on('click', function() { 
          let key = this.attributes['data-key'].value;

          switch(this.attributes['data-action'].value) {
            case 'create':
                self.openCreateDirectoryPopUp(key);
              break;

            case 'upload':
                self.openReportsUploadPopUp(key);
                break;

            case 'download':
                self.download(key);
              break;

            case 'delete':
                let isFolder = this.attributes['data-folder'].value == 'true'? true: false;
                self.delete(key, isFolder);
              break;
          }
        });
      }
    };
  }

  
  getCompanyReportInformation() {
    this.loading = true;

    let request: any = {};
    request.companyId = this.companyId;
    request.userId = this.userId;
    request.screenUrl = this.screenUrl;
    
    this.authService.executeStitchFunction("getCompanyReportInfo", [request]).then(
      response => {
        if (response.success == true) {
          this.root = response.data.report_path
          this.folder = response.data.report_path;
          this.companyName = response.data.company_name;
          this.getReports();
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

  getReports() {
    this.loading = true;

    const folder = this.root;
    this.awsService.getFiles(folder).then(response => {

      let rootNode: S3FileModel = {
        Key: this.root,
        Name: this.companyName,
        Size: 0,
        LastModified: new Date(),
        IsFolder: true,
        Level: 0
      };

      response.splice(0, 0, rootNode);

      this.dataTableOptions.data = response;

      this.datatableComponent.refresh();
      
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notificationService.errorSmallMessageBox(error);
    });
  }

  download(key) {
    this.awsService.downloadFile(key).then(response => {
    }, error => {
      this.notificationService.errorSmallMessageBox(error);
    });
  }

  delete(key, isFolder) {
    this.notificationService.smartMessageBox(
      {
        title: `<i class='fa fa-trash txt-color-orangeDark'></i> Do you want to delete this ${isFolder?'directory':'file'}?`,
        content: "Object will be deleted from S3 bucket",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {

          if(isFolder) {
            this.awsService.getFiles(key).then(response => {
              if(response.length > 1) {
                this.notificationService.errorSmallMessageBox(errorMessages.DIRECTORY_NOT_EMPTY);
              } else {
                this.deleteFile(key, isFolder);
              }
            });
          } else {
            this.deleteFile(key, isFolder)
          }
        }
      }
    );
  }

  deleteFile(key, isFolder) {
    this.awsService.deleteFile(key).then(response => {
      this.getReports();
      this.notificationService.successSmallMessageBox(isFolder?successMessages.DIRECTORY_DELETED_SUCCESS:successMessages.FILE_DELETED_SUCCESS);
    }, error => {
      this.notificationService.errorSmallMessageBox(error);
    });
  }

  createDirectory() {
    this.loading = true;
    let model: any = Object.assign({}, this.createDirectoryModel);

    this.awsService.createDirectory(model.key, model.directoryName).then(response => {
      this.getReports();
      this.notificationService.successSmallMessageBox(successMessages.DIRECTORY_CREATED_SUCCESS);

      this.createDirectoryModal.hide();
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notificationService.errorSmallMessageBox(error);
    });
  }

  openDataExtractPopUp() {
    this.modalService.openModal(this.dataExportModal);
  }

  openReportsUploadPopUp(folder) {
    this.folder = folder;
    this.modalService.openModal(this.uploadFilesModal);
  }

  openCreateDirectoryPopUp(folder) {
    this.createDirectoryModel = {
      directoryName: null,
      key: folder 
    };
    this.createDirectoryModal.show();
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
