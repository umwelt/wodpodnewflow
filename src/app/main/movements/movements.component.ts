import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { MovementsDataSource } from './movements-datasource';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MovementsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MovementsDataSource;
  displayedColumns = ['id', 'display_name', 'primary_muscles', 'secondary_muscles', 'equipments', 'difficulty', 'action'];
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService,private route:Router) { }
  ngOnInit() {
    this.dataSource = new MovementsDataSource(this.paginator, this.sort, this.firebase);
  }
  editMovement(row){
    this.route.navigate(['/movements/movement/'+row.id]);
  }
  removeMovement(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`movements_bank/${row.id}`).delete();
        this.dataSource = new MovementsDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Movement Removed Successfully!', 'Success!');
      } 
    })
  }
}
