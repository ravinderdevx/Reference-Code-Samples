import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { HttpModule } from '@angular/http'
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './shared/modules/app-routing.module';
import { AppBootstrapModule  } from './shared/modules/app-bootstrap.module';


import { AppComponent } from './app.component';

// Common header & footer component
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

// Custom components
import { MedicationsComponent } from './components/medications/medications.component';
import { FieldErrorDisplayComponent } from './shared/components/field-error-display/field-error-display.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { HomeComponent } from './components/home/home.component';
import { AddMedicationsComponent } from './components/add-medications/add-medications.component';
import { EditMedicationsComponent } from './components/edit-medications/edit-medications.component';

import { CategoryPipe} from './shared/pipes/Category.pipe';
import { OrderrByPipe} from './shared/pipes/Orderby.pipe';


@NgModule({
    declarations: [
        AppComponent,
        // Header & Footer component
        FooterComponent,
        HeaderComponent,

        // Custom components
        MedicationsComponent,

        FieldErrorDisplayComponent,

        BreadcrumbComponent,

        HomeComponent,

        AddMedicationsComponent,

        EditMedicationsComponent,

        CategoryPipe,
        OrderrByPipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        Ng2AutoCompleteModule,
        AppRoutingModule,
        AppBootstrapModule,
        AngularFontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
