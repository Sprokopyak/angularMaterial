import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

import { AuthService } from './auth-service/auth.service';
import { UserService } from './user-service/user.service';
import { CafeService } from './cafe-service/cafe.service';
import { AdminGuard } from './admin-guard/admin.guard';
import { LoginGuard } from './login-guard/login.guard';
import { ImageUploadService } from './image-upload/image-upload.service';
import { RatingService } from './rating-service/rating.service';
import { InfinityScrollService } from './infinity-scroll/infinity-scroll.service';

@NgModule({
  imports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AdminGuard,
    LoginGuard,
    AuthService,
    UserService,
    AngularFireDatabase,
    CafeService,
    ImageUploadService,
    RatingService,
    InfinityScrollService
  ]
})
export class CoreModule {}
