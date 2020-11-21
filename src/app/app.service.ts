import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get windowRef() {
    return window;
  }

  get firebase() {
    return firebase;
  }
}
