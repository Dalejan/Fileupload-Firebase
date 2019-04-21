import { Component, OnInit } from '@angular/core';
import { FileObject } from 'src/app/models/file-object.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styles: []
})
export class LoadComponent implements OnInit {

  files: FileObject[] = [];
  isOverDrop = false;

  constructor(private fileService: FileUploadService) { }

  ngOnInit() {
  }

  loadImages() {
    this.fileService.loadImagesFirebase(this.files);
  }

  clean() {
    this.files = [];
  }
}
