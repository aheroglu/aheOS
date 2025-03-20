import { Component, QueryList, ViewChildren } from '@angular/core';
import { DesktopIconComponent } from '../../shared/components/desktop-icon/desktop-icon.component';
import { TaskbarComponent } from '../../shared/components/taskbar/taskbar.component';
import { WindowComponent } from '../../shared/components/window/window.component';
import { TerminalComponent } from '../../applications/terminal/terminal.component';
import { NotepadComponent } from '../../applications/notepad/notepad.component';
import { BrowserComponent } from '../../applications/browser/browser.component';
import { ComputerComponent } from '../../applications/computer/computer.component';
import { ProgramsComponent } from '../../applications/programs/programs.component';
import { CommonModule } from '@angular/common';
import { StartMenuComponent } from '../../shared/components/start-menu/start-menu.component';
import { WindowService } from '../../services/window.service';
import { Router } from '@angular/router';
import {
  ContextMenuComponent,
  ContextMenuItem,
} from '../../shared/components/context-menu/context-menu.component';
import { WindowManagerService } from '../../services/window-manager.service';
import { DesktopIconService } from '../../services/desktop-icon.service';
import { HelpWindowService } from '../../services/help-window.service';
import { BackgroundService } from '../../services/background.service';
import {
  DesktopIcon,
  Window,
  HelpWindow,
} from '../../shared/models/desktop.models';

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
    ProgramsComponent,
    StartMenuComponent,
    ContextMenuComponent,
  ],
  template: `
    <div
      class="desktop-container h-screen w-screen {{
        background
      }} relative overflow-hidden"
      (click)="onDesktopClick($event)"
      (contextmenu)="onRightClick($event)"
    >
      <app-context-menu
        [isVisible]="showMenu"
        [position]="menuPosition"
        [menuItems]="contextMenuItems"
        (itemClick)="menuItemClick($event)"
        (close)="showMenu = false"
      ></app-context-menu>

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
              <app-programs *ngSwitchCase="'programs'" />
            </ng-container>
          </div>
        </app-window>
      </ng-container>

      <ng-container
        *ngFor="let helpWindow of helpWindows; trackBy: trackHelpWindow"
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
        [activeWindows]="taskbarWindows"
        (windowSelect)="restoreWindow($event)"
        (startMenuToggle)="toggleStartMenu()"
      />
    </div>
  `,
  styles: [],
})
export class DesktopComponent {
  // Bağlam menüsü öğeleri
  contextMenuItems: ContextMenuItem[] = [
    { id: 'large-icons', label: 'Large Icons' },
    { id: 'medium-icons', label: 'Medium Icons' },
    { id: 'small-icons', label: 'Small Icons' },
    { id: 'separator', label: '', isSeparator: true },
    { id: 'change-background', label: 'Change background' },
  ];

  // UI durumları
  showMenu = false;
  menuPosition = { x: 0, y: 0 };
  isStartMenuOpen = false;

  // Pencere bileşenleri referansları
  @ViewChildren('windowComponent')
  windowComponents!: QueryList<WindowComponent>;

  constructor(
    private windowService: WindowService,
    private router: Router,
    private windowManager: WindowManagerService,
    private desktopIconService: DesktopIconService,
    private helpWindowService: HelpWindowService,
    private backgroundService: BackgroundService
  ) {
    this.windowService.closeWindow$.subscribe((windowId) => {
      if (windowId === 'terminal') {
        this.closeTerminal();
      }
    });
  }

  // Getter metodları - daha temiz template bağlantıları için
  get background(): string {
    return this.backgroundService.background;
  }

  get iconSize(): string {
    return this.desktopIconService.iconSize;
  }

  get desktopIcons(): DesktopIcon[] {
    return this.desktopIconService.desktopIcons;
  }

  get activeWindows(): Window[] {
    return this.windowManager.activeWindows;
  }

  get helpWindows(): HelpWindow[] {
    return this.helpWindowService.helpWindows;
  }

  get taskbarWindows() {
    return this.windowManager.getTaskbarWindows();
  }

