import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';
import { constants } from '@app/config/constants';
import { messages } from '@app/config/messages.config';

@Component({
  selector: 'app-screen-help',
  templateUrl: './screen-help.component.html',
  styleUrls: ['./screen-help.component.css']
})
export class ScreenHelpComponent implements OnInit {
  loading: boolean = false;
  screenUrl: string;
  pageTitle: string;
  htmlContent: string;

  constructor(
      private route: ActivatedRoute, 
      private apiService: ApiService
  ) { 
    this.route.queryParamMap.subscribe(queryParams => {
      this.screenUrl = queryParams.get("screen-url");
    })

    this.route.data.subscribe(data => {
      this.pageTitle = data.pageTitle;
    });
  }

  ngOnInit() {
    if(this.screenUrl && this.screenUrl != '') {

      let filePath =  this.screenUrl;
      filePath = filePath.replace(constants.clientUrl, '');
      filePath = filePath.replace(constants.adminUrl, '');
      filePath = filePath.substr(1, filePath.length);
      filePath = filePath.replace('/', '-') + '.html';

      this.loading = true;
      this.apiService.fetch(constants.helpDocumentUrl + filePath, { responseType: 'text' }).subscribe(response => {
        this.loading = false;
        this.htmlContent = response;
      }, error => {
        this.loading = false;
        this.htmlContent = this.noHelpText();
      })
    } else {
      this.htmlContent = this.noHelpText();
    }
  }

  noHelpText(): string {
    return messages.NO_HELP;
  }

}
