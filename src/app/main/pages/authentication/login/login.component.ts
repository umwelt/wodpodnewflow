import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public afAuth: AngularFireAuth,
        public route: Router,
        public snack: MatSnackBar,
        public toastr:ToastrService
    ) {
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    firelogin() {
        this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
            .then((doc) => {
                console.log(doc);
                this.toastr.success('User Login Successfully!', 'Success!');
                // this.snack.open('User Login Successfully!', 'Success!', {
                //     duration: 3000,
                // });
                localStorage.setItem('fireToken',JSON.stringify(doc));
                setTimeout(() => {
                    this.route.navigate(['/apps/dashboards/analytics']);
                },800);
            }).catch((er) => {
                console.log(er);
                this.toastr.error(er.message, 'Error!');                
                // this.snack.open(er.message, er.code, {
                //     duration: 5000,
                // });
            })
    }
}
