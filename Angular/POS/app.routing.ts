import {Routes ,RouterModule} from '@angular/router';
import {Component,ModuleWithProviders} from '@angular/core';
import { KeyboardComponent } from './keyboard/keyboard.component'

const  customRoute:Routes=[
{ path: 'keyboard', component: KeyboardComponent }
];

 export const objRouting: ModuleWithProviders = RouterModule.forRoot(customRoute); 

