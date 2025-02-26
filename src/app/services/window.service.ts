import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private closeWindowSubject = new Subject<string>();
  closeWindow$ = this.closeWindowSubject.asObservable();

  closeWindow(windowId: string) {
    this.closeWindowSubject.next(windowId);
  }
}
