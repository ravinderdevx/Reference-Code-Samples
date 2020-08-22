import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ResponseService, AuthService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { GlobalFilterService } from '@app/core/services/global-filter.service';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-consolidated-nps]',
  templateUrl: './consolidated-nps.component.html',
  styleUrls: ['./consolidated-nps.component.css']
})
export class ConsolidatedNPSWidgetComponent extends BaseWidgetComponent implements OnInit {
  
  constructor(
    public router: Router,
    public authService: AuthService,
    public globalFilterService: GlobalFilterService
  ) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'NPS';
    this.getWidgetData();
  }
}
