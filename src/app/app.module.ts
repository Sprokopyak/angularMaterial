import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { FirebaseConfig } from '../environments/firebase.config';

import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { CafeModule } from './cafe/cafe.module';
import { AppRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { Home } from './home/home.component';
import { DirectivesModule } from './directives/directives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonsModule } from './commons/commons.module'

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    Home
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    MaterialModule,
    CoreModule,
    DirectivesModule,
    CafeModule,
    CommonsModule,
    AppRoutes,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
