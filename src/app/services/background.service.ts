import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private backgrounds: string[] = [
    'bg-blue-600',
    'bg-green-600',
    'bg-red-600',
    'bg-purple-600',
    'bg-yellow-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-gray-800',
    'bg-teal-600',
    'bg-orange-600',
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

  /**
   * Rastgele bir arkaplan seçer ve uygular
   */
  changeToRandomBackground(): void {
    // Mevcut arkaplan dışında rastgele bir arkaplan seç
    let newBackground: string;
    do {
      const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
      newBackground = this.backgrounds[randomIndex];
    } while (newBackground === this.background);
    
    // setBackground metodu ile yeni arkaplanı ayarla ve localStorage'a kaydet
    this.setBackground(newBackground);
  }

  get availableBackgrounds(): string[] {
    return [...this.backgrounds];
  }

  setBackground(background: string): void {
    this.backgroundSource.next(background);
    localStorage.setItem('background', background);
  }


}
