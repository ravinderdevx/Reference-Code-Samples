import { NgModule } from '@angular/core';
import { ClientRouting } from './Client.routing';
import { SharedModule } from '@app/shared/shared.module';

import { ClientComponent } from './client.component';

@NgModule({
  imports: [
    ClientRouting,
    SharedModule
  ],
  declarations: [ClientComponent]
})
export class ClientModule { }
