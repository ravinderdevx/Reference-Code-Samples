import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';


// Compontes used in route.
import { HomeComponent } from '../../components/home/home.component';
import { MedicationsComponent } from '../../components/medications/medications.component';
import { AddMedicationsComponent } from '../../components/add-medications/add-medications.component';
import { EditMedicationsComponent } from '../../components/edit-medications/edit-medications.component';

/*
  Created By   : Harmesh
  Created Date : 10-01-2018
  Purpose      : Defining route with their components.
*/
const AppRoutes: Routes = [
    { 
      path: '', 
      component: HomeComponent
    },
    { 
      path: 'medications', 
      children: [
        {
          path: '',
          component: MedicationsComponent,
          data: {
            breadcrumb: "Medications List"
          } 
        },
        {
          path: 'add-medications',
          component: AddMedicationsComponent,
          data: {
            breadcrumb: "Add Medications"
          } 
        },
        {
          path: 'edit-medications/:id',
          component: EditMedicationsComponent,
          data: {
            breadcrumb: "Update Medications"
          } 
        }
      ],
      data: {
        breadcrumb: "Medications"
      } 
    },
    { 
      path: '',
      redirectTo: '/',
      pathMatch: 'full' 
    }
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      AppRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
