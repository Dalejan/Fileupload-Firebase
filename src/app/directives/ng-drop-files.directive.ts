import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileObject } from '../models/file-object.model';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() files: FileObject[] = [];
  @Output() evMouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.evMouseOver.emit(true);
    this.preventOpen(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.evMouseOver.emit(false);
    this.preventOpen(event);

  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    const transfer = this.getTransfer(event);

    if (!transfer) {
      return;
    }
    this.extractFiles(transfer.files);
    this.preventOpen(event);
    this.evMouseOver.emit(false);
  }

  private getTransfer(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private extractFiles(listFiles: FileList) {
    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(listFiles)) {
      const tempFile = listFiles[propiedad];

      if (this.fileCanLoad(tempFile)) {
        const newFile = new FileObject(tempFile);
        this.files.push(newFile);
      }
    }
  }

  private fileCanLoad(file: File): boolean {
    return !this.fileDropped(file.name) && this.isImage(file.type);
  }

  private preventOpen(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private fileDropped(fileName: string): boolean {
    for (const file of this.files) {
      if (file.fileName === fileName) {
        console.log('already uploaded', fileName)
        return true;
      }
    }
    return false;

  }

  private isImage(fileType: string): boolean {
    return (fileType === '' || fileType === undefined) ? false : fileType.startsWith('image');
  }
}
