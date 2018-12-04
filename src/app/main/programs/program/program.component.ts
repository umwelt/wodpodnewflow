import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatFormFieldControl, MatFormField, MatIcon } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { FirebaseApp } from "angularfire2";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
// import * as FB from 'firebase/storage';
import * as firebase from 'firebase/app';
import 'firebase/storage';



@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProgramComponent implements OnInit {
  form: FormGroup; Modelref; _id;
  constructor(private firebase: AngularFirestore, private app: FirebaseApp, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router) { }
  authors; equipments; woddata; types = ['time', 'reps', 'distance']; tiers = ['basic', 'advanced', 'super'];
  levels = ['beginner', 'advanced', 'intermediate']; modes = ['ghost', 'phantom', 'beast', 'normal', 'advanced'];
  private basePath: string = '/uploads';
  ngOnInit() {
    this.getWods();
    this.getAuthors();
    this.getEquipments();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.editProgram(this._id);
    }
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      detail: ['', Validators.required],
      level: ['', Validators.required],
      type: ['', Validators.required],
      wods: [[], Validators.required],
      active: [false],
      mode: ['', Validators.required],
      trainer_tips: this._formBuilder.group({
        equipment: [[], Validators.required],
        tip: ['', Validators.required]
      }),
      images: [''],
      author: ['', Validators.required],
      released: ['', Validators.required],
      category_id: ['', Validators.required],
      category_name: ['', Validators.required],
      wods_inside: [0, [Validators.min(1)]],
      purchase: this._formBuilder.group({
        tier: ['', Validators.required],
        promo: ['', Validators.required],
        purchased: [false],
        restored: [false],
        price: [0, Validators.required]
      }),
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
      this.woddata = Eresult;
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
  compareFn1(v1, v2): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
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
  pushFile(file) {
    let storage = this.app.storage().ref();
    let uploadTask = storage.child(`${this.basePath}/${file.target.file}`).put(file.target.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        // upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        console.log(uploadTask.snapshot.downloadURL);

        // upload.url = uploadTask.snapshot.downloadURL
        // upload.name = upload.file.name
        // this.saveFileData(upload)
      }
    );
  }
  saveProgram() {
    // this.pushFile();
    // console.log(this.form.value);

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
