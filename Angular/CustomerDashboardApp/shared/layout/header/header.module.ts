import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import { NgIdleModule } from '@ng-idle/core';
import { ModalModule } from 'ngx-bootstrap/modal';


import {CollapseMenuComponent} from "./collapse-menu/collapse-menu.component";
import {FullScreenComponent} from "./full-screen/full-screen.component";
import {HelpComponent} from "./help/help.component";
import {HeaderComponent} from "./header.component";

import {UtilsModule} from "@app/shared/utils/utils.module";
import {PipesModule} from "@app/shared/pipes/pipes.module";
import {UserModule} from "@app/shared/user/user.module";
import {BsDropdownModule, PopoverModule} from "ngx-bootstrap";
import { ConfigurationHeaderComponent } from "./configuration-header.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    ModalModule.forRoot(),
    NgIdleModule.forRoot(),

    // VoiceControlModule,

    BsDropdownModule,

    UtilsModule,PipesModule, UserModule, PopoverModule,
  ],
  declarations: [
    FullScreenComponent,
    HelpComponent,
    CollapseMenuComponent,
    HeaderComponent,
    ConfigurationHeaderComponent
  ],
  exports: [
    HeaderComponent,
    ConfigurationHeaderComponent
  ]
})
export class HeaderModule{}
