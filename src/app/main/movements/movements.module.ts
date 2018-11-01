import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsComponent } from './movements.component';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { EquipmentsComponent } from './equipments/equipments.component';
import { MusclesComponent } from './muscles/muscles.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatFormFieldModule } from '@angular/material';

const routes = [
  {
    path: '',
    component: MovementsComponent
  },
  {
    path: 'muscles',
    component: MusclesComponent
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
    MatFormFieldModule
  ],
  declarations: [MovementsComponent, EquipmentsComponent, MusclesComponent]
})
export class MovementsModule { }
