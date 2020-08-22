import { Component, OnInit, Injector } from '@angular/core';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { AuthService } from '@app/core/services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@app/core/services/global-filter.service';

@Component({
  selector: '[sa-audit-details]',
  templateUrl: './audit-details.component.html',
  providers: [DatePipe]
})
export class AuditDetailsWidgetComponent extends BaseWidgetComponent implements OnInit {
  
  constructor(
    public router: Router,
    public authService: AuthService, 
    public datePipe: DatePipe, 
    public globalFilterService: GlobalFilterService
    ) {
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
        {
          data: 'transDate', 
          width: '15%',
          render: (data, type, full, meta) => {
            return this.datePipe.transform(data, 'yyyy-MM-dd');
          }
        }, 
        {data: 'Start Time', width: '10%', className: 'text-uppercase'}, 
        {data: 'End Time', width: '10%', className: 'text-uppercase'}, 
        {data: 'Location', width: '15%'},
        {data: 'Total Score', width: '10%', className: 'text-center'},
        {
          data: '_id',
          orderable: false,
          className: 'text-center',
          render: (data, type, full, meta) => {
            return `<a data-url="${this.configObject.screenUrl}/${data}" class="detail-view">View</a>`;
          }
        }
      ],
      order: [[ 1, "desc" ]],
      fnRowCallback : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);
       return nRow;
      },
      drawCallback: () => {
        const router = this.router;
        $('.detail-view').on('click', function(){  //click event on button with class `buttonClass`
          router.navigateByUrl(this.attributes['data-url'].value);
        });
      }
    };
  }
}
