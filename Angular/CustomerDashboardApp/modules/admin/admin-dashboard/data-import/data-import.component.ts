import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";

import { errorMessages, successMessages } from "@app/config/messages.config";
import {
  AuthService,
  ResponseService,
  MessageService
} from "@app/core/services";

@Component({
  selector: "app-data-import",
  templateUrl: "./data-import.component.html"
})
export class DataImportComponent implements OnInit {
  @Input() client: any;
  @Input() clarityServices: any;

  @Output() close = new EventEmitter();
  
  initialLoading: boolean = false;
  loading: boolean = false;

  exportModel: any;
  clientServices: any = [];
  messageObject: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(this.client);

    let clientServices = this.client.ServiceIds;
    this.clientServices = clientServices.map(serviceId => {
      return this.clarityServices.find(x => String(x._id) == String(serviceId));
    });
    
    this.exportModel = {
      companyId: this.client._id,
      service: null,
      file: null,
      data: null
    };
  }

  serviceChanged() {
    this.exportModel.file = null; 
    this.exportModel.data = null;
  }

  fileChanged(event) {
    if(event.target.files.length > 0) {
      let fileData = event.target.files[0];

      var reader = new FileReader();
      reader.readAsText(fileData);
      var me = this;
      reader.onload = (e) => {
        me.exportModel.data = String(reader.result);
      };
    } 
  }

  dataImport() {
    let request: any = {};
    request = Object.assign({}, this.exportModel);
    delete request.file;
    this.loading = true;

    this.authService
      .executeStitchFunction("importCompanyData", [request])
      .then(
        response => {
          this.loading = false;
          if (response.success == true) {
            this.messageObject = this.messageService.successMessageObject(successMessages.DATA_IMPORT_SUCCESS);
          }
        },
        error => {
          this.loading = false;
          console.log(error.message);

          const message = this.responseService.handleError(
            error,
            errorMessages.DATA_IMPORT_FAILURE
          );
          this.messageObject = this.messageService.errorMessageObject(message);
        }
      );
  }


}
