import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, ResponseService, AuthService } from '@app/core/services';
import { errorMessages } from '@app/config/messages.config';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { defaultFilters } from '@app/config/constants';

@Component({
  selector: 'widget-setting',
  templateUrl: './widget-setting.component.html',
  styleUrls: ['./widget-setting.component.css'],
  providers: [DatePipe]
})
export class WidgetSettingComponent {

  @Output() close = new EventEmitter()
  @Output() onChange = new EventEmitter();

  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'MM/DD/YYYY'
  };
  
  initialLoading: boolean = false;

  loading: boolean = false;
  messageObject: any;
  widgetModel: WidgetModel;
  dateRangeModel: any;

  @Input() public configObject: ConfigModel;

  @Input() set widget(data: WidgetModel) {
    this.initialLoading = true;
    this.widgetModel = Object.assign({}, data);
    
    if(!data.IsCustomWidgetSettings) {
      this.widgetModel.CustomWidgetSettings = Object.assign({}, defaultFilters);
    }
    let startDate = new Date(this.widgetModel.CustomWidgetSettings.StartDate);
    let endDate = new Date(this.widgetModel.CustomWidgetSettings.EndDate);
    
    startDate = new Date( startDate.getTime() + Math.abs(startDate.getTimezoneOffset()*60000) )
    endDate = new Date( endDate.getTime() + Math.abs(endDate.getTimezoneOffset()*60000) )

    this.dateRangeModel = [
      startDate, 
      endDate
    ];
    
    this.initialLoading = false;
  }

  get widget() {
    return this.widgetModel;
  }

  
  public validationOptions :any = {
    // Rules for form validation
    rules: {
      title: {
        required: true
      },
      daterange: {
        required: true
      }
    },

    // Messages for form validation
    messages: {
      title: {
        required: 'Widget title is required'
      }
    }
  };

  constructor(
    private datePipe: DatePipe,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
  ) { }

  dateRangeChanged(bsPicker) {
    const dateRangeArray = bsPicker._bsValue;
    
    if(dateRangeArray.length == 0) {
      this.widgetModel.CustomWidgetSettings.StartDate = null;
      this.widgetModel.CustomWidgetSettings.EndDate = null;
      return;
    }

    this.widgetModel.CustomWidgetSettings.StartDate = this.datePipe.transform(dateRangeArray[0], 'yyyy-MM-dd');
    this.widgetModel.CustomWidgetSettings.EndDate = this.datePipe.transform(dateRangeArray[1], 'yyyy-MM-dd');
  }

  dateRangeTypeChanged() {
    this.dateRangeModel = null;
  }

  saveWidgetConfiguration() {
   if(!$("form[name='widgetConfigurationForm']").valid()) return false;

    let request: any = {};
    request = Object.assign({}, this.widgetModel);

    if(this.configObject.configurationMode) {
      request.screenUrl = this.configObject.dashboardConfigUrl;
      request.configScreenUrl = this.configObject.screenUrl;
    } else {
      request.userId = this.configObject.userId;
      request.screenUrl = this.configObject.screenUrl;
    }
    request.configurationMode = this.configObject.configurationMode;
    this.loading = true;

    this.authService
      .executeStitchFunction("saveWidgetConfiguration", [request])
      .then(
        response => {
          this.loading = false;
          if (response.success == true) {
            this.onChange.emit(this.widgetModel);
            this.close.emit();
          } else {
            this.messageObject = this.messageService.errorMessageObject(response.message);
          }
        },
        error => {
          this.loading = false;
          console.log(error.message);

          const message = this.responseService.handleError(
            error,
            errorMessages.REGISTERATION_FAILURE
          );
          this.messageObject = this.messageService.errorMessageObject(message);
        }
      );
  }

}
