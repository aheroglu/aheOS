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

interface HelpWindow {
  id: string;
  title: string;
  icon: string;
  content: string;
  width: number;
  height: number;
  isResizable: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  zIndex: number;
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
      class="desktop-container h-screen w-screen {{
        background
      }} relative overflow-hidden"
      (click)="onDesktopClick($event)"
      (contextmenu)="onRightClick($event)"
    >
      <ul
        *ngIf="showMenu"
        class="win95-context-menu"
        [ngStyle]="{ 'top.px': menuPosition.y, 'left.px': menuPosition.x }"
      >
        <li class="win95-menu-item" (click)="menuItemClick('large-icons')">
          Large Icons
        </li>
        <li class="win95-menu-item" (click)="menuItemClick('medium-icons')">
          Medium Icons
        </li>
        <li class="win95-menu-item" (click)="menuItemClick('small-icons')">
          Small Icons
        </li>
        <li class="win95-menu-separator"></li>
        <li
          class="win95-menu-item"
          (click)="menuItemClick('change-background')"
        >
          Change background
        </li>
      </ul>

      <div
        class="desktop-icons flex  flex-col flex-wrap h-[calc(100vh-30px)] gap-1 p-1 mt-2"
        style="max-height: calc(100vh - 30px); width: fit-content;"
      >
        <div
          class="w-[70px]"
          *ngFor="let icon of desktopIcons; trackBy: trackIcon"
        >
          <app-desktop-icon
            [name]="icon.name"
            [iconPath]="icon.icon"
            [isSelected]="icon.isSelected"
            [size]="iconSize"
            (select)="onIconSelect($event, icon)"
            (dblclick)="openApplication(icon)"
          />
        </div>
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

      <ng-container
        *ngFor="let helpWindow of openHelpWindows; trackBy: trackHelpWindow"
      >
        <app-window
          #helpWindowComponent
          [title]="helpWindow.title"
          [icon]="helpWindow.icon"
          [width]="helpWindow.width"
          [height]="helpWindow.height"
          [x]="helpWindow.position.x"
          [y]="helpWindow.position.y"
          [zIndex]="helpWindow.zIndex"
          [isMaximized]="helpWindow.isMaximized"
          (close)="closeHelpWindow(helpWindow.id)"
          (minimize)="minimizeHelpWindow(helpWindow.id)"
          (maximize)="maximizeHelpWindow(helpWindow.id)"
          (positionChange)="updateHelpWindowPosition(helpWindow.id, $event)"
          (click)="focusHelpWindow(helpWindow.id)"
        >
          <div class="h-full" [innerHTML]="helpWindow.content"></div>
        </app-window>
      </ng-container>

      <app-start-menu
        *ngIf="isStartMenuOpen"
        (menuClose)="closeStartMenu()"
        (shutDown)="onShutDown()"
        (onStartMenuItemClick)="onStartMenuItemClick($event)"
      ></app-start-menu>

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
        z-index: 9999;
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
  backgrounds: string[] = [
    'bg-[#008080]',
    'bg-[#e35f5f]',
    'bg-[#394dcd]',
    'bg-[#dfe300]',
    'bg-[#6c6c6c]',
  ];
  background: string = this.backgrounds[0];
  showMenu = false;
  menuPosition = { x: 0, y: 0 };
  iconSize: string = 'medium';

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
  openHelpWindows: HelpWindow[] = [];
  isStartMenuOpen = false;

  @ViewChildren('windowComponent')
  windowComponents!: QueryList<WindowComponent>;

  constructor(private windowService: WindowService, private router: Router) {
    this.windowService.closeWindow$.subscribe((windowId) => {
      if (windowId === 'terminal') {
        this.closeTerminal();
      }
    });

    this.background = localStorage.getItem('background') || this.backgrounds[0];
    this.iconSize = localStorage.getItem('icon-size') || 'medium';
  }

  trackIcon(index: number, icon: DesktopIcon): string {
    return icon.name;
  }

  trackWindow(index: number, window: Window): number {
    return window.id;
  }

  trackHelpWindow(index: number, helpWindow: HelpWindow): string {
    return helpWindow.id;
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
    } else if (item.type === 'help') {
      this.openHelpWindow();
    } else if (item.type) {
      // Start menüsünden gelen item'ı desktop icon formatına çevir
      const desktopIcon: DesktopIcon = {
        id: this.activeWindows.length + 1,
        name:
          item.name || item.type.charAt(0).toUpperCase() + item.type.slice(1),
        icon: item.icon || `/icons/${item.type}.png`,
        appType: item.type as 'terminal' | 'notepad' | 'computer' | 'web',
        isSelected: false,
        url: item.url,
      };
      this.openApplication(desktopIcon);
    }
  }

  getNextZIndex(): number {
    return this.activeWindows.length + 1;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.showMenu = true;
    this.isStartMenuOpen = false;
    this.menuPosition.x = event.clientX;
    this.menuPosition.y = event.clientY;
  }

  menuItemClick(item: string) {
    if (item === 'large-icons') {
      this.iconSize = 'large';
      localStorage.setItem('icon-size', 'large');
    } else if (item === 'medium-icons') {
      this.iconSize = 'medium';
      localStorage.setItem('icon-size', 'medium');
    } else if (item === 'small-icons') {
      this.iconSize = 'small';
      localStorage.setItem('icon-size', 'small');
    } else if (item === 'change-background') {
      let newBackground: string;
      do {
        const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
        newBackground = this.backgrounds[randomIndex];
      } while (newBackground === this.background);
      this.background = newBackground;
      localStorage.setItem('background', this.background);
    }

    this.showMenu = false;
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

  openHelpWindow() {
    if (this.openHelpWindows.length > 0) {
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
      zIndex: this.getNextZIndex(),
    };

    this.openHelpWindows.push(helpWindow);
  }

  closeHelpWindow(id: string) {
    this.openHelpWindows = this.openHelpWindows.filter((w) => w.id !== id);
  }

  minimizeHelpWindow(id: string) {
    const helpWindow = this.openHelpWindows.find((w) => w.id === id);
    if (helpWindow) {
      helpWindow.isMaximized = false;
    }
  }

  maximizeHelpWindow(id: string) {
    const helpWindow = this.openHelpWindows.find((w) => w.id === id);
    if (helpWindow) {
      helpWindow.isMaximized = !helpWindow.isMaximized;
    }
  }

  updateHelpWindowPosition(id: string, position: { x: number; y: number }) {
    const helpWindow = this.openHelpWindows.find((w) => w.id === id);
    if (helpWindow) {
      helpWindow.position.x = position.x;
      helpWindow.position.y = position.y;
    }
  }

  focusHelpWindow(id: string) {
    const maxZIndex = Math.max(...this.openHelpWindows.map((w) => w.zIndex));
    const helpWindow = this.openHelpWindows.find((w) => w.id === id);
    if (helpWindow) {
      helpWindow.zIndex = maxZIndex + 1;
    }
  }
}
