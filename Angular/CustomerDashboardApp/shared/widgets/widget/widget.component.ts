import { LoaderService } from './../../../core/services/loader.service';
import { LocalStorageService } from './../../../core/services/local-storage.service';
import { constants, dateRangeTypes, defaultFilters } from '@app/config/constants';
import {Component, OnInit, ElementRef, Input, AfterViewInit, HostBinding, Inject, Output, EventEmitter, ViewChild} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NotificationService } from '@app/core/services/notification.service';
import { ModalService, ApiService } from '@app/core/services';

declare var $: any;

@Component({

  selector: 'sa-widget,[sa-widget]',
  templateUrl: 'widget.component.html'
})
export class WidgetComponent implements OnInit {
  @ViewChild('WidgetSettingModal') widgetSettingModal;
  
  _loading: boolean;
  @Output() performAction = new EventEmitter();

  @Input() 
  set loading(value: boolean) {
    this._loading = value;
  }

  get loading(): boolean {
    return this._loading;
  }

  @Input() public widget: WidgetModel;
  @Input() public configObject: ConfigModel;
  
  @Input() public name: string;

  @Input() public colorbutton: boolean = true;
  @Input() public settingbutton: boolean = true;
  @Input() public refreshbutton: boolean = true;
  @Input() public fullscreenbutton: boolean = true;
  @Input() public deletebutton: boolean = true;
  @Input() public togglebutton: boolean = true;
  @Input() public printbutton: boolean = true;
  @Input() public custombutton: boolean = false;

  @Input() public collapsed: boolean = false;
  @Input() public sortable: boolean = true;
  @Input() public hidden: boolean = false;
  @Input() public color: string;
  @Input() public load: boolean = false;
  @Input() public refresh: boolean = false;
  
  widgetClassName: string = '';
  isFullscreenMode: boolean = false;

  static counter: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    public el: ElementRef, 
    private apiService: ApiService,
    private modalService: ModalService,    
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    //this.widgetId = this.genId();

    let widget = this.el.nativeElement;
    
    $(widget)
    .parent()
    .attr('class',`col-xs-12 col-sm-${this.widget.ColumnWidth} col-md-${this.widget.ColumnWidth} col-lg-${this.widget.ColumnWidth}`)
    .attr('data-widgetid', String(this.configObject.configurationMode? this.widget._id : this.widget.UserWidgetId));

    this.widgetClassName += ' jarviswidget';
    if (this.sortable) {
      this.widgetClassName += ' jarviswidget-sortable';
    }

    if (this.color) {
      this.widgetClassName += (' jarviswidget-color-' + this.color);
    }

    // ['colorbutton',
    //   'settingbutton',
    //   'togglebutton',
    //   'deletebutton',
    //   'fullscreenbutton',
    //   'custombutton',
    //   'sortable'
    // ].forEach((option) => {
    //   if (!this[option]) {
    //     widget.setAttribute('data-widget-' + option, 'false')
    //   }
    // });

    // [
    //   'hidden',
    //   'collapsed'
    // ].forEach((option) => {
    //   if (this[option]) {
    //     widget.setAttribute('data-widget-' + option, 'true')
    //   }
    // });


