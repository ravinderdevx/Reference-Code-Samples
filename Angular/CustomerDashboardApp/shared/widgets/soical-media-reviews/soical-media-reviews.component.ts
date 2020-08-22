import { Component, OnInit, Injector } from '@angular/core';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { AuthService } from '@app/core/services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@app/core/services/global-filter.service';

@Component({
  selector: '[sa-soical-media-reviews]',
  templateUrl: './soical-media-reviews.component.html',
  providers: [DatePipe]
})
export class SocialMediaReviewsWidgetComponent extends BaseWidgetComponent implements OnInit {
  
  constructor(public router: Router, public authService: AuthService, public datePipe: DatePipe, public globalFilterService: GlobalFilterService) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'DATATABLE';
    this.initalizeDataOptions();
    this.getWidgetData();
  }

  initalizeDataOptions() {
    this.dataTableOptions = {
      // buttons: [
      //   'excelHtml5',
      //   'csvHtml5',
      //   'pdfHtml5'
      // ],
      data: [],
      columns: [ 
        {data: '_id'},
        {data: 'attribution', width: '15%'}, 
        {data: 'category', width: '10%', className: 'text-capitalize'}, 
        {data: 'content', width: '30%'}, 
        {
          data: 'transDate', 
          width: '15%',
          render: (data, type, full, meta) => {
            return this.datePipe.transform(data, 'yyyy-MM-dd');
          }
        }, 
        {data: 'rating', width: '10%', className: 'text-center'}, 
        {
          data: 'url',
          orderable: false,
          className: 'text-center',
          render: (data, type, full, meta) => {
            return `<a href="${data}" target="_blank">Review</a>`;
          }
        }
      ],
      order: [[ 4, "desc" ]],
      fnRowCallback : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);
       return nRow;
      },
    };
  }
}
