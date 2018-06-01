import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

import { Upload } from '../models/image-upload.model';
import { Observable, Subject, forkJoin } from 'rxjs';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class ImageUploadService {
  public file;
  private basePath: string = '/mainPhotos';
  completed$ = new Subject<Upload>();
  uploading$ = new Subject<number>();
  completedMulti$ = new Subject<Upload>();

  constructor(private db: AngularFireDatabase, private dialog: MatDialog) { }
  showMessageDialog(message: string): void {
    this.dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  uploadSingle(event, path?:string) {
    let storageRef = firebase.storage().ref();
    this.file = event.target.files[0];

    if (this.file.type.split('/')[0] !== 'image') {
       this.showMessageDialog('Невірний формат файлу, виберіть зображення');
       return;
    } else {
      const upload = new Upload(this.file)
      let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
      this.uploadToDB(uploadTask, upload)
    }
  }

  uploadToDB(uploadTask, upload): any {
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress = ((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100).toString().split('.')[0];
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

  uploadMulti(upload: Upload, path?:string){
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${path}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
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

        forkJoin([upload]).subscribe(t=> {
          console.log(t);
          
        });
        this.completedMulti$.next(upload);
        this.uploading$.next(null);
      }
    );
  }

}