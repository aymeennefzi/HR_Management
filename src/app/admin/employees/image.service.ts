import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private imageUpdatedSource = new Subject<string>();
  imageUpdated$ = this.imageUpdatedSource.asObservable();

  constructor() { }

  emitImageUpdated(imageUrl: string) {
    this.imageUpdatedSource.next(imageUrl);
  }
}

