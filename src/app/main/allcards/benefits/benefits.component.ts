import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { BenefitsDataSource } from './benefits-datasource';
import { AngularFirestore } from "angularfire2/firestore";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class BenefitsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: BenefitsDataSource;

  showCard = false; isEditMode = false;
  form: FormGroup; Modelref;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'action'];

  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService) { }
  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.dataSource = new BenefitsDataSource(this.paginator, this.sort, this.firebase);
  }

  addBenefit() {
    this.showCard = false;
    debugger
    if (!this.isEditMode) {
      this.firebase.collection('/benefits_bank').add({ name: this.form.controls['name'].value });
      this.dataSource = new BenefitsDataSource(this.paginator, this.sort, this.firebase);
      this.ngOnInit();
    } else {
      this.Modelref.update({ name: this.form.controls['name'].value });
      this.dataSource = new BenefitsDataSource(this.paginator, this.sort, this.firebase);
      this.ngOnInit();
    }
    this.toastr.success('Benefit Saved Successfully!', 'Success!');
  }
  editBenefit(row) {
    this.Modelref = this.firebase.doc(`benefits_bank/${row.id}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
      this.isEditMode = true;
      this.showCard = true;
    });
  }
  getbyId(row) {
    this.firebase.doc(`benefits_bank/${row.id}`).get().subscribe(res => {
      let gotData = res.data();
      this.form.controls['name'].patchValue(gotData.name);
    });
  }
  removeBenefit(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.firebase.doc(`benefits_bank/${row.id}`).delete();
        this.dataSource = new BenefitsDataSource(this.paginator, this.sort, this.firebase);
        this.toastr.success('Benefit Removed Successfully!', 'Success!');
      }
    })
  }
}
