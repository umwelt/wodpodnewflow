import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { ProgramsDataSource } from './programs-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProgramsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ProgramsDataSource;
  displayedColumns = ['id', 'name', 'level', 'category_name','action'];
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService,private route:Router) { }
  ngOnInit() {
    this.dataSource = new ProgramsDataSource(this.paginator, this.sort, this.firebase);
  }
  editProgram(row){
    this.route.navigate(['/programs/program/'+row.id]);
  }
  removeProgram(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`programs_bank/${row.id}`).delete();
        this.dataSource = new ProgramsDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Program Removed Successfully!', 'Success!');
      } 
    })
  }
}
