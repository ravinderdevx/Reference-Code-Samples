import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWidgetComponent } from '@app/shared/base/base-widget.component';
import { AuthService, GlobalFilterService, NotificationService } from '@app/core/services';
import { widgetConfig } from '@app/config/constants';


@Component({
  selector: '[sa-word-cloud]',
  templateUrl: './word-cloud.component.html'
})
export class WordCloudWidgetComponent extends BaseWidgetComponent implements OnInit {
  constructor(
    public router: Router, 
    public authService: AuthService, 
    public globalFilterService: GlobalFilterService,
    public notificationService: NotificationService
  ) {
    super(authService, globalFilterService);
  }

  ngOnInit() {
    this.widgetType = 'CLOUD';
    this.cloudOptions = {
      width: 1,
      height : widgetConfig.height.cloud,
      randomizeAngle: true,
      overflow: false,
    };

    this.zoomOnHoverOptions = {
      scale: 1.5, // Elements will become 130 % of current zize on hover
      transitionTime: 1, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
      delay: 0 // Zoom will take affect after 0.8 seconds
    };
    
    this.getWidgetData();
  }

  removeTag(tag) {
    this.notificationService.smartMessageBox(
      {
        title: `Remove Tag "<span class='txt-color-orangeDark'><strong>${tag.text}</strong></span>"?`,
        content: "Are you sure you want to remove tag?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          let request: any = {};
          request.tag = tag.text;

          this.loading = true;

          this.authService.executeStitchFunction("performActionOnTag", [request]).then(
            response => {
              if (response.success == true) {
                console.log(tag);
                let index = this.cloudData.findIndex(x => x.text == tag.text);

                if(index !== -1) {
                  this.cloudData.splice(index, 1);
                  this.actionOnWidget({action: 'CHANGEWORDCLOUD'});
                }
              }
              this.loading = false;
            },
            error => {
              this.loading = false;
            }
          );
        }
      }
    );
  }

}
