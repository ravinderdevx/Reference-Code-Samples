import {Component, OnInit} from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {


  constructor(private layoutService: LayoutService) {
  }

  ngOnInit() {
  }

  // toggleShortcut() {
  //   this.layoutService.onShortcutToggle()
  // }

}
