import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TreeModule } from 'angular-tree-component';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';


// custom by dp start /

import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
import { objRouting } from './app.routing';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { SortablejsModule } from 'angular-sortablejs';

// custom by dp end /



@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent
  ],
  imports: [
    BrowserModule,
     // custom by dp start /
    HttpModule,
    objRouting,
      FormsModule,
      TreeModule,
      Ng2DragDropModule.forRoot(),
      SortablejsModule,
      SlimLoadingBarModule.forRoot()
    // custom by dp end /
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
