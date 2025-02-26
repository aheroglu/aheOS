import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  name: string;
  icon: string;
  type?: string;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="start-menu window bg-[#c0c0c0] absolute bottom-[28px] left-0 w-[200px]"
    >
      <div
        class="sidebar bg-[#000080] w-[35px] absolute left-0 top-0 bottom-0 flex flex-col justify-end"
      >
        <div
          class="text-[30px] tracking-widest text-white transform -rotate-90 mb-8 whitespace-nowrap font-bold font-mono"
        >
          <span class="italic">ahe</span>OS
        </div>
      </div>

      <div class="menu-items pl-[38px] py-2">
        @for (item of menuItems; track item.name) {
        <div
          class="menu-item flex items-center px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer relative"
          (click)="onItemClick(item)"
          (mouseenter)="showSubmenu(item)"
          (mouseleave)="hideSubmenu()"
        >
          <img [src]="item.icon" [alt]="item.name" class="w-6 h-6 mr-2" />
          <span>{{ item.name }}</span>
          @if (item.submenu) {
          <span class="ml-auto">▶</span>

          <!-- Submenu -->
          @if (activeSubmenu === item) {
          <div
            class="submenu absolute left-[160px] top-[-11px] bg-[#c0c0c0] border-[1px] border-[#dfdfdf] shadow-md w-[200px]"
            (mouseenter)="showSubmenu(item)"
            (mouseleave)="hideSubmenu()"
          >
            @for (subItem of item.submenu; track subItem.name) {
            <div
              class="submenu-item flex items-center px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              (click)="onSubItemClick($event, subItem)"
            >
              <img
                [src]="subItem.icon"
                [alt]="subItem.name"
                class="w-6 h-6 mr-2"
              />
              <span>{{ subItem.name }}</span>
            </div>
            }
          </div>
          } }
        </div>
        }

        <div class="divider border-t border-[#808080] my-2"></div>

        <div
          class="menu-item flex items-center px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
          (click)="onShutDown()"
        >
          <img src="/icons/shutdown.png" alt="Shut Down" class="w-6 h-6 mr-2" />
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }

      .window {
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
          inset -2px -2px grey, inset 2px 2px #fff;
      }

      .submenu {
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
          inset -2px -2px grey, inset 2px 2px #fff;
      }
    `,
  ],
})
export class StartMenuComponent {
  @Output() menuClose = new EventEmitter<void>();
  @Output() shutDown = new EventEmitter<void>();
  @Output() onStartMenuItemClick = new EventEmitter<MenuItem>();

  activeSubmenu: MenuItem | null = null;
  submenuTimeout: any = null;

  menuItems: MenuItem[] = [
    {
      name: 'Programs',
      icon: '/icons/programs.png',
      submenu: [
        { name: 'Terminal', icon: '/icons/terminal.png', type: 'terminal' },
        { name: 'Notepad', icon: '/icons/notepad.png', type: 'notepad' },
      ],
    },
    { name: 'Settings', icon: '/icons/settings.png' },
    { name: 'Help', icon: '/icons/help.png', type: 'help' },
  ];

  showSubmenu(item: MenuItem): void {
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
      this.submenuTimeout = null;
    }
    if (item.submenu) {
      this.activeSubmenu = item;
    }
  }

  hideSubmenu(): void {
    this.submenuTimeout = setTimeout(() => {
      this.activeSubmenu = null;
      this.submenuTimeout = null;
    }, 100);
  }

  onItemClick(item: MenuItem): void {
    if (!item.submenu && item.type) {
      this.menuClose.emit();
      this.onStartMenuItemClick.emit(item);
    }
  }

  onSubItemClick(event: MouseEvent, item: MenuItem): void {
    console.log(item);

    event.stopPropagation();
    if (item.type) {
      this.menuClose.emit();
      this.onStartMenuItemClick.emit(item);
    }
  }

  onShutDown(): void {
    this.menuClose.emit();
    this.shutDown.emit();
  }
}
