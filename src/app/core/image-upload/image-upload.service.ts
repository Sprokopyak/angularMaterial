import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { Upload } from '../models/image-upload.model';
import { Observable, Subject } from 'rxjs';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';
import { each, range } from "lodash";

@Injectable()
export class ImageUploadService {
  public file;
  private _mainPhotos: string = '/mainPhotos';
  private _galaryPhotos: string = '/galaryPhotos';
  completed$ = new Subject<Upload>();
  uploading$ = new Subject<number>();
  completedMulti$ = new Subject<Upload>();
  selectedFiles: FileList;
  uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

  constructor(private dialog: MatDialog) { }

  showMessageDialog(message: string) {
    this.dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  uploadSingle(event) {
    let storageRef = firebase.storage().ref();
    this.file = event.target.files[0];

    if (this.file.type.split('/')[0] !== 'image') {
       this.showMessageDialog('Невірний формат файлу, виберіть зображення');
       return;
    } else {
      const upload = new Upload(this.file)
      let uploadTask = storageRef.child(`${this._mainPhotos}/${this.uniqueId + upload.file.name}`).put(upload.file);
      this.uploadToDB(uploadTask, upload, 'single')
    }
  }

  uploadToDB(uploadTask, upload, type?:string) {
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress = ((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100).toString().split('.')[0];
        this.uploading$.next(upload.progress);
      },
      (error) => {
        console.log(error)
      },
      () => {
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        upload.fullPath = uploadTask.snapshot.ref.fullPath
    
        type === 'single' ? this.completed$.next(upload) : this.completedMulti$.next(upload);
        this.uploading$.next(null);
      }
    );
  }

  uploadMulti(event){
    let storageRef = firebase.storage().ref();
    this.selectedFiles = event.target.files;
    let files = this.selectedFiles;
              
    let filesIndex = range(files.length);
    each(filesIndex, (idx) => {
      if (files[idx].type.split('/')[0] !== 'image') {
        this.showMessageDialog('Невірний формат файлу, виберіть зображення');
        return;
      } else {
        const upload = new Upload( files[idx]);
        let uploadTask:any = storageRef.child(`${this._galaryPhotos}/${this.uniqueId + upload.file.name}`).put(upload.file);
        this.uploadToDB(uploadTask, upload);
      }
    })
  }

  removeImg(imgPath) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${imgPath}`).delete()
    .catch(error => console.log(error));
  }

}