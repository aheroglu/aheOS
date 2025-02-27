import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #windowElement
      class="window absolute"
      [class.maximized]="isMaximized"
      [class.minimized]="isMinimized"
      [style.width.px]="currentWidth"
      [style.height.px]="currentHeight"
      [style.z-index]="zIndex"
      [style.transform]="getTransform()"
    >
      <!-- Pencere Başlığı -->
      <div
        class="window-title h-[20px] bg-[#000080] text-white flex items-center justify-between px-1 select-none cursor-move"
        (mousedown)="startDragging($event)"
      >
        <div class="flex items-center gap-1">
          <img [src]="icon" [alt]="title" class="w-[14px] h-[14px]" />
          <span class="text-[11px] leading-none font-bold">{{ title }}</span>
        </div>
        <div class="flex h-full gap-[2px] py-[3px]">
          <button class="window-button" (click)="onMinimize()">_</button>
          <button class="window-button" (click)="onMaximize()">□</button>
          <button class="window-button" (click)="onClose()">×</button>
        </div>
      </div>

      <!-- Pencere İçeriği -->
      <div class="window-content h-full" [class.hidden]="isMinimized">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .window {
        background: #c0c0c0;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
          inset -2px -2px grey, inset 2px 2px #fff;
        min-width: 200px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        transform-origin: center center;
        top: 0;
        left: 0;

        &.maximized {
          width: 100vw !important;
          height: calc(100vh - 30px) !important;
          transform: translate(0, 0) !important;
        }

        &.minimized {
          transform: scale(0.1) !important;
          opacity: 0;
          pointer-events: none;
        }

        &.dragging {
          transition: none !important;
        }
      }

      .window-title {
        flex: none;
      }

      .window-button {
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        font-size: 12px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #c0c0c0;
        border: 1px outset #fff;
        margin-left: 1px;
        padding: 0;

        &:active {
          border: 1px inset #fff;
          padding-top: 1px;
          padding-left: 1px;
        }

        &:hover {
          background: #dfdfdf;
        }
      }

      .window-content {
        flex: 1;
        height: calc(100% - 20px);
        margin: 2px;
        background: #c0c0c0;
        box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a,
          inset -2px -2px #dfdfdf, inset 2px 2px grey;
        overflow: auto;
        position: relative;
      }
    `,
  ],
})
export class WindowComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() x: number = 100;
  @Input() y: number = 100;
  @Input() zIndex: number = 1;
  @Input() isMaximized: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() positionChange = new EventEmitter<{ x: number; y: number }>();

  isMinimized = false;

  private savedState = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  get currentWidth(): number {
    return this.isMaximized ? window.innerWidth : this.width;
  }

  get currentHeight(): number {
    return this.isMaximized ? window.innerHeight - 30 : this.height;
  }

  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private windowElement: HTMLElement | null = null;
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.windowElement = this.elementRef.nativeElement.querySelector('.window');
    if (this.windowElement) {
      this.updatePosition();
    }
  }

  getTransform(): string {
    if (this.isMaximized) return 'translate(0, 0)';
    if (this.isMinimized) {
      return `scale(0.1) translate(${this.x}px, ${window.innerHeight}px)`;
    }
    return `translate(${this.x}px, ${this.y}px)`;
  }

  startDragging(event: MouseEvent) {
    if (this.isMaximized) return;

    this.isDragging = true;
    this.dragOffset = {
      x: event.clientX - this.x,
      y: event.clientY - this.y,
    };

    if (!this.windowElement) {
      this.windowElement =
        this.elementRef.nativeElement.querySelector('.window');
    }

    // Sürükleme sırasında transition'ı kaldır
    if (this.windowElement) {
      this.windowElement.style.transition = 'none';
    }

    // Zone dışında event dinleyicileri ekle
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDragging);
    });
  }

  onDrag = (event: MouseEvent) => {
    if (!this.isDragging || !this.windowElement) return;

    // requestAnimationFrame ile performansı artır
    requestAnimationFrame(() => {
      const newX = event.clientX - this.dragOffset.x;
      const newY = event.clientY - this.dragOffset.y;

      // Pencereyi sınırlar içinde tut
      const maxX = window.innerWidth - this.width;
      const maxY = window.innerHeight - 36 - this.height; // Taskbar yüksekliği

      this.x = Math.max(0, Math.min(newX, maxX));
      this.y = Math.max(0, Math.min(newY, maxY));

      this.updatePosition();
      this.positionChange.emit({ x: this.x, y: this.y });
    });
  };

  private stopDragging = () => {
    this.isDragging = false;

    // Animasyon frame'ini temizle
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Transition'ı geri ekle
    if (this.windowElement) {
      this.windowElement.style.transition = '';
    }

    // Zone dışında event dinleyicilerini kaldır
    this.ngZone.runOutsideAngular(() => {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDragging);
    });
  };

  onClose() {
    this.close.emit();
  }

  onMinimize() {
    this.isMinimized = true;
    this.minimize.emit();
  }

  restore() {
    if (this.isMinimized) {
      this.isMinimized = false;
      if (this.windowElement) {
        this.windowElement.style.transform = this.getTransform();
      }
    }
  }

  onMaximize() {
    if (this.isMaximized) {
      // Restore
      this.width = this.savedState.width;
      this.height = this.savedState.height;
      this.x = this.savedState.x;
      this.y = this.savedState.y;
    } else {
      // Maximize
      this.savedState = {
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
      };
    }
    this.isMaximized = !this.isMaximized;
    this.maximize.emit();
  }

  private updatePosition() {
    if (!this.windowElement) return;

    if (this.isMaximized) {
      this.windowElement.style.transform = 'none';
      this.windowElement.style.width = '100%';
      this.windowElement.style.height = 'calc(100% - 36px)'; // Taskbar yüksekliği
    } else {
      const transform = `translate(${this.x}px, ${this.y}px)`;
      this.windowElement.style.transform = transform;
      this.windowElement.style.width = `${this.width}px`;
      this.windowElement.style.height = `${this.height}px`;
    }
  }
}
