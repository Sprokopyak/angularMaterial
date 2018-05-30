import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

import { Upload } from '../models/image-upload.model';
import { Subject } from 'rxjs';

@Injectable()
export class ImageUploadService {
  constructor(private db: AngularFireDatabase) { }

  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;
  completed$ = new Subject<Upload>();
  uploading$ = new Subject<number>();

  pushUpload(upload: Upload){
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        this.uploading$.next(upload.progress);
        console.log(upload.progress);
      }, 
      (error) => {
        console.log(error)
      },
      () => {
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.completed$.next(upload);
        this.uploading$.next(null);
      }
    );
  }
}