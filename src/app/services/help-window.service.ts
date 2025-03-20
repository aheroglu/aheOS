import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HelpWindow } from '../shared/models/desktop.models';

@Injectable({
  providedIn: 'root',
})
export class HelpWindowService {
  private helpWindowsSource = new BehaviorSubject<HelpWindow[]>([]);
  helpWindows$ = this.helpWindowsSource.asObservable();

  constructor() {}

  get helpWindows(): HelpWindow[] {
    return this.helpWindowsSource.value;
  }

  openHelpWindow(zIndex: number): void {
    if (this.helpWindows.length > 0) {
      return;
    }

    const helpWindow: HelpWindow = {
      id: 'help',
      title: 'Help',
      icon: '/icons/help.png',
      content: `
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">Welcome to aheOS Help</h2>
          
          <div class="mb-4">
            <h3 class="font-bold mb-2 text-sm">Getting Started</h3>
            <ul class="list-disc pl-4 text-[12px]">
              <li>Click the Start button to access programs and settings</li>
              <li>Use the taskbar to switch between open windows</li>
              <li>Right-click on the desktop for quick actions</li>
            </ul>
          </div>

          <div class="mb-4">
            <h3 class="font-bold text-sm mb-2">Available Applications</h3>
            <ul class="list-disc pl-4 text-[12px]">
              <li><b>Terminal:</b> Command-line interface</li>
              <li><b>Notepad:</b> Text editor with your information</li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold text-sm mb-2">Tips</h3>
            <ul class="list-disc pl-4 text-[12px]">
              <li>Windows can be dragged by their title bars</li>
              <li>Use the minimize button to hide windows</li>
              <li>Click "Shut Down" in the Start menu to exit</li>
            </ul>
          </div>
        </div>
      `,
      width: 400,
      height: 500,
      isResizable: true,
      isMaximized: false,
      position: { x: 150, y: 50 },
      zIndex: zIndex,
    };

    this.helpWindowsSource.next([helpWindow]);
  }

  closeHelpWindow(id: string): void {
    const windows = this.helpWindows.filter((w) => w.id !== id);
    this.helpWindowsSource.next(windows);
  }

  minimizeHelpWindow(id: string): void {
    const windows = this.helpWindows.map((w) => {
      if (w.id === id) {
        return { ...w, isMaximized: false };
      }
      return w;
    });
    this.helpWindowsSource.next(windows);
  }

  maximizeHelpWindow(id: string): void {
    const windows = this.helpWindows.map((w) => {
      if (w.id === id) {
        return { ...w, isMaximized: !w.isMaximized };
      }
      return w;
    });
    this.helpWindowsSource.next(windows);
  }

  updateHelpWindowPosition(
    id: string,
    position: { x: number; y: number }
  ): void {
    const windows = this.helpWindows.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          position: {
            x: position.x,
            y: position.y,
          },
        };
      }
      return w;
    });
    this.helpWindowsSource.next(windows);
  }

  focusHelpWindow(id: string): void {
    const maxZIndex = Math.max(...this.helpWindows.map((w) => w.zIndex), 0);
    const windows = this.helpWindows.map((w) => {
      if (w.id === id) {
        return { ...w, zIndex: maxZIndex + 1 };
      }
      return w;
    });
    this.helpWindowsSource.next(windows);
  }
}
