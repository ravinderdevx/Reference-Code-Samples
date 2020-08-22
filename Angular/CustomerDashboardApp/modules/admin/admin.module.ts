import { NgModule } from "@angular/core";
import { AdminRouting } from "./admin.routing";
import { SharedModule } from "@app/shared/shared.module";

import { AdminComponent } from "./admin.component";

@NgModule({
  imports: [AdminRouting, SharedModule],
  declarations: [AdminComponent]
})
export class AdminModule {}
