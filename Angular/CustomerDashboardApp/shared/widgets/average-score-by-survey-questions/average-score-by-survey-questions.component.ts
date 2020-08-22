import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { GlobalFilterService } from '@app/core/services/global-filter.service';
import { Router } from '@angular/router';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-average-score-by-survey-questions]',
  templateUrl: './average-score-by-survey-questions.component.html'
})
export class AvgScorebySurveyQuestionsWidgetComponent extends BaseWidgetComponent implements OnInit {

  constructor(public router: Router,
    public authService: AuthService, 
    public globalFilterService: GlobalFilterService
  ) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'CHART';
    this.chartData = {
      chartType: 'ColumnChart',
      dataTable: [],
      options: {
        legend: { position: 'none', alignment: 'center'  },
        //is3D: true,
        height: widgetConfig.height.chart,
        hAxis: {
          slantedText:true
        }
      }
    }
    this.getWidgetData();
  }
}
