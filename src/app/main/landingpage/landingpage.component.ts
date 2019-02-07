import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'environments/environment';
import {MatDialog} from '@angular/material';
import { DialogerComponent } from "./dialoger/dialoger.component";
import { AngularFirestore } from 'angularfire2/firestore';
declare var $: any;
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LandingpageComponent implements OnInit {
  landForm: FormGroup;
  // @ViewChild('target') target: ElementRef;
  constructor(private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder, private http: HttpClient,public dialog: MatDialog,private firebase: AngularFirestore,) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollable, true);
    this.landForm = this._formBuilder.group({
      emailaddress: ['', [Validators.required, Validators.email]]
    });

  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollable, true);
  }
  scrolldown(el) {
    el.scrollIntoView();
  }
  scrollable() {
    var attributes = document.getElementsByClassName('ps__rail-y')[0].getAttribute('style');
    var offset = attributes.split(' ');
    if (parseInt(offset[1]) >= 300) {
      document.getElementsByClassName("hide-slot").item(0).setAttribute('style', 'opacity:0;');
      document.getElementsByClassName("bottom-scroll-nav").item(0).setAttribute('style', 'opacity:0;')
      document.getElementsByClassName("position-header").item(0).setAttribute('style', 'opacity:1; top:0;')
    }
    else {
      document.getElementsByClassName("hide-slot").item(0).setAttribute('style', 'opacity:1;');
      document.getElementsByClassName("bottom-scroll-nav").item(0).setAttribute('style', 'opacity:1;')
      document.getElementsByClassName("position-header").item(0).setAttribute('style', 'opacity:0; top:-79px;')
    }
  }
  subscribeIt() {
    this.firebase.collection('/subscribers_bank').add({ subscriber: this.landForm.controls['emailaddress'].value });
    const dialogRef = this.dialog.open(DialogerComponent, {
      width: '700px',
    });
    this.landForm.controls['emailaddress'].patchValue('');
  }

}
