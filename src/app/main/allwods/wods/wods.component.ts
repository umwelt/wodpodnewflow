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
  selector: 'app-wods',
  templateUrl: './wods.component.html',
  styleUrls: ['./wods.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class WodsComponent implements OnInit {

  form: FormGroup; Modelref; _id; movements; sets; moves;
  typedata = ['for_time', 'for_reps', 'for_distance'];
  categorydata = ['beginner', 'advanced', 'intermediate'];
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router) { }
  ngOnInit() {
    this.getMovements();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.editWods(this._id);
    }
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      movements_description: [[], Validators.required],
      type: [[], Validators.required],
      category: [[], Validators.required],
      attempted: [false],
      ghost: [0, [Validators.min(1)]],
      captime: [0, [Validators.min(1)]],
      rounds: [0, [Validators.min(1)]],
      intensity: [0, [Validators.min(1)]],
      difficulty: [0, [Validators.min(1), Validators.max(5)]]
    });
  }
  onChange(rowdata) {
    this.sets = rowdata;
    this.moves = [];
    rowdata.forEach(element => {
      this.moves.push(element.display_name);
    });
  }
  addWods() {
    this.form.controls['movements_description'].patchValue(this.moves);
    var datapasser = {
      "info": this.form.value,
      "sets": this.sets
    }
    this.firebase.collection('wods_bank').add(datapasser);
  }
  compareFn(v1, v2): boolean {
    if (v1.display_name && v2.display_name) {
      return v1 && v2 ? v1.display_name === v2.display_name : v1 === v2;
    }
    return v1 && v2 ? v1 === v2 : v1.display_name === v2.display_name;
  }
  editWods(row) {
    this.Modelref = this.firebase.doc(`wods_bank/${row}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.patchValue(gotData.info);
      this.form.controls['movements_description'].patchValue(gotData.sets);
    });
  }
  updateWods() {
    this.form.controls['movements_description'].patchValue(this.moves);
    var datapasser = {
      "info": this.form.value,
      "sets": this.sets
    }
    this.Modelref.update(datapasser);
  }
  getMovements() {
    var movementdata = this.firebase.collection('movement_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    movementdata.subscribe(Eresult => {
      this.movements = Eresult;
    });
  }
  saveWods() {
    if (!this._id) {
      this.addWods();
    }
    else {
      this.updateWods();
    }
    this.route.navigate(['/wods/listing']);
    this.toastr.success('Wod Saved Successfully!', 'Success!');
  }

}
