import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatTableModule, MatPaginatorModule,MatIconModule, MatSortModule,MatInputModule,MatSelectModule, MatButtonModule,MatFormFieldModule,MatDialogModule,MatSlideToggleModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';
import { allwodsComponent } from "./allwods.component";
import { WodsComponent } from './wods/wods.component';


const routes = [
  {
    path: 'listing',
    component: allwodsComponent
  },
  {
    path: 'wod',
    component: WodsComponent
  },
  {
    path: 'wod/:id',
    component: WodsComponent
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  declarations: [allwodsComponent,WodsComponent]
})
export class allWodsModule { }
