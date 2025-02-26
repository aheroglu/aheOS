import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TaskbarWindow {
  id: number;
  title: string;
  icon: string;
  isActive: boolean;
  isMinimized: boolean;
}

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="taskbar h-[36px]  bg-[#c0c0c0] flex items-center px-1 border-t border-[#ffffff]"
    >
      <!-- Start Button -->
      <button
        class="start-button h-[30px] px-2 flex items-center gap-1 bg-[#c0c0c0] border-[1px] mr-1"
        [class.active]="isStartMenuOpen"
        (click)="toggleStartMenu()"
      >
        <img src="/icons/windows.png" alt="Start" class="w-4 h-4" />
        <span class="text-[11px]">aheOS</span>
      </button>

      <!-- Active Windows -->
      <div class="active-windows flex-1 flex gap-1">
        <button
          *ngFor="let window of activeWindows; trackBy: trackWindowById"
          class="window-button h-[30px] px-1 flex items-center gap-1 bg-[#c0c0c0] border-[1px] min-w-[120px]"
          [class.active]="window.isActive"
          [class.minimized]="window.isMinimized"
          (click)="onWindowClick(window)"
        >
          <img [src]="window.icon" [alt]="window.title" class="w-4 h-4" />
          <span class="text-[11px] truncate">{{ window.title }}</span>
        </button>
      </div>

      <!-- Clock -->
      <div
        class="clock h-[30px] px-2 flex flex-col justify-center border-[1px] border-inset ml-1"
      >
        <span class="text-[11px] leading-none">{{ currentTime }}</span>
        <span class="text-[11px] leading-none mt-1">{{ currentDate }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .taskbar {
        box-shadow: inset 0 1px #ffffff;
      }

      .start-button,
      .window-button {
        border-color: #ffffff #404040 #404040 #ffffff;

        &:active,
        &.active {
          border-color: #404040 #ffffff #ffffff #404040;
          padding-top: 1px;
          padding-left: 2px;
        }

        &.minimized {
          background: #808080;
          color: #c0c0c0;
        }
      }

      .clock {
        border-color: #808080 #ffffff #ffffff #808080;
        min-width: 80px;
        text-align: center;
      }
    `,
  ],
})
export class TaskbarComponent {
  @Input() activeWindows: TaskbarWindow[] = [];
  @Output() windowSelect = new EventEmitter<number>();
  @Output() startMenuToggle = new EventEmitter<void>();

  isStartMenuOpen = false;
  currentTime = new Date().toLocaleTimeString();
  currentDate = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  constructor(private ngZone: NgZone) {
    // Saat ve tarihi zone dışında güncelle
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString();
        this.currentDate = now.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        this.ngZone.run(() => {});
      }, 1000);
    });
  }

  trackWindowById(index: number, window: TaskbarWindow): number {
    return window.id;
  }

  onWindowClick(window: TaskbarWindow) {
    this.windowSelect.emit(window.id);
  }

  toggleStartMenu() {
    this.isStartMenuOpen = !this.isStartMenuOpen;
    this.startMenuToggle.emit();
  }

  closeStartMenu() {
    if (this.isStartMenuOpen) {
      this.isStartMenuOpen = false;
      this.startMenuToggle.emit();
    }
  }
}
