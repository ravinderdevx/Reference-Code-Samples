import {Component, OnInit, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import { LocalStorageService } from '@app/core/services';

@Component({
  selector: 'configuration-header',
  templateUrl: './configuration-header.component.html',
})
export class ConfigurationHeaderComponent implements OnInit {
  user: any
  private rememberMe: boolean = false;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    //this.rememberMe = this.localStorageService.isRememberMeChecked();
    this.user = this.localStorageService.getUserDetail();
  }
}
