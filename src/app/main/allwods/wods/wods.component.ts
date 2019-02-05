import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon, MatAutocomplete } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
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

  form: FormGroup; Modelref; _id; movements; sets; moves; addedRow;
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
      movements_description: this._formBuilder.array([this.createItems()]),
      // movements_description: [[], Validators.required],
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
  createItems(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      reps: [0, [Validators.min(1), Validators.max(5)]]
    })
  }
  addItems() {
    (<FormArray>this.form.get('movements_description')).push(this.createItems());
  }
  removeItems(i) {
    const md = <FormArray>this.form.controls['movements_description'];
    md.removeAt(i);
    this.onChange(i);
  }
  onChange(rowdata) {
    this.sets = [];
    this.moves = [];
    this.form.controls['movements_description'].value.forEach(element => {
      if(element.name.display_name){
        this.moves.push({ name: element.name.display_name, reps: element.reps });
        this.sets.push({set:element.name,reps:element.reps});
      }
    });
    // this.form.controls['movements_description'].patchValue(this.moves);
  }
  addWods() {
    this.onChange('temp');
    this.form.controls['movements_description'].patchValue(this.moves);
    var datapasser = {
      "info": this.form.value,
      "fromProgram":"",
      "sets": this.sets
    }
    this.addedRow=this.firebase.collection('wods_bank').add(datapasser);
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
      let temp = [];
      gotData.sets.forEach((ele, idx) => {
        if (idx > 0)
          this.addItems();
        temp.push({ name: ele.set, reps: gotData.info.movements_description[idx].reps });
      });
      this.form.controls['movements_description'].patchValue(temp);
    });
  }
  updateWods() {
    this.onChange('temp');
    this.form.controls['movements_description'].patchValue(this.moves);
    var datapasser = {
      "info": this.form.value,
      "fromProgram":"",
      "sets": this.sets
    }
    this.Modelref.update(datapasser);
  }
  getMovements() {
    var movementdata = this.firebase.collection('movements_bank').snapshotChanges().pipe(
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
    if (localStorage.getItem('filledData')) {
      this.addedRow.then((dt)=>{
        if(!localStorage.getItem('addedWods')){
          var x=[];
          x.push(dt.id);          
          localStorage.setItem('addedWods',JSON.stringify(x));
        }
        else{
          var x=[];
          var temper=JSON.parse(localStorage.getItem('addedWods'));
          x=temper;
          x.push(dt.id);
          localStorage.setItem('addedWods',JSON.stringify(x));
        }
      })
      if(localStorage.getItem('editmode')){
        this.route.navigate(['/administration/programs/program/'+localStorage.getItem('editmode')]);
      }
      else{
        this.route.navigate(['/administration/programs/program']);
      }
    } else {
      this.route.navigate(['/administration/wods/listing']);
    }
    this.toastr.success('Wod Saved Successfully!', 'Success!');
  }

}
