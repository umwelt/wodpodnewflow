import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { MusclesDataSource } from './muscles-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


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
  showCard = false; isEditMode = false;
  form: FormGroup; Modelref;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'action'];

  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService) { }
  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z]+.*$")])]
    });
    this.dataSource = new MusclesDataSource(this.paginator, this.sort, this.firebase);
  }
  addMuscle() {
    this.showCard = false;
    if (!this.isEditMode) {
      this.firebase.collection('/muscles_bank').add({ name: this.form.controls['name'].value });
      this.dataSource = new MusclesDataSource(this.paginator, this.sort, this.firebase);
      // this.form.controls['name'].patchValue('');
      this.ngOnInit();
    } else {
      this.Modelref.update({ name: this.form.controls['name'].value });
      this.dataSource = new MusclesDataSource(this.paginator, this.sort, this.firebase);
      // this.form.controls['name'].patchValue('');
      this.ngOnInit();
    }
    this.toastr.success('Muscle Saved Successfully!', 'Success!');
  }
  editMuscle(row) {
    this.Modelref = this.firebase.doc(`muscles_bank/${row.id}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
      this.isEditMode = true;
      this.showCard = true;
    });
  }
  getbyId(row) {
    this.firebase.doc(`muscles_bank/${row.id}`).get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
    });
  }
  removeMuscle(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`muscles_bank/${row.id}`).delete();
        this.dataSource = new MusclesDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Muscle Removed Successfully!', 'Success!');
      } 
    })
  }
}
