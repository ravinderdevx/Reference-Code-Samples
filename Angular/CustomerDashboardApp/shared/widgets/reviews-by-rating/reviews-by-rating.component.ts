import { Component, OnInit, Input } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ResponseService, AuthService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { GlobalFilterService } from '@app/core/services/global-filter.service';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-reviews-by-rating]',
  templateUrl: './reviews-by-rating.component.html'
})
export class ReviewsByRatingWidgetComponent extends BaseWidgetComponent implements OnInit {
  
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
      chartType: 'PieChart',
      dataTable: [],
      options: {
        legend: { position: 'top', alignment: 'center'  },
        height: widgetConfig.height.chart
      }
    }
    this.getWidgetData();
  }
}
