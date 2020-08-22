import { Component, OnInit } from "@angular/core";
import { routerTransition } from "@app/shared/utils/animations";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styles: [],
  animations: [routerTransition]
})
export class MainLayoutComponent implements OnInit {
  userId: any;
  configurationMode: boolean = false;

  constructor(private route:ActivatedRoute) {
    route.queryParamMap.subscribe(queryParams => {
      let configUrl = queryParams.get("configuration");
      this.configurationMode = (configUrl && configUrl != "") ? true : false;
      this.userId = queryParams.get("userId");
    });
  }

  ngOnInit() {
    
  }

  getState(outlet) {
    if(!outlet.activatedRoute) return;
    let ss = outlet.activatedRoute.snapshot;

    // return unique string that is used as state identifier in router animation
    return (
      outlet.activatedRouteData.state ||
      (ss.url.length
        ? ss.url[0].path
        : ss.parent.url.length
          ? ss.parent.url[0].path
          : null)
    );
  }
}
