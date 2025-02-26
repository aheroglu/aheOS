import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private isMuted = signal<boolean>(false);

  getMuteState() {
    return this.isMuted();
  }

  toggleMute() {
    this.isMuted.set(!this.isMuted());
  }
}
