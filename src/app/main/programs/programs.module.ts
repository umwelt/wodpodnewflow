import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsComponent } from './programs.component';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthorsComponent } from './author/authors.component';
import { MatTableModule, MatPaginatorModule,MatIconModule, MatSortModule,MatInputModule,MatSelectModule, MatButtonModule,MatFormFieldModule,MatDialogModule,MatSlideToggleModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';
import { ProgramComponent } from './program/program.component';

const routes = [
  {
    path: 'listing',
    component: ProgramsComponent
  },
  {
    path: 'authors',
    component: AuthorsComponent
  },
  {
    path: 'program',
    component: ProgramComponent
  },
  {
    path: 'program/:id',
    component: ProgramComponent
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
  declarations: [ProgramsComponent, ProgramComponent , AuthorsComponent]
})
export class ProgramsModule { }
