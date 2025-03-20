import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DesktopIcon } from '../shared/models/desktop.models';

@Injectable({
  providedIn: 'root',
})
export class DesktopIconService {
  private iconSizeSource = new BehaviorSubject<string>('medium');
  iconSize$ = this.iconSizeSource.asObservable();

  private desktopIconsSource = new BehaviorSubject<DesktopIcon[]>([
    {
      id: 1,
      name: 'My Computer',
      icon: '/icons/my-computer.png',
      appType: 'computer',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Notepad',
      icon: '/icons/notepad.png',
      appType: 'notepad',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Terminal',
      icon: '/icons/terminal.png',
      appType: 'terminal',
      isSelected: false,
    },
    {
      id: 4,
      name: 'My Projects',
      icon: '/icons/programs.png',
      appType: 'programs',
      isSelected: false,
    },
    {
      id: 5,
      name: 'GitHub',
      icon: '/icons/github.png',
      appType: 'web',
      isSelected: false,
      url: 'https://github.com/aheroglu',
    },
    {
      id: 6,
      name: 'LinkedIn',
      icon: '/icons/linkedin.png',
      appType: 'web',
      isSelected: false,
      url: 'https://linkedin.com/in/aheroglu/',
    },
  ]);
  desktopIcons$ = this.desktopIconsSource.asObservable();

  constructor() {
    // LocalStorage'dan icon boyutunu al
    const savedIconSize = localStorage.getItem('icon-size');
    if (savedIconSize) {
      this.iconSizeSource.next(savedIconSize);
    }
  }

  get desktopIcons(): DesktopIcon[] {
    return this.desktopIconsSource.value;
  }

  get iconSize(): string {
    return this.iconSizeSource.value;
  }

  setIconSize(size: string): void {
    this.iconSizeSource.next(size);
    localStorage.setItem('icon-size', size);
  }

  selectIcon(selectedIcon: DesktopIcon, isCtrlPressed: boolean): void {
    const icons = this.desktopIcons.map((icon) => {
      // CTRL tuşuna basılı değilse diğer seçimleri kaldır
      if (!isCtrlPressed && icon !== selectedIcon) {
        return { ...icon, isSelected: false };
      }

      // Seçilen icon'un durumunu değiştir
      if (icon.id === selectedIcon.id) {
        return { ...icon, isSelected: !icon.isSelected };
      }

      return icon;
    });

    this.desktopIconsSource.next(icons);
  }

  clearSelection(): void {
    const icons = this.desktopIcons.map((icon) => ({
      ...icon,
      isSelected: false,
    }));
    this.desktopIconsSource.next(icons);
  }

  addIcon(icon: DesktopIcon): void {
    const icons = [...this.desktopIcons, icon];
    this.desktopIconsSource.next(icons);
  }
}
