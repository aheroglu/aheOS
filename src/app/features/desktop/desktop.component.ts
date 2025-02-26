import { Component, QueryList, ViewChildren } from '@angular/core';
import { DesktopIconComponent } from '../../shared/components/desktop-icon/desktop-icon.component';
import { TaskbarComponent } from '../../shared/components/taskbar/taskbar.component';
import { WindowComponent } from '../../shared/components/window/window.component';
import { TerminalComponent } from '../../applications/terminal/terminal.component';
import { NotepadComponent } from '../../applications/notepad/notepad.component';
import { BrowserComponent } from '../../applications/browser/browser.component';
import { ComputerComponent } from '../../applications/computer/computer.component';
import { CommonModule } from '@angular/common';
import { StartMenuComponent } from '../../shared/components/start-menu/start-menu.component';
import { WindowService } from '../../services/window.service';
import { Router } from '@angular/router';

interface DesktopIcon {
  id: number;
  name: string;
  icon: string;
  appType: 'terminal' | 'notepad' | 'computer' | 'web';
  isSelected: boolean;
  url?: string;
}

interface Window {
  id: number;
  title: string;
  icon: string;
  type: 'terminal' | 'notepad' | 'computer' | 'web';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  url?: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DesktopIconComponent,
    TaskbarComponent,
    WindowComponent,
    TerminalComponent,
    NotepadComponent,
    BrowserComponent,
    ComputerComponent,
    StartMenuComponent,
  ],
  template: `
    <div
      class="desktop-container h-screen w-screen bg-[#008080] relative overflow-hidden"
      (click)="onDesktopClick($event)"
      (contextmenu)="onRightClick($event)"
    >
      <ul
        *ngIf="showMenu"
        class="win95-context-menu"
        [ngStyle]="{ 'top.px': menuPosition.y, 'left.px': menuPosition.x }"
      >
        <li class="win95-menu-item" (click)="menuItemClick('Item 1')">
          Item 1
        </li>
        <li class="win95-menu-item" (click)="menuItemClick('Item 2')">
          Item 2
        </li>
        <li class="win95-menu-separator"></li>
        <li class="win95-menu-item" (click)="menuItemClick('Item 3')">
          Item 3
        </li>
      </ul>

      <div class="desktop-icons grid grid-cols-1 gap-1 p-1 mt-2 w-[70px]">
        <app-desktop-icon
          *ngFor="let icon of desktopIcons; trackBy: trackIcon"
          [name]="icon.name"
          [iconPath]="icon.icon"
          [isSelected]="icon.isSelected"
          (select)="onIconSelect($event, icon)"
          (dblclick)="openApplication(icon)"
        />
      </div>

      <ng-container *ngFor="let window of activeWindows; trackBy: trackWindow">
        <app-window
          #windowComponent
          [title]="window.title"
          [icon]="window.icon"
          [width]="window.width"
          [height]="window.height"
          [x]="window.x"
          [y]="window.y"
          [zIndex]="window.zIndex"
          [isMaximized]="window.isMaximized"
          (close)="closeWindow(window.id)"
          (minimize)="minimizeWindow(window.id)"
          (maximize)="maximizeWindow(window.id)"
          (positionChange)="updateWindowPosition(window.id, $event)"
          (click)="focusWindow(window.id)"
        >
          <div class="h-full">
            <ng-container [ngSwitch]="window.type">
              <app-terminal *ngSwitchCase="'terminal'" />
              <app-notepad *ngSwitchCase="'notepad'" />
              <app-browser *ngSwitchCase="'web'" [url]="window.url || ''" />
              <app-computer *ngSwitchCase="'computer'" />
            </ng-container>
          </div>
        </app-window>
      </ng-container>

      <app-start-menu
        *ngIf="isStartMenuOpen"
        (menuClose)="closeStartMenu()"
        (shutDown)="onShutDown()"
        (menuItemClick)="onStartMenuItemClick($event)"
      />

      <app-taskbar
        class="absolute bottom-0 left-0 right-0"
        [activeWindows]="getTaskbarWindows()"
        (windowSelect)="restoreWindow($event)"
        (startMenuToggle)="toggleStartMenu()"
      />
    </div>
  `,
  styles: [
    `
      .win95-context-menu {
        position: absolute;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        padding: 2px;
        box-shadow: 1px 1px 0 0 #000;
        min-width: 160px;
      }

      .win95-menu-item {
        padding: 4px 8px;
        color: #000;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .win95-menu-item:hover {
        background: #000080;
        color: #ffffff;
      }

      .win95-menu-separator {
        height: 1px;
        background: #808080;
        margin: 4px 2px;
        border-bottom: 1px solid #ffffff;
      }
    `,
  ],
})
export class DesktopComponent {
  showMenu = false;
  menuPosition = { x: 0, y: 0 };

