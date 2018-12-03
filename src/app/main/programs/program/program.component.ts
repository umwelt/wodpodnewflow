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
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProgramComponent implements OnInit {
  form: FormGroup; Modelref; _id;
  constructor(private firebase: AngularFirestore, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router) { }
  authors; equipments;wods; types = ['time', 'reps', 'distance'];
  levels=['beginner', 'advanced', 'intermediate'];modes=['ghost','phantom','beast','normal','advanced'];
  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.editProgram(this._id);
    }
    this.getWods();
    this.getAuthors();
    this.getEquipments();
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      detail: ['', Validators.required],
      level: ['', Validators.required],
      type: ['', Validators.required],
      wods: [[], Validators.required],
      active: [false],
      mode: ['', Validators.required],
      trainer_tips:this._formBuilder.group({
        equipment: [[], Validators.required],
        tip: ['', Validators.required]
      }),
      author: ['',Validators.required],
      released:['',Validators.required],
      category_id:['',Validators.required],
      category_name:['',Validators.required],
      wods_inside:[0,[Validators.min(1)]],
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
  getWods() {
    var wodsdata = this.firebase.collection('wods_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    wodsdata.subscribe(Eresult => {
      this.wods = Eresult;
    });
  }
  getAuthors() {
    var authorsdata = this.firebase.collection('authors_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    authorsdata.subscribe(Mresult => {
      this.authors = Mresult;
    });
  }
  addProgram() {
    this.firebase.collection('programs_bank').add(this.form.value);
  }
  compareFn(v1, v2): boolean {
    return v1 && v2 ? v1.name === v2.name : v1 === v2;
  }
  editProgram(row) {
    this.Modelref = this.firebase.doc(`programs_bank/${row}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.patchValue(gotData);
      this.form.controls['wods'].patchValue(gotData.wods);
    });
  }
  updateProgram() {
    this.Modelref.update(this.form.value);
  }
  saveProgram() {
    if (!this._id) {
      this.addProgram();
    }
    else {
      this.updateProgram();
    }
    this.route.navigate(['/programs/listing']);
    this.toastr.success('Program Saved Successfully!', 'Success!');
  }
}
