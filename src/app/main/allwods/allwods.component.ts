import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { allWodsDataSource } from './allwods-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allwods',
  templateUrl: './allwods.component.html',
  styleUrls: ['./allwods.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class allwodsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: allWodsDataSource;
  displayedColumns = ['id', 'name', 'movements_description', 'type', 'rounds', 'action'];
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService,private route:Router) { }
  ngOnInit() {
    this.dataSource = new allWodsDataSource(this.paginator, this.sort, this.firebase);
  }
  editWods(row){
    this.route.navigate(['/wods/wod/'+row.id]);
  }
  removeWods(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`wods_bank/${row.id}`).delete();
        this.dataSource = new allWodsDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Wod Removed Successfully!', 'Success!');
      } 
    })
  }
}
