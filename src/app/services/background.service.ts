import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private backgrounds: string[] = [
    'bg-[#008080]',
    'bg-[#e35f5f]',
    'bg-[#394dcd]',
    'bg-[#dfe300]',
    'bg-[#6c6c6c]',
  ];

  private backgroundSource = new BehaviorSubject<string>(this.backgrounds[0]);
  background$ = this.backgroundSource.asObservable();

  constructor() {
    // LocalStorage'dan arkaplanı al
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
      this.backgroundSource.next(savedBackground);
    }
  }

  get background(): string {
    return this.backgroundSource.value;
  }

  get availableBackgrounds(): string[] {
    return [...this.backgrounds];
  }

  setBackground(background: string): void {
    this.backgroundSource.next(background);
    localStorage.setItem('background', background);
  }

  changeToRandomBackground(): void {
    let newBackground: string;
    do {
      const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
      newBackground = this.backgrounds[randomIndex];
    } while (newBackground === this.background);

    this.setBackground(newBackground);
  }
}
