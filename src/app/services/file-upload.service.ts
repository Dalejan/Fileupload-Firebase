import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileObject } from '../models/file-object.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private IMAGES_DIR = 'img';

  constructor(private db: AngularFirestore) { }

  loadImagesFirebase(images: FileObject[]) {
    const storageRef = firebase.storage().ref();
    for (const item of images) {
      item.isLoading = true;
      if (item.loading >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.IMAGES_DIR}/${item.fileName}`).put(item.file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          item.loading = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => console.log('error', error),
        () => {
          console.log('se cargó la imagen');

          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            item.url = downloadURL;
            item.isLoading = false;
            // Guardamos los datos de la imagen en la BD
            this.saveImage({
              name: item.fileName,
              url: item.url
            });
          });
        }
      )
    }
  }

  private saveImage(image: { name: string, url: string }) {
    this.db.collection(`/${this.IMAGES_DIR}`).add(image);
  }
}
