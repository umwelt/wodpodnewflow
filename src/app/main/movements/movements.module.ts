import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsComponent } from './movements.component';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { EquipmentsComponent } from './equipments/equipments.component';
import { MusclesComponent } from './muscles/muscles.component';
import { MatTableModule, MatPaginatorModule,MatIconModule, MatSortModule,MatInputModule,MatSelectModule, MatButtonModule,MatFormFieldModule,MatDialogModule,MatSlideToggleModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';
import { MovementComponent } from './movement/movement.component';

const routes = [
  {
    path: 'listing',
    component: MovementsComponent
  },
  {
    path: 'muscles',
    component: MusclesComponent
  },
  {
    path: 'equipments',
    component: EquipmentsComponent
  },
  {
    path: 'movement',
    component: MovementComponent
  },
  {
    path: 'movement/:id',
    component: MovementComponent
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
  declarations: [MovementsComponent, EquipmentsComponent, MusclesComponent, MovementComponent]
})
export class MovementsModule { }
