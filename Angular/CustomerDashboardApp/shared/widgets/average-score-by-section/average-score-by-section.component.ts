import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { GlobalFilterService } from '@app/core/services/global-filter.service';
import { widgetConfig } from '@app/config/constants';

@Component({
  selector: '[sa-average-score-by-section]',
  templateUrl: './average-score-by-section.component.html'
})
export class AvgScoreBySectionWidgetComponent extends BaseWidgetComponent implements OnInit {
  isStacked: string = '0';
  constructor(
    public authService: AuthService, 
    public globalFilterService: GlobalFilterService) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'CHART';
    this.chartData = {
      chartType: 'ColumnChart',
      dataTable: [],
      options: this.initializeOptions()
    }
    

    this.getWidgetData();
  }

  initializeOptions() {
    return {
      legend: { position: 'none', alignment: 'center'  },
      //is3D: true,
      height: widgetConfig.height.chart,
      interpolateNulls: true,
      isStacked: this.isStacked == '1'? true : false
    };
  }

  changeView() {
    this.loading = true;
    this.chartData.options = this.initializeOptions();
    setTimeout(() => {
      this.loading = false;
    }, 1000)
  }

//   drawChart() {
//     const { labels, data } = this.chartData.dataTable;

//     var ddata = new google.visualization.DataTable();

//     labels.forEach((label, i) => {
//       ddata.addColumn(i == 0 ?'string':'number', label);
//     });

//     ddata.addRows(data);
    
//     //if(!this.trendsChart)
//     const chart = new google.visualization.ColumnChart(this.chartContainer.nativeElement);
  
//     chart.draw(ddata, this.chartData.options);
    
//   }

//   drawChart1() {
//     const { labels, data } = this.chartData.dataTable;
//     let datas = [];

//     data.forEach((chart_data, index) => {
//       let ddata = new google.visualization.DataTable();
//       labels[index].forEach((label, i) => {
//         ddata.addColumn(i == 0 ?'string':'number', label);
//       });

//       ddata.addRows([chart_data]);
//       datas.push(ddata);
//     });

//     let joinedData = datas[0];

//     let dcolumns = [];
//     datas.forEach((datatable, index,) => {
//       if (index != 0) {
//         dcolumns.push(index);
//           joinedData = google.visualization.data.join(joinedData, datatable, 'full', [[0, 0]], dcolumns, [1]);
//       }
//     });
    
//     //if(!this.trendsChart)
//     const chart = new google.visualization.ColumnChart(this.chartContainer.nativeElement);
  
//     // create columns array
//     var columns = [];
//     // display these data series by default
//     var defaultSeries = [];
//     for (var i = 0; i < joinedData.getNumberOfColumns(); i++)  {
//       defaultSeries.push(i);
//     }
//     var series = {};
//     for (var i = 0; i < joinedData.getNumberOfColumns(); i++) {
//       if (i == 0 || defaultSeries.indexOf(i) > -1) {
//         // if the column is the domain column or in the default list, display the series
//           columns.push(i);
//       }
//         else {
//             // otherwise, hide it
//             columns[i] = {
//                 label: joinedData.getColumnLabel(i),
//                 type: joinedData.getColumnType(i),
//                 calc: function () {
//                     return null;
//                 }
//             };
//         }
//         if (i > 0) {
//             // set the default series option
//             series[i - 1] = {};
//             if (defaultSeries.indexOf(i) == -1) {
//                 // backup the default color (if set)
//                 if (typeof(series[i - 1].color) !== 'undefined') {
//                     series[i - 1].backupColor = series[i - 1].color;
//                 }
//                 series[i - 1].color = '#CCCCCC';
//             }
//         }
//     }
//     let options: any = this.chartData.options;
//     options.series = series;

//     google.visualization.events.addListener(chart, 'select', () =>{
//       var sel = chart.getSelection();
//       // if selection length is 0, we deselected an element
//       if (sel.length > 0) {
//           // if row is undefined, we clicked on the legend
//           if (sel[0].row == null) {
//               var col = sel[0].column;
//               if (columns[col] == col) {
//                   // hide the data series
//                   columns[col] = {
//                       label: joinedData.getColumnLabel(col),
//                       type: joinedData.getColumnType(col),
//                       calc: function () {
//                           return null;
//                       }
//                   };

//                   // grey out the legend entry
//                   series[col - 1].color = '#CCCCCC';
//               }
//               else {
//                   // show the data series
//                   columns[col] = col;
//                   series[col - 1].color = null;
//               }
//               var view = new google.visualization.DataView(joinedData);

//               view.setColumns(columns);
//               chart.draw(view, options);
//           }
//       }
//   });

//     // create a view with the default columns
//     var view = new google.visualization.DataView(joinedData);
//     view.setColumns(columns);
//     chart.draw(view, options);
// }

}
