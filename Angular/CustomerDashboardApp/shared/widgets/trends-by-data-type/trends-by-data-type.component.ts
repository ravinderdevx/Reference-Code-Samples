import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService, GlobalFilterService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { Router } from '@angular/router';
import { widgetConfig } from '@app/config/constants';

declare var google: any;

@Component({
  selector: '[sa-trends-by-data-type]',
  templateUrl: './trends-by-data-type.component.html'
})
export class TrendsByDataTypeWidgetComponent extends BaseWidgetComponent implements OnInit {

  @ViewChild('chartContainer') chartContainer: ElementRef
  
  constructor(public router: Router, public authService: AuthService, public globalFilterService: GlobalFilterService) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'MULTI_CHART';
    this.chartData = {
      chartType: 'LineChart',
      dataTable: [],
      options: {
        
        legend: { position: 'top', alignment: 'center', maxLines: 3  },
        pointSize: 5,
        height: widgetConfig.height.multi_chart,
        vAxis: {
          title: 'Score',
          maxValue: 120,
          minValue: 0
        },
        hAxis: {
          title: 'Weekly Trends',
          format: 'MMM dd'
        },
        interpolateNulls: true,
        series: [],
        colors: []
      }
    }
    
    this.getWidgetData();
  }

  // getWidgetData() {
  //   this.loading = true;

  //   let request: any = {};
  //   request.screenUrl = this.screenUrl;
  //   request.WidgetComponentName = this.data.WidgetComponentName;

  //   if(this.data.IsCustomWidgetSettings)
  //     request.WidgetSettings = this.data.CustomWidgetSettings;
  //   else
  //     request.WidgetSettings = this.globalFilterSettings;

  //   this.authService.executeStitchFunction("getScreenWidgetData", [request]).then(
  //     response => {
  //       this.loading = false;
  //       this.ref.detectChanges();
        
  //       if (response.success == true) {
  //         this.chartData.dataTable = response;

            
  //       }
  //     },
  //     error => {
  //       this.loading = false;
  //     }
  //   );
  // }

  // drawChart1() {
  //   const { labels, data } = this.chartData.dataTable;
  //   let datas = [];

  //   for (let key in data) {
  //     let ddata = new google.visualization.DataTable();
  //       ddata.addColumn('string', 'Week');
  //       ddata.addColumn('number', key);

  //       ddata.addRows(data[key]);
  //       datas.push(ddata);
  //   }

  //   let joinedData = datas[0];

  //   let columns = [];
  //   datas.forEach((datatable, index,) => {
  //     if (index != 0) {
  //         columns.push(index);
  //         joinedData = google.visualization.data.join(joinedData, datatable, 'full', [[0, 0]], columns, [1]);
  //     }
  //   });
    
  //   //if(!this.trendsChart)
  //   const chart = new google.visualization.LineChart(document.querySelector('#chartDiv'));
  
  //   chart.draw(joinedData, this.chartData.options);

  //   //
    
    
  // }

    drawChart() {
      let datas = [];
      const { labels, style, data } = this.chartData.dataTable;
      const colors = Object.keys(style).map(function(key){return style[key]});

      for (let key in data) {
        let ddata = new google.visualization.DataTable();
          ddata.addColumn('date', 'Week');
          ddata.addColumn('number', key);

          ddata.addRows(data[key]);
          datas.push(ddata);
      }

      let joinedData = datas[0];

      let dcolumns = [];
      datas.forEach((datatable, index,) => {
        if (index != 0) {
          dcolumns.push(index);
            joinedData = google.visualization.data.join(joinedData, datatable, 'full', [[0, 0]], dcolumns, [1]);
        }
      });
      
      //if(!this.trendsChart)
      
      const chart = new google.visualization.LineChart(this.chartContainer.nativeElement);
    
      // create columns array
      var columns = [];
      // display these data series by default
      var defaultSeries = [];
      for (var i = 0; i < joinedData.getNumberOfColumns(); i++)  {
        defaultSeries.push(i);
      }
      var series = {};
      for (var i = 0; i < joinedData.getNumberOfColumns(); i++) {
        if (i == 0 || defaultSeries.indexOf(i) > -1) {
          // if the column is the domain column or in the default list, display the series
            columns.push(i);
        }
          else {
              // otherwise, hide it
              columns[i] = {
                  label: joinedData.getColumnLabel(i),
                  type: joinedData.getColumnType(i),
                  calc: function () {
                      return null;
                  }
              };
          }
          if (i > 0) {
              // set the default series option
              series[i - 1] = {};
              if (defaultSeries.indexOf(i) == -1) {
                  // backup the default color (if set)
                  if (typeof(series[i - 1].color) !== 'undefined') {
                      series[i - 1].backupColor = series[i - 1].color;
                  }
                  series[i - 1].color = '#CCCCCC';
              }
          }
      }
      let options: any = this.chartData.options;
      options.colors = colors;
      options.series = series;
  
      google.visualization.events.addListener(chart, 'select', () =>{
        var sel = chart.getSelection();
        // if selection length is 0, we deselected an element
        if (sel.length > 0) {
            // if row is undefined, we clicked on the legend
            if (sel[0].row == null) {
                var col = sel[0].column;
                if (columns[col] == col) {
                    // hide the data series
                    columns[col] = {
                        label: joinedData.getColumnLabel(col),
                        type: joinedData.getColumnType(col),
                        calc: function () {
                            return null;
                        }
                    };

                    // grey out the legend entry
                    series[col - 1].color = '#CCCCCC';
                }
                else {
                    // show the data series
                    columns[col] = col;
                    series[col - 1].color = null;
                }
                var view = new google.visualization.DataView(joinedData);

                view.setColumns(columns);
                chart.draw(view, options);
            }
        }
    });
  
      // create a view with the default columns
      var view = new google.visualization.DataView(joinedData);
      view.setColumns(columns);
      chart.draw(view, options);
  }
  
}
