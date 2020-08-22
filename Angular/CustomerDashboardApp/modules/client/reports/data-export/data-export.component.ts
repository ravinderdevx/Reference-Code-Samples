import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as jsonexport from "jsonexport/dist";

import { errorMessages, successMessages } from "@app/config/messages.config";
import {
  AuthService,
  ResponseService,
  MessageService
} from "@app/core/services";

import { DatePipe } from "@angular/common";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { defaultFilters } from "@app/config/constants";

@Component({
  selector: "app-data-export",
  templateUrl: "./data-export.component.html",
  providers: [DatePipe]
})
export class DataExportComponent implements OnInit {
  @Input() userId: string;
  @Input() screenUrl: string;

  @Output() close = new EventEmitter();
  
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'MM/DD/YYYY'
  };

  options: any ={
    typeHandlers:{
      Object: function(value,index,parent) {
       let object: any = {};

       Object.keys(value).forEach(key => {
        let filteredKey = key.replace(',', ' -');
        
        if(typeof value[key] === "object" && Object.keys(value[key]).length > 0)
          object[filteredKey] = JSON.stringify(value[key]);
        else
          object[filteredKey] = value[key];
       });

       delete object._id;

       return object;
      }
    }
  }
  
  initialLoading: boolean = false;
  
  loading: boolean = false;
  filterModel: any;
  messageObject: any;
  dateRangeModel: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.filterModel = Object.assign({}, defaultFilters, { Service: null });
  }

  dateRangeChanged(bsPicker) {
    const dateRangeArray = bsPicker._bsValue;
    
    if(dateRangeArray.length == 0) {
      this.filterModel.StartDate = null;
      this.filterModel.EndDate = null;
      return;
    }

    this.filterModel.StartDate = this.datePipe.transform(dateRangeArray[0], 'yyyy-MM-dd');
    this.filterModel.EndDate = this.datePipe.transform(dateRangeArray[1], 'yyyy-MM-dd');
  }

  dateRangeTypeChanged() {
    this.dateRangeModel = null;
  }

  dataExport() {
    let request: any = {};
    request = Object.assign({}, this.filterModel);
    request.screenUrl = this.screenUrl;
    request.userId = this.userId;

    this.loading = true;

    this.authService
      .executeStitchFunction("extractServiceData", [request])
      .then(
        response => {
          this.loading = false;
          if (response.success == true) {
            if(response.data.length == 0){
              this.messageObject = this.messageService.errorMessageObject(errorMessages.NO_DATA_FOUND);
            } else {
              jsonexport(response.data, this.options, (err, csv) => {
                  if(err) return console.log(err);
                  let blob = new Blob([csv], { type: 'text/csv' });
                  let url = window.URL.createObjectURL(blob);

                  if(navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, `${request.Service.ServiceName}.csv`);
                } else {
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${request.Service.ServiceName}.csv`;
                    document.body.appendChild(a);
                    a.click();        
                    document.body.removeChild(a);
                }
                window.URL.revokeObjectURL(url);
              });
              // let headers = [];
              // const firstRow = response.data[0];
              // Object.keys(firstRow).forEach(function(key) {
              //     headers.push(key.replace(',', ''));
              // });

              // this.csvOptions.title = request.Service.ServiceName;
              // this.csvOptions.headers = headers;
              // new Angular5Csv(response.data, request.Service.ServiceName, this.csvOptions);
            }
          } else {
            this.messageObject = this.messageService.errorMessageObject(response.message);
          }
        },
        error => {
          this.loading = false;

          const message = this.responseService.handleError(
            error,
            errorMessages.REGISTERATION_FAILURE
          );
          this.messageObject = this.messageService.errorMessageObject(message);
        }
      );
  }

//   exportCSV() {
//     const fields = ['carModel', 'price', 'items.name', 'items.color', 'items.items.position', 'items.items.color'];
// const myCars = [
//   {
//     "carModel": "BMW",
//     "price": 15000,
//     "items": [
//       {
//         "name": "airbag",
//         "color": "white"
//       }, {
//         "name": "dashboard",
//         "color": "black"
//       }
//     ]
//   }, {
//     "carModel": "Porsche",
//     "price": 30000,
//     "items": [
//       {
//         "name": "airbag",
//         "items": [
//           {
//             "position": "left",
//             "color": "white"
//           }, {
//             "position": "right",
//             "color": "gray"
//           }
//         ]
//       }, {
//         "name": "dashboard",
//         "items": [
//           {
//             "position": "left",
//             "color": "gray"
//           }, {
//             "position": "right",
//             "color": "black"
//           }
//         ]
//       }
//     ]
//   }
// ];
 
// const json2csvParser = new Parser({ fields, unwind: ['items', 'items.items'], unwindBlank: true });
// const csv = json2csvParser.parse(myCars);
 
// console.log(csv);
//   }
}
