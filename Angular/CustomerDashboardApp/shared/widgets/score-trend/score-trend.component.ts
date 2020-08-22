import { Component, OnInit } from '@angular/core';
import { AuthService, GlobalFilterService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { Router } from '@angular/router';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-score-trend]',
  templateUrl: './score-trend.component.html'
})
export class ScoreTrendWidgetComponent extends BaseWidgetComponent implements OnInit {

  constructor(
    public router: Router, 
    public authService: AuthService, 
    public globalFilterService: GlobalFilterService
  ) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'CHART';
    this.chartData = {
      chartType: 'LineChart',
      dataTable: [],
      options: {
        legend: { position: 'top', alignment: 'center'  },
        pointSize: 5,
        height: widgetConfig.height.chart,
        vAxis: {
          title: 'Score',
          maxValue: 120
        }
      }
    }
    this.getWidgetData();
  }

  

}
