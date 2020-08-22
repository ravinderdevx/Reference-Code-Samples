import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ResponseService, AuthService, ModalService } from '@app/core/services';
import { errorMessages } from '@app/config/messages.config';
import { BaseClientComponent } from '@app/shared/base/base-client.component';

@Component({
  selector: 'widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.css']
})
export class WidgetDetailsComponent extends BaseClientComponent implements OnInit {
  parentScreenUrl: string;
  widgetDetails: any;
  widgetScores: any;
  widgetQuestions: any;
  messageObject: MessageModel;
  excludeColumns: Array<string> = ['_id', 'Questions', 'Section Scores'];

  constructor(
    public route: ActivatedRoute, 
    public router: Router, 
    private modalService: ModalService,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService) { 
      super(route, router);
    }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      let dataId = routeParams.id;
      this.parentScreenUrl = this.router.url.replace(`/${dataId}`, '');
      
      this.getWidgetDetails({ screenUrl: this.parentScreenUrl, WidgetComponentName: 'WidgetDetailsComponent', _id: dataId  });
    });
  }

  getWidgetDetails(request) {
    this.loading = true;
    this.authService.executeStitchFunction("getScreenWidgetData", [request]).then(
      response => {
        this.loading = false;
        if (response.success == true) {
          this.widgetDetails = response.data;
          this.widgetScores = this.widgetDetails['Section Scores'] ? this.widgetDetails['Section Scores']: null;
          this.widgetQuestions = this.widgetDetails['Questions'] ? this.widgetDetails['Questions']: null;
        }
      },
      error => {
        this.loading = false
        // const message = this.responseService.handleError(
        //   error,
        //   errorMessages.DATA_FETCH_FAILURE
        // );
        // this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }


}
