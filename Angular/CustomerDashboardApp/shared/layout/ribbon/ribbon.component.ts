import { Component, OnInit } from '@angular/core';
// import {LayoutService} from "@app/core/services/layout.service";
// import { LocalStorageService } from '@app/core/services';
// import { Router } from '@angular/router';

@Component({
  selector: 'sa-ribbon',
  templateUrl: './ribbon.component.html'
})
export class RibbonComponent implements OnInit {
  /* private router: Router, private layoutService: LayoutService, private localStorageService: LocalStorageService*/
  constructor() {}

  ngOnInit() {
  }

  // resetWidgets() {
  //   this.layoutService.factoryReset()
  // }

  // goToHome() {
  //   this.router.navigateByUrl(this.localStorageService.getRedirectUrl());
  // }

}
