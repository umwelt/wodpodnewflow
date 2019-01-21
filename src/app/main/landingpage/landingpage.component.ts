import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { HttpClient } from "@angular/common/http";

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
  constructor(private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,private http:HttpClient) {
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
    // this.target=el;
    // this.target.nativeElement.scrollIntoView();
    // this.target.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    el.scrollIntoView();
  }
  scrollable() {
    console.log(document.getElementsByClassName('ps__rail-y'));
    // console.log(document.body.scrollTop);
    // console.log(document.documentElement.scrollTop);    
    document.getElementsByClassName("hide-slot").item(0).setAttribute('style', 'opacity:0;');
    document.getElementsByClassName("bottom-scroll-nav").item(0).setAttribute('style', 'opacity:0;')
    document.getElementsByClassName("position-header").item(0).setAttribute('style', 'opacity:1; top:0;')  
  }
  subscribeIt(){
    // this.http.post()
  }

}
