import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { AuthorsDataSource } from './authors-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AuthorsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: AuthorsDataSource;
  showCard = false; isEditMode = false;
  form: FormGroup; Modelref;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'action'];

  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService) { }
  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required]
      // name: ['', [Validators.required,this.spacer]]
    });
    this.dataSource = new AuthorsDataSource(this.paginator, this.sort, this.firebase);
  }

  addAuthor() {
    this.showCard = false;
    if (!this.isEditMode) {
      this.firebase.collection('/authors_bank').add({ name: this.form.controls['name'].value });
      this.dataSource = new AuthorsDataSource(this.paginator, this.sort, this.firebase);
      this.ngOnInit();
    } else {
      this.Modelref.update({ name: this.form.controls['name'].value });
      this.dataSource = new AuthorsDataSource(this.paginator, this.sort, this.firebase);
      this.ngOnInit();
    }
    this.toastr.success('Author Saved Successfully!', 'Success!');
  }
  editAuthor(row) {
    this.Modelref = this.firebase.doc(`authors_bank/${row.id}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
      this.isEditMode = true;
      this.showCard = true;
    });
  }
  getbyId(row) {
    this.firebase.doc(`authors_bank/${row.id}`).get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
    });
  }
  removeAuthor(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`authors_bank/${row.id}`).delete();
        this.dataSource = new AuthorsDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Author Removed Successfully!', 'Success!');
      } 
    })
  }

}
