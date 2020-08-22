import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@app/core/services';
import { GlobalFilterService } from '@app/core/services/global-filter.service';
import { Router } from '@angular/router';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-reviews-by-source]',
  templateUrl: './reviews-by-source.component.html'
})
export class ReviewsBySourceWidgetComponent extends BaseWidgetComponent implements OnInit {
  constructor(public router: Router, public authService: AuthService, public globalFilterService: GlobalFilterService) {
    super(authService, globalFilterService);
  }
  
  ngOnInit() {
    this.widgetType = 'CHART';
    this.chartData = {
      chartType: 'PieChart',
      dataTable: [],
      options: {
        legend: { position: 'top', alignment: 'center'  },
        pieHole: 0.4,
        height: widgetConfig.height.chart
      }
    }
    this.getWidgetData();
  }
}
