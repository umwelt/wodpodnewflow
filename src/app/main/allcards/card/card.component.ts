import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AngularFirestore } from "angularfire2/firestore";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray,FormControl, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  uploadTask: AngularFireUploadTask;
  form: FormGroup; Modelref; _id;imgsrc;nutrients;
  constructor(private firebase: AngularFirestore,private Fstorage:AngularFireStorage, private _formBuilder: FormBuilder, public toastr: ToastrService, private activatedRoute: ActivatedRoute, private route: Router,public dialog: MatDialog) { }
  benefitsdata; nutrientsdata; 
  
  ngOnInit() {
    this.getBenefits();
    this.getNutrients();
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.editCard(this._id);
    }
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      orientation: ['', Validators.required],
      nutrients:this._formBuilder.array([this.createItems()]),
      liked: [false],
      inserted: ['', Validators.required],
      images: [''],
      scientific_name: ['', Validators.required],
      benefits: [[], [Validators.required]],
      energy: [0, [Validators.min(1)]],
      fat: [0, [Validators.min(1)]],
      saturated: [0, [Validators.min(1)]],
      trans: [0, [Validators.min(1)]],
      carbohydrate: [0, [Validators.min(1)]],
      sugars: [0, [Validators.min(1)]],
      fiber: [0, [Validators.min(1)]],
      protein: [0, [Validators.min(1)]]
    });
  }
  createItems(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      percentage: [0]
    })
  }
  addItems() {
    (<FormArray>this.form.get('nutrients')).push(this.createItems());
  }
  removeItems(i) {
    const md = <FormArray>this.form.controls['nutrients'];
    md.removeAt(i);
    this.onChange(i);
  }
  onChange(rowdata) {
    this.nutrients = [];
    this.form.controls['nutrients'].value.forEach(element => {
      this.nutrients.push({ name: element});
    });
  }
  getNutrients() {
    var etdata = this.firebase.collection('nutrients_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    etdata.subscribe(Eresult => {
      this.nutrientsdata = Eresult;
    });
  }
  getBenefits() {
    var wodsdata = this.firebase.collection('benefits_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    wodsdata.subscribe(Eresult => {
      this.benefitsdata = Eresult;
    });
  }
  addCard() {
    this.firebase.collection('cards_bank').add(this.form.value);
  }
  compareFn(v1, v2): boolean {
    if (v1.name && v2.name) {
      return v1 && v2 ? v1.name === v2.name : v1 === v2;
    }
    return v1 && v2 ? v1 === v2 : v1.name === v2.name;
  }
  editCard(row) {
    this.Modelref = this.firebase.doc(`cards_bank/${row}`);
    this.Modelref.get().subscribe(res => {
      let gotData = res.data();
      this.form.patchValue(gotData);
      this.imgsrc=gotData.images;
      gotData.nutrients.forEach((ele, idx) => {
        if(idx>0)
        this.addItems();
      });
      this.form.controls['nutrients'].patchValue(gotData.nutrients);
    });
  }
  updateCard() {
    this.Modelref.update(this.form.value);
  }
  pushFile(event) {
    let filePath='/cards_img/'+event.target.files[0].name;
    this.uploadTask= this.Fstorage.upload(filePath, event.target.files[0]);    
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
  popFile(item){
    this.imgsrc='';
    this.form.controls['images'].patchValue(this.imgsrc);
    return this.Fstorage.storage.refFromURL(item).delete();
  }
  saveCard() {
    if (!this._id) {
      this.addCard();
    }
    else {
      this.updateCard();
    }
    this.route.navigate(['/cards/listing']);
    this.toastr.success('Card Saved Successfully!', 'Success!');
  }
}
