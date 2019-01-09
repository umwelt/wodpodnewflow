import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
import { MovementsModule } from "app/main/movements/movements.module";
import { allWodsModule } from "app/main/allwods/allwods.module";
import { AllcardsModule } from "app/main/allcards/allcards.module";
import { LandingpageModule } from "app/main/landingpage/landingpage.module";

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';

const appRoutes: Routes = [    
    {
        path        : '',
        loadChildren: './main/landingpage/landingpage.module#LandingpageModule'
    },
    {
        path        : 'administration/apps',
        loadChildren: './main/apps/apps.module#AppsModule'
    },
    {
        path        : 'administration/movements',
        loadChildren: './main/movements/movements.module#MovementsModule'
    },
    {
        path        : 'administration/programs',
        loadChildren: './main/programs/programs.module#ProgramsModule'
    },
    {
        path        : 'administration/cards',
        loadChildren: './main/allcards/allcards.module#AllcardsModule'
    },
    {
        path        : 'administration/wods',
        loadChildren: './main/allwods/allwods.module#allWodsModule'
    },
    {
        path        : 'administration/pages',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    {
        path        : 'ui',
        loadChildren: './main/ui/ui.module#UIModule'
    },
    // {
    //     path        : 'documentation',
    //     loadChildren: './main/documentation/documentation.module#DocumentationModule'
    // },
    // {
    //     path        : 'angular-material-elements',
    //     loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    // },
    {
        path      : '**',
        redirectTo: 'administration/pages/auth/login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes,{ useHash: true }),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        ToastrModule.forRoot(),
        // App modules
        LayoutModule,
        AppStoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireDatabaseModule
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