  desktopIcons: DesktopIcon[] = [
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
      name: 'NG Commerce',
      icon: '/icons/browser.png',
      appType: 'web',
      isSelected: false,
      url: 'https://ng-commerce.aheroglu.dev/',
    },
    {
      id: 5,
      name: 'LinkedAI',
      icon: '/icons/linkedai.png',
      appType: 'web',
      isSelected: false,
      url: 'https://linkedai.app/',
    },
    {
      id: 6,
      name: 'GitHub',
      icon: '/icons/github.png',
      appType: 'web',
      isSelected: false,
      url: 'https://github.com/aheroglu',
    },
    {
      id: 7,
      name: 'LinkedIn',
      icon: '/icons/linkedin.png',
      appType: 'web',
      isSelected: false,
      url: 'https://linkedin.com/in/aheroglu/',
    },
  ];

  activeWindows: Window[] = [];
  isStartMenuOpen = false;

  @ViewChildren('windowComponent')
  windowComponents!: QueryList<WindowComponent>;

  constructor(private windowService: WindowService, private router: Router) {
    this.windowService.closeWindow$.subscribe((windowId) => {
      if (windowId === 'terminal') {
        // Terminal penceresini kapat
        this.closeTerminal();
      }
    });
  }

  trackIcon(index: number, icon: DesktopIcon): string {
    return icon.name;
  }

  trackWindow(index: number, window: Window): number {
    return window.id;
  }

  onDesktopClick(event: MouseEvent) {
    // Start menüsünü kapat
    if (this.isStartMenuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-button')) {
        this.closeStartMenu();
      }
    }

    // Seçili icon'ları temizle
    this.desktopIcons.forEach((icon) => (icon.isSelected = false));
    this.showMenu = false;
  }

  onIconSelect(event: MouseEvent, selectedIcon: DesktopIcon) {
    // CTRL tuşuna basılı değilse diğer seçimleri kaldır
    if (!event.ctrlKey) {
      this.desktopIcons.forEach((icon) => {
        if (icon !== selectedIcon) {
          icon.isSelected = false;
        }
      });
    }

    selectedIcon.isSelected = !selectedIcon.isSelected;
  }

  openApplication(icon: DesktopIcon) {
    // GitHub ve LinkedIn için yeni sekmede aç
    if (icon.name === 'GitHub' || icon.name === 'LinkedIn') {
      globalThis.window.open(icon.url, '_blank');
      return;
    }

    // Diğer uygulamalar için normal pencere aç
    const lastWindow = this.activeWindows[this.activeWindows.length - 1];
    const x = lastWindow ? lastWindow.x + 10 : 100;
    const y = lastWindow ? lastWindow.y + 10 : 30;

    const windowObj: Window = {
      id: Date.now(),
      title: icon.name,
      icon: icon.icon,
      type: icon.appType,
      x,
      y,
      width: 1000,
      height: 600,
      zIndex: this.getNextZIndex(),
      isMinimized: false,
      isMaximized: false,
      url: icon.url,
    };

    this.activeWindows.push(windowObj);
    this.focusWindow(windowObj.id);
  }

  closeWindow(id: number) {
    this.activeWindows = this.activeWindows.filter((w) => w.id !== id);
  }

  minimizeWindow(id: number) {
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      window.isMinimized = true;
      // Window component'ini bul ve minimize et
      const windowComponent = this.windowComponents.find(
        (_, index) => this.activeWindows[index].id === id
      );
      if (windowComponent) {
        windowComponent.onMinimize();
      }
    }
  }

  maximizeWindow(id: number) {
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      window.isMaximized = !window.isMaximized;
    }
  }

  focusWindow(id: number) {
    const maxZIndex = Math.max(...this.activeWindows.map((w) => w.zIndex));
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      window.zIndex = maxZIndex + 1;
    }
  }

  updateWindowPosition(id: number, position: { x: number; y: number }) {
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      window.x = position.x;
      window.y = position.y;
    }
  }

  restoreWindow(id: number) {
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      // Eğer pencere minimize değilse, minimize et
      if (!window.isMinimized) {
        window.isMinimized = true;
        // Window component'ini bul ve minimize et
        const windowComponent = this.windowComponents.find(
          (_, index) => this.activeWindows[index].id === id
        );
        if (windowComponent) {
          windowComponent.onMinimize();
        }
        return;
      }

      // Eğer pencere minimize ise, restore et
      window.isMinimized = false;

      // Window component'ini bul ve restore metodunu çağır
      const windowComponent = this.windowComponents.find(
        (_, index) => this.activeWindows[index].id === id
      );
      if (windowComponent) {
        windowComponent.restore();
      }

      this.focusWindow(id);
    }
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

  toggleStartMenu() {
    this.isStartMenuOpen = !this.isStartMenuOpen;
  }

  closeStartMenu() {
    this.isStartMenuOpen = false;
  }

  onStartMenuItemClick(item: any) {
    this.closeStartMenu();
    if (item.type === 'shutdown') {
      this.router.navigate(['/shutdown']);
    } else if (item.type) {
      this.openApplication(item);
    }
  }

  getNextZIndex(): number {
    return this.activeWindows.length + 1;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.showMenu = true;
    this.menuPosition.x = event.clientX;
    this.menuPosition.y = event.clientY;
  }

  menuItemClick(item: string) {
    console.log(item + ' clicked!');
    this.showMenu = false; // Menü kapatılır
  }

  closeTerminal() {
    const terminalWindow = this.activeWindows.find(
      (w) => w.title === 'Terminal'
    );
    if (terminalWindow) {
      const index = this.activeWindows.indexOf(terminalWindow);
      if (index > -1) {
        this.activeWindows.splice(index, 1);
      }
    }
  }

  onShutDown() {
    this.router.navigate(['/shutdown']);
  }
}
