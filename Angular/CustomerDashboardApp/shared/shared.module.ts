import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TreeviewModule } from 'ngx-treeview';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { SmartadminLayoutModule } from "./layout";

import {UtilsModule} from "./utils/utils.module";
import { BootstrapModule } from "@app/shared/bootstrap.module";
import {PipesModule} from "./pipes/pipes.module";
// import { UserModule } from "./user/user.module";
// import {VoiceControlModule} from "./voice-control/voice-control.module";

import {SmartadminWidgetsModule} from "./widgets/smartadmin-widgets.module";
import { SmartadminUiModule } from "./ui/smartadmin-ui.module";

// import {ChatModule} from "./chat/chat.module";
// import {StatsModule} from "./stats/stats.module";
// import {InlineGraphsModule} from "./graphs/inline/inline-graphs.module";
import {SmartadminFormsLiteModule} from "./forms/smartadmin-forms-lite.module";
import { SmartadminInputModule } from "./forms/input/smartadmin-input.module";

import { BaseComponentsModule } from "./base/base-components.module";
import { DropdownsModule } from "./dropdowns/dropdowns.module";
// import {SmartProgressbarModule} from "./ui/smart-progressbar/smart-progressbar.module";
// import { CalendarComponentsModule } from "@app/shared/calendar/calendar-components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxDropzoneModule,
    SmartadminLayoutModule,
    BootstrapModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxDropzoneModule,
    
    // UserModule,
    SmartadminLayoutModule,
    BootstrapModule,

    UtilsModule,
    PipesModule,

    SmartadminFormsLiteModule,

    // SmartProgressbarModule,

    // InlineGraphsModule,

    SmartadminWidgetsModule,
    SmartadminUiModule,

    // ChatModule,

    // StatsModule,

    // VoiceControlModule,

    // CalendarComponentsModule,
    SmartadminInputModule,

    BaseComponentsModule,
    DropdownsModule,
    
  ]
})
export class SharedModule {}
