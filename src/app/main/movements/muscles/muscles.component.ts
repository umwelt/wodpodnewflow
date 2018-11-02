import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField } from '@angular/material';
import { MusclesDataSource } from './muscles-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-muscles',
  templateUrl: './muscles.component.html',
  styleUrls: ['./muscles.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class MusclesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MusclesDataSource;
  showCard = false;
  form: FormGroup;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'action'];

  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder) { }
  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.dataSource = new MusclesDataSource(this.paginator, this.sort, this.firebase);
  }
  addMuscle() {
    debugger
    this.firebase.collection('/muscles_bank').add({ name: this.form.controls['name'].value });
  }
}
