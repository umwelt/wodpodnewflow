import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AngularFirestore } from "angularfire2/firestore";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProgramComponent implements OnInit {
  uploadTask: AngularFireUploadTask;
  form: FormGroup; Modelref; _id; imgsrc; wods; gotwoddata;
  constructor(private firebase: AngularFirestore, private Fstorage: AngularFireStorage, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router, public dialog: MatDialog) { }
  authors; equipments; woddata; allwoddata; types = ['time', 'reps', 'distance']; tiers = ['basic', 'advanced', 'super'];
  levels = ['beginner', 'advanced', 'intermediate']; modes = ['ghost', 'phantom', 'beast', 'normal', 'advanced'];

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
      // wods:this._formBuilder.array([this.createItems()]),
      active: [false],
      mode: ['', Validators.required],
      trainer_tips: this._formBuilder.group({
        equipment: [[], Validators.required],
        tip: ['', Validators.required]
      }),
      images: [''],
      author: ['', Validators.required],
      released: [''],
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
    if (localStorage.getItem('filledData')) {
      let x = JSON.parse(localStorage.getItem('filledData'));
      this.form.patchValue(x);
    }
    // this.form.controls['wods_inside'].disable();
  }
  createItems(): FormGroup {
    return this._formBuilder.group({
      wod: ['', Validators.required]
    })
  }
  addItems() {
    (<FormArray>this.form.get('wods')).push(this.createItems());
  }
  removeItems(i) {
    const md = <FormArray>this.form.controls['wods'];
    md.removeAt(i);
    this.onChange(i);
  }
  onChange(rowdata) {
    this.wods = [];
    this.form.controls['wods'].value.forEach(element => {
      this.wods.push({ name: element });
    });
    this.form.controls['wods_inside'].patchValue(this.wods.length);
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
      this.allwoddata = Eresult;
      var added = JSON.parse(localStorage.getItem('addedWods'));
      if (added) {
        this.woddata = Eresult.filter((ddr) => added.indexOf(ddr.id) >= 0);
        this.form.controls['wods_inside'].patchValue(added.length);
        this.form.controls['wods'].patchValue(added);
      }
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
    var proId = this.firebase.collection('programs_bank').add(this.form.value);
    proId.then((data) => {
      console.log(this.wods);
      debugger;
    })
  }
  compareFn(v1, v2): boolean {
    if (v1.name && v2.name) {
      return v1 && v2 ? v1.name === v2.name : v1 === v2;
    }
    return v1 && v2 ? v1 === v2 : v1.name === v2.name;
  }
  compareFn1(v1, v2): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }
  editProgram(row) {
    this.Modelref = this.firebase.doc(`programs_bank/${row}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.patchValue(gotData);
      if (gotData.released.seconds) {
        this.form.controls['released'].patchValue(new Date(gotData.released.seconds * 1000));
      }
      else {
        this.form.controls['released'].patchValue(new Date(gotData.released));
      }
      this.imgsrc = gotData.images;
      this.gotwoddata = gotData.wods;
      if(!localStorage.getItem('editmode')){
        this.woddata = this.allwoddata.filter((ddr) => gotData.wods.indexOf(ddr.id) >= 0);
        this.form.controls['wods_inside'].patchValue(this.woddata.length);
        this.form.controls['wods'].patchValue(this.woddata);
      }else{
        var temp=JSON.parse(localStorage.getItem('addedWods'));
        this.form.controls['wods_inside'].patchValue(temp.length);
        this.form.controls['wods'].patchValue(temp);
      }
      // gotData.wods.forEach((ele, idx) => {
      //   if(idx>0)
      //   this.addItems();
      // });
      // this.form.controls['wods'].patchValue(gotData.wods);
    });
  }
  updateProgram() {
    this.Modelref.update(this.form.value);
  }
  pushFile(event) {
    let filePath = '/wods_programs/' + event.target.files[0].name;
    this.uploadTask = this.Fstorage.upload(filePath, event.target.files[0]);
    const fileRef = this.Fstorage.ref(filePath);
    this.uploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.imgsrc = fileRef.getDownloadURL();
        this.imgsrc.subscribe(url => {
          this.imgsrc = url;
          this.form.controls['images'].patchValue(this.imgsrc);
        });
      })
    ).subscribe();
  }
  popFile(item) {
    this.imgsrc = '';
    this.form.controls['images'].patchValue(this.imgsrc);
    return this.Fstorage.storage.refFromURL(item).delete();
  }
  addWod() {
    localStorage.setItem('addwoder', 'true');
    if (this._id) {
      localStorage.setItem('editmode', this._id);
      localStorage.setItem('addedWods', JSON.stringify(this.gotwoddata));
    }
    localStorage.setItem('filledData', JSON.stringify(this.form.value));
    this.route.navigate(['administration/wods/wod']);
  }
  saveProgram() {
    if (!localStorage.getItem('addwoder') && this.form.value.released._d) {
      this.form.controls.released.patchValue(this.form.value.released._d);
    }
    else {
      this.form.controls.released.patchValue(this.form.value.released);
    }
    if (!this._id) {
      this.addProgram();
    }
    else {
      this.updateProgram();
    }
    //ahiya update karavano code karvo pdse evu lage
    // this.db.doc(`jobs/${job.id}`).update({name:profile.name});
    // localStorage.removeItem('addwoder');
    // localStorage.removeItem('filledData');
    // localStorage.removeItem('addedWods');
    localStorage.removeItem('editmode');    
    this.route.navigate(['/administration/programs/listing']);
    this.toastr.success('Program Saved Successfully!', 'Success!');
  }
  // ngOnDestroy(){
  //   // Need to check for remove this vals on route changes
  //   localStorage.removeItem('addwoder');
  //   localStorage.removeItem('filledData');
  //   localStorage.removeItem('addedWods');
  //   alert('ave to che!');
  // }
}
