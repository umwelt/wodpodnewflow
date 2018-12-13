import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatTableModule, MatPaginatorModule,MatIconModule, MatSortModule,MatInputModule,MatSelectModule, MatButtonModule,MatFormFieldModule,MatDialogModule,MatSlideToggleModule, MatAutocompleteModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from "angularfire2/storage";
import { environment } from '../../../environments/environment';
import { BenefitsComponent } from './benefits/benefits.component';
import { NutritionsComponent } from './nutritions/nutritions.component';
import { CardComponent } from './card/card.component';
import { AllcardsComponent } from './allcards.component';

const routes = [
  {
    path: 'listing',
    component: AllcardsComponent
  },
  {
    path: 'card',
    component: CardComponent
  },
  {
    path: 'card/:id',
    component: CardComponent
  },
  {
    path: 'benefits',
    component: BenefitsComponent
  },
  {
    path: 'benefits/:id',
    component: BenefitsComponent
  },
  {
    path: 'nutrients',
    component: NutritionsComponent
  },
  {
    path: 'nutrients/:id',
    component: NutritionsComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  declarations: [BenefitsComponent, NutritionsComponent, CardComponent, AllcardsComponent]
})
export class AllcardsModule { }
