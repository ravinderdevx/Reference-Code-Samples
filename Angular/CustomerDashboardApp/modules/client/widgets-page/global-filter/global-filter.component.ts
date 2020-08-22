import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input, SimpleChanges, OnChanges } from "@angular/core";
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AuthService, LocalStorageService, GlobalFilterService, ResponseService  } from '@app/core/services';
import { DatePipe } from '@angular/common';
import { errorMessages } from "@app/config/messages.config";

@Component({
  selector: "global-filter",
  templateUrl: "./global-filter.component.html",
  providers: [DatePipe]
})
export class GlobalFilterComponent implements OnInit {
  @Input() userId: string;

  dateRangeModel: any;
  globalFilterSettings: CustomWidgetSettings;

  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'MM/DD/YYYY'
  };

  constructor(
    private datePipe: DatePipe,
    private globalFilterService: GlobalFilterService,
    private localStorageService: LocalStorageService,
    private responseService: ResponseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.globalFilterSettings = this.globalFilterService.store;
    if(this.globalFilterSettings.DateRangeType == 'CUSTOM_DATE_RANGE') {
      let startDate = new Date(this.globalFilterSettings.StartDate);
      let endDate = new Date(this.globalFilterSettings.EndDate);

      startDate = new Date( startDate.getTime() + Math.abs(startDate.getTimezoneOffset()*60000) )
      endDate = new Date( endDate.getTime() + Math.abs(endDate.getTimezoneOffset()*60000) )
      this.dateRangeModel = [startDate, endDate];
    }
  }

  filterChange() {
    this.globalFilterService.changeGlobalFilters(this.globalFilterSettings);
    
    let request: any = {};
    request.globalFilterSettings = this.globalFilterSettings;
    request.userId = this.userId;
    this.authService.executeStitchFunction("saveUserGlobalFilters", [request]).then(
      response => {
        if (response.success == true) {
          if(this.userId && this.userId != '')
            this.localStorageService.saveImpersonateUserGlobalFilters(this.globalFilterSettings);
          else
            this.localStorageService.saveGlobalFilters(this.globalFilterSettings);
        }
      },
      error => {
        console.log(error);
        // const message = this.responseService.handleError(
        //   error,
        //   errorMessages.DATA_FETCH_FAILURE
        // );
        // this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }

  dateRangeChanged(bsPicker) {
    const dateRangeArray = bsPicker._bsValue;
    
    if(dateRangeArray.length == 0) {
      this.globalFilterSettings.StartDate = null;
      this.globalFilterSettings.EndDate = null;
      return;
    }
    
    this.globalFilterSettings.StartDate = this.datePipe.transform(dateRangeArray[0], 'yyyy-MM-dd');
    this.globalFilterSettings.EndDate = this.datePipe.transform(dateRangeArray[1], 'yyyy-MM-dd');
    this.filterChange();
  }

  dateRangeTypeChanged() {
    this.dateRangeModel = null;
    if(this.globalFilterSettings.DateRangeType != 'CUSTOM_DATE_RANGE') {
      this.filterChange();
    }
  }
}
