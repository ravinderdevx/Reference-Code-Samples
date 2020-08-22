import { SharedModule } from '@app/shared/shared.module';
import { NgModule } from '@angular/core';

import { AuthRouting} from "./auth.routing";
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRouting,
  ],
  declarations: [AuthComponent]
})
export class AuthModule { }