  // TrackBy fonksiyonları - Angular performansı için
  trackIcon(index: number, icon: DesktopIcon): string {
    return icon.name;
  }

  trackWindow(index: number, window: Window): number {
    return window.id;
  }

  trackHelpWindow(index: number, helpWindow: HelpWindow): string {
    return helpWindow.id;
  }

  // Masaüstü etkileşimleri
  onDesktopClick(event: MouseEvent) {
    // Start menüsünü kapat
    if (this.isStartMenuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-button')) {
        this.closeStartMenu();
      }
    }

    // Seçili icon'ları temizle
    this.desktopIconService.clearSelection();
    this.showMenu = false;
  }

  onIconSelect(event: MouseEvent, selectedIcon: DesktopIcon) {
    this.desktopIconService.selectIcon(selectedIcon, event.ctrlKey);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.showMenu = true;
    this.isStartMenuOpen = false;
    this.menuPosition.x = event.clientX;
    this.menuPosition.y = event.clientY;
  }

  menuItemClick(itemId: string) {
    switch (itemId) {
      case 'large-icons':
        this.desktopIconService.setIconSize('large');
        break;
      case 'medium-icons':
        this.desktopIconService.setIconSize('medium');
        break;
      case 'small-icons':
        this.desktopIconService.setIconSize('small');
        break;
      case 'change-background':
        this.backgroundService.changeToRandomBackground();
        break;
    }
    this.showMenu = false;
  }

  // Uygulama açma işlemleri
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
      zIndex: this.windowManager.getNextZIndex(),
      isMinimized: false,
      isMaximized: false,
      url: icon.url,
    };

    this.windowManager.openWindow(windowObj);
  }

  // Pencere yönetimi işlemleri
  closeWindow(id: number) {
    this.windowManager.closeWindow(id);
  }

  minimizeWindow(id: number) {
    this.windowManager.minimizeWindow(id);
    // Window component'ini bul ve minimize et
    const windowComponent = this.windowComponents.find(
      (_, index) => this.activeWindows[index].id === id
    );
    if (windowComponent) {
      windowComponent.onMinimize();
    }
  }

  maximizeWindow(id: number) {
    this.windowManager.maximizeWindow(id);
  }

  focusWindow(id: number) {
    this.windowManager.focusWindow(id);
  }

  updateWindowPosition(id: number, position: { x: number; y: number }) {
    this.windowManager.updateWindowPosition(id, position);
  }

  restoreWindow(id: number) {
    const window = this.activeWindows.find((w) => w.id === id);
    if (window) {
      // Eğer pencere minimize değilse, minimize et
      if (!window.isMinimized) {
        this.minimizeWindow(id);
        return;
      }

      // Eğer pencere minimize ise, restore et
      this.windowManager.restoreWindow(id);

      // Window component'ini bul ve restore metodunu çağır
      const windowComponent = this.windowComponents.find(
        (_, index) => this.activeWindows[index].id === id
      );
      if (windowComponent) {
        windowComponent.restore();
      }
    }
  }

  // Start menüsü işlemleri
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

  // Terminal özel işlemleri
  closeTerminal() {
    const terminalWindow = this.activeWindows.find(
      (w) => w.title === 'Terminal'
    );
    if (terminalWindow) {
      this.windowManager.closeWindow(terminalWindow.id);
    }
  }

  // Sistem işlemleri
  onShutDown() {
    this.router.navigate(['/shutdown']);
  }

  // Yardım penceresi işlemleri
  openHelpWindow() {
    this.helpWindowService.openHelpWindow(this.windowManager.getNextZIndex());
  }

  closeHelpWindow(id: string) {
    this.helpWindowService.closeHelpWindow(id);
  }

  minimizeHelpWindow(id: string) {
    this.helpWindowService.minimizeHelpWindow(id);
  }

  maximizeHelpWindow(id: string) {
    this.helpWindowService.maximizeHelpWindow(id);
  }

  updateHelpWindowPosition(id: string, position: { x: number; y: number }) {
    this.helpWindowService.updateHelpWindowPosition(id, position);
  }

  focusHelpWindow(id: string) {
    this.helpWindowService.focusHelpWindow(id);
  }
}
