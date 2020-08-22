import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {Select2Module} from "./input/select2/select2.module";
import {OnOffSwitchModule} from "./input/on-off-switch/on-off-switch.module";
import {SmartadminValidationModule} from "./validation/smartadmin-validation.module";


@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [
  ],
  exports: [
    Select2Module, OnOffSwitchModule, SmartadminValidationModule
  ]

})
export class SmartadminFormsLiteModule{}
