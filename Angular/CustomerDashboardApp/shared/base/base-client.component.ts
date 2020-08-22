import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  template: ''
})
export class BaseClientComponent {
  id: string;
  pageTitle: string;
  configUrl: string;
  screenUrl: string;
  companyId: string;
  userId: string;

  isClarityAdmin: boolean = false;
  loading: boolean = false;

  messageObject: MessageModel;

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.screenUrl = this.router.url.split('?')[0];
    
    this.route.data.subscribe(data => {
      this.pageTitle = data.pageTitle;
    });

    this.route.queryParamMap.subscribe(queryParams => {
      this.configUrl = queryParams.get("configuration");
      this.companyId = queryParams.get("companyId");
      this.userId = queryParams.get("userId");
      this.id = queryParams.get("id");
    });
  }

}