    // ['refresh', 'load'].forEach(function (option) {
    //   if (this[option])
    //     widgetProps['data-widget-' + option] = this[option]
    // }.bind(this));

  }

  // private genId() {
  //   if (this.name) {
  //     return this.name
  //   } else {
  //     let heading = this.el.nativeElement.querySelector('header h2');
  //     let id = heading ? heading.textContent.trim() : 'jarviswidget-' + WidgetComponent.counter++;
  //     id = id.toLowerCase().replace(/\W+/gm, '-');

  //     let url = this.router.url.substr(1).replace(/\//g, '-');
  //     id = url + '--' + id;

  //     return id
  //   }

  // }

  // ngAfterViewInit(): any {
  //   // const $widget = $(this.el.nativeElement);

  //   // if (this.settingbutton) {
  //   //   $widget.find('.widget-body').prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>');
  //   // }
  // }

  settingClickHander() {
    this.modalService.openModal(this.widgetSettingModal);
  }

  refreshClickHander() {
    this.performAction.emit({ action: 'REFRESH'});
  }

  fullscreenClickHander() {
    this.isFullscreenMode = !this.isFullscreenMode;
    if(this.isFullscreenMode) {
      this.document.body.classList.add('nooverflow');
    } else {
      this.document.body.classList.remove('nooverflow');
    }
    
    setTimeout(() => {
      this.performAction.emit({ action: 'FULLSCREEN', isFullScreen: this.isFullscreenMode });    
    }, 0);
  }

  deleteClickHander() {
    this.notificationService.smartMessageBox(
      {
        title: `<i class='fa fa-trash txt-color-orangeDark'></i> Do you want to delete <span class='txt-color-orangeDark'><strong>${this.widget.WidgetTitle}</strong></span>?`,
        content: "You can improve your security further after logging out by closing this browser window",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          if(this.isFullscreenMode)
            this.fullscreenClickHander();

          this.performAction.emit({ action: 'DELETE' });
        }
      }
    );
  }

  closeModal() {
    this.modalService.closeModal();
  }

  refreshWidgetData(data: WidgetModel) {
    this.performAction.emit({ action: 'CHANGEDATA', data: data });
  }

  printClickHander() {
    document.body.classList.add('printmode');
    this.loaderService.startLoading();
    this.performAction.emit({ action: 'FULLSCREEN', isFullScreen: true });    

    setTimeout(() => {
    
    
      // let setTimeoutTime: number = 2000;
      // if(this.isFullscreenMode == false) {
      //   this.document.body.classList.add('printmode');
      //   this.fullscreenClickHander();
      //   setTimeoutTime = 0;
      // }

      //setTimeout(() => {
        let content = $(this.el.nativeElement).find('.widget-body').html();
        this.apiService.fetch(constants.printDirectoryUrl + 'single-widget.html', { responseType: 'text' }).subscribe(response => {
          let html: string = response.replace('{content}', content);
          this.printWidget(html);
        }, error => {
          
        });
      //}, setTimeoutTime);
    }, 2000);
  }

  printWidget(html: string) {
      const userDetails = this.configObject.userId ? this.localStorageService.getImpersonateUserDetails() : this.localStorageService.getUserDetail();
      const globalFilters = userDetails.GlobalFilterSettings ? userDetails.GlobalFilterSettings : defaultFilters;
      const widgetSettings = this.widget.IsCustomWidgetSettings ? this.widget.CustomWidgetSettings : globalFilters;

      html = html.replace('{title}', this.widget.WidgetTitle);
      
      let dateRange = dateRangeTypes.find(x => x.value == widgetSettings.DateRangeType);
      if(dateRange) {
        html = html.replace('{dateRangeType}', `${dateRange.text}`); 
      } else {
        html = html.replace('{dateRangeType}', '-'); 
      }
      
      if(dateRange && dateRange.text == 'CUSTOM_DATE_RANGE')
        html = html.replace('{dateRange}', `${widgetSettings.StartDate} - ${widgetSettings.EndDate}`);
      else
        html = html.replace('{dateRange}', '-'); 

      if(widgetSettings.Location) {
        let location = userDetails.locations.find(x => x._id == widgetSettings.Location);
        if(location) {
          html = html.replace('{location}', `${location.LocationName}`); 
        } else {
          html = html.replace('{location}', '-'); 
        }
      } else {
        html = html.replace('{location}', 'All Locations'); 
      }
      
      let windowPopup = window.open('', '_blank', `top=0,left=0,width=${screen.availWidth},height=${screen.availHeight},fullscreen='yes'`);    
      windowPopup.document.open();
      windowPopup.document.write(html);
      windowPopup.document.close();

      document.body.classList.remove('printmode');
      this.performAction.emit({ action: 'FULLSCREEN', isFullScreen: true });    
      this.loaderService.stopLoading();
  }
}
