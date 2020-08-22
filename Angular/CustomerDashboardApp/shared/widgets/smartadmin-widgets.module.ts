import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { TagCloudModule } from 'angular-tag-cloud-module';


import { BootstrapModule } from '@app/shared/bootstrap.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from './../forms/validation/smartadmin-validation.module';

import { BaseComponentsModule } from './../base/base-components.module';
import { DropdownsModule } from "../dropdowns/dropdowns.module";

import { WidgetComponent } from "./widget/widget.component";
import { WidgetsGridComponent } from "./widgets-grid";
import { WidgetShowCaseComponent } from "./widget-show-case/widget-show-case.component";
import { WidgetSettingComponent } from './widget/widget-setting/widget-setting.component';

import {
  /* Home Widgets */
  TrendsByDataTypeWidgetComponent,
  ActivityCountsByDataTypeWidgetComponent,
  Last10ScoresByDataTypeWidgetComponent,
  ConsolidatedNPSWidgetComponent,

  /* Social Widgets */
  ReviewsBySourceWidgetComponent,
  ReviewsByRatingWidgetComponent,
  AverageRatingBySourceWidgetComponent,
  SocialMediaReviewsWidgetComponent,

  /* Surevey Widgets */
  SurveyDetailsWidgetComponent,
  AvgScorebySurveyQuestionsWidgetComponent,

  /* Audit Widgets */
  AuditDetailsWidgetComponent,

  /* Shop Widgets */
  ShopDetailsWidgetComponent,
  AvgScoreBySectionWidgetComponent,

  /* Common Widgets */
  ScoreTrendWidgetComponent,
  WordCloudWidgetComponent
} from "./index";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    BootstrapModule, 
    Ng2GoogleChartsModule, 
    TagCloudModule,
    BaseComponentsModule,
    DropdownsModule, 
    SmartadminValidationModule, 
    SmartadminDatatableModule,
  ],
  declarations: [
    WidgetComponent,
    WidgetsGridComponent,
    WidgetShowCaseComponent,
    WidgetSettingComponent,

    /* Home Widgets */
    TrendsByDataTypeWidgetComponent,
    ActivityCountsByDataTypeWidgetComponent,
    Last10ScoresByDataTypeWidgetComponent,
    ConsolidatedNPSWidgetComponent,

    /* Social Widgets */
    ReviewsBySourceWidgetComponent,
    ReviewsByRatingWidgetComponent,
    AverageRatingBySourceWidgetComponent,
    SocialMediaReviewsWidgetComponent,

    /* Survey Widgets */
    SurveyDetailsWidgetComponent,
    AvgScorebySurveyQuestionsWidgetComponent,

    /* Audit Widgets */
    AuditDetailsWidgetComponent,

    /* Shop Widgets */
    ShopDetailsWidgetComponent,
    AvgScoreBySectionWidgetComponent,

    /* Common Widgets */
    ScoreTrendWidgetComponent,
    WordCloudWidgetComponent
  ],
  entryComponents: [
    /* Home Widgets */
    TrendsByDataTypeWidgetComponent,
    ActivityCountsByDataTypeWidgetComponent,
    Last10ScoresByDataTypeWidgetComponent,
    ConsolidatedNPSWidgetComponent,

    /* Social Widgets */
    ReviewsBySourceWidgetComponent,
    ReviewsByRatingWidgetComponent,
    AverageRatingBySourceWidgetComponent,
    SocialMediaReviewsWidgetComponent,

    /* Survey Widgets */
    SurveyDetailsWidgetComponent,
    AvgScorebySurveyQuestionsWidgetComponent,

    /* Audit Widgets */
    AuditDetailsWidgetComponent,
    
    /* Shop Widgets */
    ShopDetailsWidgetComponent,
    AvgScoreBySectionWidgetComponent,

    /* Common Widgets */
    ScoreTrendWidgetComponent,
    WordCloudWidgetComponent
  ],
  exports: [
    WidgetComponent,
    WidgetsGridComponent,
    WidgetShowCaseComponent
  ]
})
export class SmartadminWidgetsModule { }