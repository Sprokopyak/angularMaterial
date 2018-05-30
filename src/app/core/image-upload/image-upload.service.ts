import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

import { Upload } from '../models/image-upload.model';
import { Observable, of } from 'rxjs';


@Injectable()
export class ImageUploadService {
  constructor(private db: AngularFireDatabase) { }

  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;


  pushUpload(upload: Upload){
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        console.log(upload.progress);
      },
      (error) => {
        console.log(error)
      },
      () => {
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        console.log(upload)
      }
    )
  }
     
}