import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartProgressbarModule} from "./smart-progressbar/smart-progressbar.module";
import {TreeViewModule} from "./tree-view/tree-view.module";
import {NestableListModule} from "./nestable-list/nestable-list.module";
import { SmartadminCustomTableModule } from "./custom-datatable/smartadmin-custom-table.module";
import { SmartadminDatatableModule } from "./datatable/smartadmin-datatable.module";

import { JqueryUiModule } from "./jquery-ui/jquery-ui.module";

@NgModule({
  imports: [CommonModule],
  exports: [SmartProgressbarModule, JqueryUiModule, NestableListModule, TreeViewModule, SmartadminDatatableModule, SmartadminCustomTableModule],
})
export class SmartadminUiModule{}
