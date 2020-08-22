import { Component, OnInit, Injector, Input, OnDestroy, HostListener } from "@angular/core";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";
import { CloudData, ZoomOnHoverOptions, CloudOptions } from 'angular-tag-cloud-module';
import { AuthService, GlobalFilterService } from '@app/core/services';
import { Subscription, Observable, of } from "rxjs";
import { widgetConfig } from "@app/config/constants";
import { ChartErrorEvent } from "ng2-google-charts";

@Component({
  template: '',
})
export class BaseWidgetComponent implements OnDestroy{
  loading: boolean = false;

  @Input() isMobile: boolean; 
  @Input() index: number;
  @Input() configObject: ConfigModel;
  @Input() compInteraction: any;
  @Input() data: WidgetModel;
  
  sub: Subscription;

  //widgetClass: string;
  widgetType: string;

  globalFilterSettings: CustomWidgetSettings;

  dataTableOptions: any;
  
  chartData: GoogleChartInterface;

  cloudData: CloudData[];
  cloudOptions: CloudOptions;
  zoomOnHoverOptions: ZoomOnHoverOptions;

  widgetData: any;

  // windowWidth: number;
  // windowHeight: number;

  constructor(
    public authService: AuthService, 
    public globalFilterService: GlobalFilterService,
  ) {
    // this.windowWidth = window.innerWidth;
    // this.windowHeight = window.innerHeight;

    this.sub = this.globalFilterService.subscribe((store: CustomWidgetSettings)=>{
      this.globalFilterSettings = store;

      if(this.globalFilterSettings.DataSync == true && !this.data.IsCustomWidgetSettings)
        this.getWidgetData();
    });
    this.globalFilterSettings = this.globalFilterService.store;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(!this.isMobile) {
      this.actionOnWidget({'action': 'RELOAD'});
    }
  }

  getWidgetData() {
    this.loading = true;

    let request: any = {};
    request.screenUrl = this.configObject.screenUrl;
    request.userId = this.configObject.userId;
    request.WidgetComponentName = this.data.WidgetComponentName;

    if(this.data.IsCustomWidgetSettings)
      request.WidgetSettings = this.data.CustomWidgetSettings;
    else
      request.WidgetSettings = this.globalFilterSettings;

    this.authService.executeStitchFunction("getScreenWidgetData", [request]).then(
      response => {
        if (response.success == true) {
          if(this.widgetType == 'DATATABLE') {
            this.initalizeDataOptions();
            this.dataTableOptions.data = response.data;
          } else if(this.widgetType == 'CHART') {
            if(request.WidgetComponentName == 'ScoreTrendWidgetComponent' && response.style) {
              const style = response.style;
              let options: any = this.chartData.options;
              options.colors = Object.keys(style).map(function(key){return style[key]});
              this.chartData.options = options;
            }
            
            if(response.data && response.data.length > 0) {
              response.data.unshift(response.labels);
              this.chartData.dataTable = [
                ...response.data
              ];
            } else {
              this.chartData.dataTable = [];
            }
          } else if(this.widgetType == 'MULTI_CHART') {
            this.chartData.dataTable = response;
            setTimeout(() => {
              this.drawChart();
            }, 0)
          } else if(this.widgetType == 'CLOUD'){
            let result = [];
            response.data.forEach(res => result = result.concat(res));

            let cloudData = [];
            if(response.data.length > 1) {

              result.reduce((res, value) => {
                if (!res[value.text]) {
                  res[value.text] = { text: value.text, weight: 0 };
                  cloudData.push(res[value.text])
                }
                res[value.text].weight += value.weight;
                return res;
              }, {});

              // result =  Object.values(
              //   result.reduce((a, c) => (
              //     a[c.text] = a[c.text] ?
              //     (a[c.text].weight += c.weight, a[c.text]) :
              //     c, a), {}
              //   )
              // );

              
            } else {
              cloudData = result;
            }

            if(this.data.IsCustomWidgetSettings && request.WidgetSettings.TopWords) {
              cloudData = cloudData.slice(0, request.WidgetSettings.TopWords)
            }

            //console.log(cloudData);

            this.cloudData = cloudData;
          } else if(this.widgetType == 'NPS'){
            if(response.data && response.data.length > 0) {
              const data = response.data;
              let widgetData = {
                promotersCount: 0,
                passiveCount: 0,
                detractorsCount: 0,
                totalCount: 0,
                npsScore: 0,
                className: ""
              };

              data.forEach(d => {
                widgetData.promotersCount += d.promotersCount;
                widgetData.passiveCount += d.passiveCount;
                widgetData.detractorsCount += d.detractorsCount;
                widgetData.totalCount += d.totalCount;
              })

              if(widgetData.totalCount > 0) {
                const promotersPercentage = (widgetData.promotersCount / widgetData.totalCount) * 100;
                const detractorsPercentage = (widgetData.detractorsCount / widgetData.totalCount) * 100;
                
                widgetData.npsScore = Math.floor((promotersPercentage - detractorsPercentage) * 10) / 10;
              }

              if(widgetData.npsScore > 60) {
                widgetData.className = "promoters";
              } else if(widgetData.npsScore > 30 && widgetData.npsScore <= 60) {
                widgetData.className = "passive";
              } else {
                widgetData.className = "detractors";
              }
              this.widgetData = widgetData;
            }
          }
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }
  
  actionOnWidget(options) {
    switch(options.action) {
      case 'DELETE':
        this.deleteWidget();
        break;

      case 'REFRESH':
        this.getWidgetData();
        break;

      case 'CHANGEDATA':
        this.data = options.data;
        this.getWidgetData();
        break;

      case 'CHANGEWORDCLOUD':
        const changedData$: Observable<CloudData[]> = of(this.cloudData);
        changedData$.subscribe(res => {
          this.cloudData = res;
        });
        break;

      case 'FULLSCREEN':
        switch(this.widgetType) {
          case 'CHART':
            this.chartData.options = Object.assign(this.chartData.options, { height: options.isFullScreen ? widgetConfig.height.fullscreen() : widgetConfig.height.chart });
            break;

          case 'MULTI_CHART':
              this.chartData.options = Object.assign(this.chartData.options, { height: options.isFullScreen ? widgetConfig.height.fullscreen() : widgetConfig.height.multi_chart });
            break;

          case 'CLOUD':
              this.cloudOptions = Object.assign(this.cloudOptions, { height: options.isFullScreen ? widgetConfig.height.fullscreen() : widgetConfig.height.cloud });
            break;
        }

      case 'RELOAD':
        this.loading = true;

        setTimeout(()=> {
          this.loading = false;
          setTimeout(() => {
            this.drawChart();
          }, 0)
        }, 1000)
        break;
    }
  }

  deleteWidget() {
    let request: any = {};
    request._id = this.data._id;
    request.userWidgetId = this.data.UserWidgetId;
    if(this.configObject.configurationMode) {
      request.screenUrl = this.configObject.dashboardConfigUrl;
    } else {
      request.userId = this.configObject.userId;
      request.screenUrl = this.configObject.screenUrl;
    }
    request.configurationMode = this.configObject.configurationMode;

    this.authService.executeStitchFunction("removeScreenWidget", [request]).then(
      response => {
        if (response.success == true) {
          this.compInteraction.remove(this.index);
        }
      },
      error => { }
    );
  }
  
  public error(event: ChartErrorEvent) {
    const errorElement = document.getElementById(event.id);
    errorElement.removeAttribute('style');
    errorElement.classList.add("no-graph-data");
    errorElement.innerHTML = "No Data";
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  /* Need to be declared in Child Components */
  initalizeDataOptions() {}
  drawChart() { }

}
