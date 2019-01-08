import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from "./landingpage.component";
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule,MatIconModule, MatSortModule,MatInputModule,MatSelectModule, MatButtonModule,MatFormFieldModule,MatDialogModule,MatSlideToggleModule } from '@angular/material';
const routes = [
  {
    path: '',
    component: LandingpageComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [LandingpageComponent]
})
export class LandingpageModule { }
