import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SharedModule } from '../shared/shared.module';
// import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { AuthGuard } from "./guards/auth.guard";
import { TokenInterceptor, ErrorInterceptor } from './interceptors';
import { services } from './services';
import { LoadingScreenInterceptor } from './interceptors/loading.interceptor';


@NgModule({
  imports: [
    SharedModule,
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    ...services,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  declarations: []
})
export class CoreModule {
  
 }









