import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MovementComponent implements OnInit {
  form: FormGroup; Modelref; _id;
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router) { }
  muscles; equipments; types = ['time', 'reps', 'distance'];
  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.editMovement(this._id);
    }
    this.getMuscles();
    this.getEquipments();
    this.form = this._formBuilder.group({
      display_name: ['', Validators.required],
      description: ['', Validators.required],
      primary_muscles: [[], Validators.required],
      secondary_muscles: [[], Validators.required],
      equipments: [[], Validators.required],
      weight: [false],
      double_weight: [false],
      cardio: [false],
      type: ['', Validators.required],
      difficulty: [0, [Validators.min(1), Validators.max(5)]]
    });
  }
  getEquipments() {
    var equipmentdata = this.firebase.collection('equipment_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    equipmentdata.subscribe(Eresult => {
      this.equipments = Eresult;
    });
  }
  getMuscles() {
    var musclesdata = this.firebase.collection('muscles_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    musclesdata.subscribe(Mresult => {
      this.muscles = Mresult;
    });
  }
  addMovement() {
    this.firebase.collection('movement_bank').add(this.form.value);
  }
  compareFn(v1, v2): boolean {
    return v1 && v2 ? v1.name === v2.name : v1 === v2;
  }
  editMovement(row) {
    this.Modelref = this.firebase.doc(`movement_bank/${row}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.patchValue(gotData);
      this.form.controls['primary_muscles'].patchValue(gotData.primary_muscles);
      // this.form.controls['primary_muscles'].setParent(gotData.primary_muscles);
      // this.form.controls['secondary_muscles'].setValue(gotData.secondary_muscles);
      //this.form.controls['primary_muscles'].setValue(this.muscles.filter(c => c.id == gotData.primary_muscles.id));
    });
  }
  updateMovement() {
    this.Modelref.update(this.form.value);
  }
  saveMovement() {
    if (!this._id) {
      this.addMovement();
    }
    else {
      this.updateMovement();
    }
    this.route.navigate(['/movements/listing']);
    this.toastr.success('Movement Saved Successfully!', 'Success!');
  }
}
