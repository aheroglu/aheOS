import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Window } from '../shared/models/desktop.models';

@Injectable({
  providedIn: 'root',
})
export class WindowManagerService {
  private activeWindowsSource = new BehaviorSubject<Window[]>([]);
  activeWindows$ = this.activeWindowsSource.asObservable();

  constructor() {}

  get activeWindows(): Window[] {
    return this.activeWindowsSource.value;
  }

  openWindow(window: Window): void {
    const windows = [...this.activeWindows, window];
    this.activeWindowsSource.next(windows);
  }

  closeWindow(id: number): void {
    const windows = this.activeWindows.filter((w) => w.id !== id);
    this.activeWindowsSource.next(windows);
  }

  minimizeWindow(id: number): void {
    const windows = this.activeWindows.map((w) => {
      if (w.id === id) {
        return { ...w, isMinimized: true };
      }
      return w;
    });
    this.activeWindowsSource.next(windows);
  }

  maximizeWindow(id: number): void {
    const windows = this.activeWindows.map((w) => {
      if (w.id === id) {
        return { ...w, isMaximized: !w.isMaximized };
      }
      return w;
    });
    this.activeWindowsSource.next(windows);
  }

  focusWindow(id: number): void {
    const maxZIndex = Math.max(...this.activeWindows.map((w) => w.zIndex), 0);
    const windows = this.activeWindows.map((w) => {
      if (w.id === id) {
        return { ...w, zIndex: maxZIndex + 1 };
      }
      return w;
    });
    this.activeWindowsSource.next(windows);
  }

  updateWindowPosition(id: number, position: { x: number; y: number }): void {
    const windows = this.activeWindows.map((w) => {
      if (w.id === id) {
        return { ...w, x: position.x, y: position.y };
      }
      return w;
    });
    this.activeWindowsSource.next(windows);
  }

  restoreWindow(id: number): void {
    const windows = this.activeWindows.map((w) => {
      if (w.id === id) {
        return { ...w, isMinimized: false };
      }
      return w;
    });
    this.activeWindowsSource.next(windows);
    this.focusWindow(id);
  }

  getTaskbarWindows() {
    return this.activeWindows.map((w) => ({
      id: w.id,
      title: w.title,
      icon: w.icon,
      isActive:
        w.zIndex === Math.max(...this.activeWindows.map((w) => w.zIndex)),
      isMinimized: w.isMinimized,
    }));
  }

  getNextZIndex(): number {
    return this.activeWindows.length > 0
      ? Math.max(...this.activeWindows.map((w) => w.zIndex)) + 1
      : 1;
  }
}
